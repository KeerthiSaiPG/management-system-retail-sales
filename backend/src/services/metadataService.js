// src/services/metadataService.js
import pool from "../db.js";

export async function getMetadata() {
  const meta = {};

  // Helper to fetch distinct values sorted alphabetically
  async function distinct(column) {
    const sql = `SELECT DISTINCT ${column} AS val FROM sales WHERE ${column} IS NOT NULL AND ${column} <> '' ORDER BY val ASC`;
    const res = await pool.query(sql);
    return res.rows.map(r => r.val);
  }

  meta.productCategories = await distinct("product_category");
  meta.tags = await distinct("tags");
  meta.paymentMethods = await distinct("payment_method");
  meta.regions = await distinct("customer_region");
  meta.genders = await distinct("gender");

  return meta;
}
