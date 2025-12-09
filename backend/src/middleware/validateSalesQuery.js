// backend/src/middleware/validateSalesQuery.js
import { query, validationResult } from "express-validator";

/**
 * Validation chain for GET /api/sales and /api/sales/export
 * Uses optional({ checkFalsy: true }) to treat empty strings as "not provided"
 */

export const salesQueryValidationRules = () => {
  return [
    // paging
    query("page").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("page must be integer >= 1"),
    query("pageSize").optional({ checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage("pageSize must be integer 1..100"),

    // search
    query("search").optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }).withMessage("search too long"),

    // multi-select CSVs (accept empty/missing)
    query("regions").optional({ checkFalsy: true }).isString().trim(),
    query("genders").optional({ checkFalsy: true }).isString().trim(),
    query("productCategories").optional({ checkFalsy: true }).isString().trim(),
    query("tags").optional({ checkFalsy: true }).isString().trim(),
    query("paymentMethods").optional({ checkFalsy: true }).isString().trim(),

    // ages (allow missing/empty)
    query("ageMin").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("ageMin must be a number >= 0"),
    query("ageMax").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("ageMax must be a number >= 0"),

    // dates - accept ISO only, but allow missing/empty
    query("dateFrom").optional({ checkFalsy: true }).isISO8601().withMessage("dateFrom must be a valid date (ISO8601)"),
    query("dateTo").optional({ checkFalsy: true }).isISO8601().withMessage("dateTo must be a valid date (ISO8601)"),

    // sorting
    query("sortBy").optional({ checkFalsy: true }).isString().trim(),
    query("sortOrder").optional({ checkFalsy: true }).isIn(["asc", "desc"]).withMessage("sortOrder must be 'asc' or 'desc'"),
  ];
};

export const validateSalesQuery = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map(err => ({ param: err.param, msg: err.msg }));
    console.warn("Validation failed:", JSON.stringify(extracted));
    return res.status(400).json({
      success: false,
      errors: extracted
    });
  }

  // cross-field validations (ageMin <= ageMax, dateFrom <= dateTo) — optional but helpful
  const ageMin = req.query.ageMin !== undefined && req.query.ageMin !== "" ? Number(req.query.ageMin) : null;
  const ageMax = req.query.ageMax !== undefined && req.query.ageMax !== "" ? Number(req.query.ageMax) : null;
  if (ageMin != null && ageMax != null && ageMin > ageMax) {
    return res.status(400).json({ success: false, errors: [{ param: "ageRange", msg: "ageMin cannot be greater than ageMax" }] });
  }

  const dateFrom = req.query.dateFrom || null;
  const dateTo = req.query.dateTo || null;
  if (dateFrom && dateTo) {
    const dFrom = new Date(dateFrom);
    const dTo = new Date(dateTo);
    if (!Number.isNaN(dFrom.getTime()) && !Number.isNaN(dTo.getTime()) && dFrom > dTo) {
      return res.status(400).json({ success: false, errors: [{ param: "dateRange", msg: "dateFrom cannot be after dateTo" }] });
    }
  }

  return next();
};
