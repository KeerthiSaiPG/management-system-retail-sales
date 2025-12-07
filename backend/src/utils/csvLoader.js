// backend/src/utils/csvLoader.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const __dirname = path.resolve();
let SALES_DATA = [];

const normalizeHeader = (h = "") => {
  if (!h) return h;
  h = h.replace(/^\uFEFF/, ""); // remove BOM
  return h.trim().replace(/\s+/g, " ");
};

const parseMoney = (v) => {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const cleaned = s.replace(/[^\d.,-]/g, "");
  if (cleaned === "") return null;
  let normalized = cleaned;
  if (cleaned.indexOf(",") !== -1 && cleaned.indexOf(".") !== -1) {
    normalized = cleaned.replace(/,/g, "");
  } else if (cleaned.indexOf(",") !== -1 && cleaned.indexOf(".") === -1) {
    normalized = cleaned.replace(/,/g, "");
  }
  const n = Number(normalized);
  if (Number.isNaN(n)) return null;
  return n;
};

const parseNumber = (v) => {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const cleaned = s.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
};

const findKeyByPattern = (keysLower, patterns) => {
  for (const pat of patterns) {
    // exact match first
    if (keysLower[pat]) return keysLower[pat];
  }
  // fallback: substring match (contains)
  for (const k of Object.keys(keysLower)) {
    for (const pat of patterns) {
      if (k.includes(pat)) return keysLower[k];
    }
  }
  return null;
};

export const loadSalesData = () => {
  return new Promise((resolve, reject) => {
    const rows = [];
    const filePath = path.join(__dirname, "src", "data", "sales.csv");

    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => normalizeHeader(header) }))
      .on("data", (row) => rows.push(row))
      .on("end", () => {
        const results = [];

        for (const rawRow of rows) {
          // trim all string values
          const cleaned = {};
          for (const k of Object.keys(rawRow)) {
            const v = rawRow[k];
            cleaned[k] = typeof v === "string" ? v.trim() : v;
          }

          // build lower-key map for lookup
          const keysLower = {};
          for (const k of Object.keys(cleaned)) keysLower[k.toLowerCase()] = k;

          // Candidate patterns (lowercase, no spaces) for common columns
          const datePatterns = ["date", "order date", "orderdate", "transaction date", "transactiondate", "sale date", "sales date", "transaction"];
          const finalPatterns = ["final amount", "finalamount", "final_amt", "final", "finalamount(inr)", "total amount", "totalamount", "amount paid", "amountpaid", "amount"];
          const quantityPatterns = ["quantity", "qty", "count"];
          const custNamePatterns = ["customer name", "customer", "name"];
          const phonePatterns = ["phone", "phone number", "phone_number", "mobile", "mobile number"];
          const productNamePatterns = ["product name", "productname", "product"];
          const productCategoryPatterns = ["product category", "category", "productcategory"];
          const paymentPatterns = ["payment method", "paymentmethod", "payment", "payment type", "payment_type"];

          const dateKey = findKeyByPattern(keysLower, datePatterns) || null;
          const finalKey = findKeyByPattern(keysLower, finalPatterns) || null;
          const qtyKey = findKeyByPattern(keysLower, quantityPatterns) || null;
          const nameKey = findKeyByPattern(keysLower, custNamePatterns) || null;
          const phoneKey = findKeyByPattern(keysLower, phonePatterns) || null;
          const productKey = findKeyByPattern(keysLower, productNamePatterns) || null;
          const categoryKey = findKeyByPattern(keysLower, productCategoryPatterns) || null;
          const paymentKey = findKeyByPattern(keysLower, paymentPatterns) || null;

          // Raw extracted values
          const dateRaw = dateKey ? cleaned[dateKey] : null;
          const finalRaw = finalKey ? cleaned[finalKey] : null;
          const qtyRaw = qtyKey ? cleaned[qtyKey] : null;
          const custRaw = nameKey ? cleaned[nameKey] : null;
          const phoneRaw = phoneKey ? cleaned[phoneKey] : null;
          const productRaw = productKey ? cleaned[productKey] : null;
          const categoryRaw = categoryKey ? cleaned[categoryKey] : null;
          const paymentRaw = paymentKey ? cleaned[paymentKey] : null;

          // Parse date
          let parsedDate = null;
          if (dateRaw) {
            const d = new Date(dateRaw);
            if (!Number.isNaN(d.getTime())) parsedDate = d;
            else {
              // try parse dd/mm/yyyy or dd-mm-yyyy
              const m = dateRaw.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
              if (m) {
                const dd = Number(m[1]), mm = Number(m[2]), yy = Number(m[3]);
                const year = yy < 100 ? (yy > 50 ? 1900+yy : 2000+yy) : yy;
                const d2 = new Date(year, mm - 1, dd);
                if (!Number.isNaN(d2.getTime())) parsedDate = d2;
              }
            }
          }

          const finalNum = parseMoney(finalRaw);
          const qtyNum = parseNumber(qtyRaw);

          // canonical normalized row
          const normalized = {
            ...cleaned,                 // preserve original columns
            DateRaw: dateRaw,
            Date: parsedDate,           // JS Date or null
            FinalAmountRaw: finalRaw,
            FinalAmount: finalNum,      // number or null
            QuantityRaw: qtyRaw,
            Quantity: qtyNum,
            "Customer Name (mapped)": custRaw,
            "Phone Number (mapped)": phoneRaw,
            "Product Name (mapped)": productRaw,
            "Product Category (mapped)": categoryRaw,
            "Payment Method (mapped)": paymentRaw
          };

          // === ADD THIS BLOCK ===
          // Precompute search text for fast searching
          const name = (normalized["Customer Name (mapped)"] || "").toString().toLowerCase();
          const phone = (normalized["Phone Number (mapped)"] || "")
            .toString()
            .toLowerCase()
            .replace(/\D/g, "");
          normalized.__searchText = `${name} ${phone}`;
          // === END ADD ===
          results.push(normalized);
        }

        SALES_DATA = results;
        resolve();
      })
      .on("error", (err) => reject(err));
  });
};

export const getSalesData = () => SALES_DATA;
