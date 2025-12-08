// src/services/salesService.js
import pool from "../db.js";

const MAX_PAGE_SIZE = 100;

// Normalize query params into a clean object
function normalizeQuery(query) {
  const toArray = (val) =>
    !val
      ? []
      : Array.isArray(val)
      ? val
      : String(val)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  return {
    search: query.search ? String(query.search).trim() : "",
    regions: toArray(query.regions),
    genders: toArray(query.genders),
    productCategories: toArray(query.productCategories),
    tags: toArray(query.tags),
    paymentMethods: toArray(query.paymentMethods),
    ageMin:
      query.ageMin !== undefined && query.ageMin !== ""
        ? Number(query.ageMin)
        : null,
    ageMax:
      query.ageMax !== undefined && query.ageMax !== ""
        ? Number(query.ageMax)
        : null,
    dateFrom: query.dateFrom || null,
    dateTo: query.dateTo || null,
    sortBy: query.sortBy || "date",
    sortOrder: query.sortOrder === "asc" ? "asc" : "desc",
    page: Math.max(1, Number(query.page) || 1),
    pageSize: Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(query.pageSize) || 10)
    ),
  };
}

// Build WHERE clause + params for prepared statement
function buildWhereClause(q, params) {
  const clauses = [];

  if (q.search) {
    // case-insensitive search on name & phone
    params.push(`%${q.search}%`);
    const idx = params.length;
    clauses.push(
      `(customer_name ILIKE $${idx} OR phone_number ILIKE $${idx})`
    );
  }

  if (q.regions.length) {
    params.push(q.regions);
    const idx = params.length;
    clauses.push(`customer_region = ANY($${idx})`);
  }

  if (q.genders.length) {
    params.push(q.genders);
    const idx = params.length;
    clauses.push(`gender = ANY($${idx})`);
  }

  if (q.productCategories.length) {
    params.push(q.productCategories);
    const idx = params.length;
    clauses.push(`product_category = ANY($${idx})`);
  }

  if (q.paymentMethods.length) {
    params.push(q.paymentMethods);
    const idx = params.length;
    clauses.push(`payment_method = ANY($${idx})`);
  }

  if (q.tags.length) {
    // tags is stored as a plain TEXT like "Eco-friendly,Organic"
    // We match any of the selected tags via OR of ILIKEs
    const tagClauses = [];
    for (const tag of q.tags) {
      params.push(`%${tag}%`);
      const idx = params.length;
      tagClauses.push(`tags ILIKE $${idx}`);
    }
    if (tagClauses.length) {
      clauses.push(`(${tagClauses.join(" OR ")})`);
    }
  }

  if (q.ageMin != null) {
    params.push(q.ageMin);
    const idx = params.length;
    // NULLIF avoids '' cast errors
    clauses.push(`NULLIF(age, '')::int >= $${idx}`);
  }

  if (q.ageMax != null) {
    params.push(q.ageMax);
    const idx = params.length;
    clauses.push(`NULLIF(age, '')::int <= $${idx}`);
  }

  if (q.dateFrom) {
    params.push(q.dateFrom);
    const idx = params.length;
    clauses.push(`date::date >= $${idx}::date`);
  }

  if (q.dateTo) {
    params.push(q.dateTo);
    const idx = params.length;
    clauses.push(`date::date <= $${idx}::date`);
  }

  return clauses.length ? "WHERE " + clauses.join(" AND ") : "";
}

// Map sortBy from API to actual SQL expression
function getSortExpression(sortBy) {
  switch (sortBy) {
    case "date":
      return "date::date";
    case "quantity":
      return "NULLIF(quantity, '')::int";
    case "finalAmount":
    case "final_amount":
      return "NULLIF(final_amount, '')::numeric";
    case "customer_name":
    case "customerName":
      return "customer_name";
    default:
      return "date::date";
  }
}

/**
 * Main function used by /api/sales
 */
export async function getSales(query) {
  const q = normalizeQuery(query);
  const params = [];
  const where = buildWhereClause(q, params);

  // count query
  const countSql = `SELECT COUNT(*)::bigint AS total FROM sales ${where}`;
  const countRes = await pool.query(countSql, params);
  const total = Number(countRes.rows[0].total || 0);

  const sortExpr = getSortExpression(q.sortBy);
  const sortOrder = q.sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (q.page - 1) * q.pageSize;

  // data query
  const dataSql = `
    SELECT
      transaction_id,
      date,
      customer_id,
      customer_name,
      phone_number,
      gender,
      age,
      customer_region,
      customer_type,
      product_id,
      product_name,
      brand,
      product_category,
      tags,
      quantity,
      price_per_unit,
      discount_percentage,
      total_amount,
      final_amount,
      payment_method,
      order_status,
      delivery_type,
      store_id,
      store_location,
      salesperson_id,
      employee_name,
      id
    FROM sales
    ${where}
    ORDER BY ${sortExpr} ${sortOrder}
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  const dataParams = params.concat([q.pageSize, offset]);
  const rowsRes = await pool.query(dataSql, dataParams);

  const totalPages = Math.max(1, Math.ceil(total / q.pageSize));

  return {
    items: rowsRes.rows,
    total,
    page: q.page,
    pageSize: q.pageSize,
    totalPages,
  };
}

/**
 * Used by /api/sales/export – returns ALL matching rows (no pagination)
 */
export async function runPipelineNoPagination(query) {
  const q = normalizeQuery(query);
  const params = [];
  const where = buildWhereClause(q, params);

  const sortExpr = getSortExpression(q.sortBy);
  const sortOrder = q.sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const sql = `
    SELECT
      transaction_id        AS "Transaction ID",
      date                  AS "Date",
      customer_id           AS "Customer ID",
      customer_name         AS "Customer Name",
      phone_number          AS "Phone Number",
      gender                AS "Gender",
      age                   AS "Age",
      customer_region       AS "Customer Region",
      customer_type         AS "Customer Type",
      product_id            AS "Product ID",
      product_name          AS "Product Name",
      brand                 AS "Brand",
      product_category      AS "Product Category",
      tags                  AS "Tags",
      quantity              AS "Quantity",
      price_per_unit        AS "Price per Unit",
      discount_percentage   AS "Discount Percentage",
      total_amount          AS "Total Amount",
      final_amount          AS "Final Amount",
      payment_method        AS "Payment Method",
      order_status          AS "Order Status",
      delivery_type         AS "Delivery Type",
      store_id              AS "Store ID",
      store_location        AS "Store Location",
      salesperson_id        AS "Salesperson ID",
      employee_name         AS "Employee Name"
    FROM sales
    ${where}
    ORDER BY ${sortExpr} ${sortOrder}
  `;

  const res = await pool.query(sql, params);
  return res.rows;
}
