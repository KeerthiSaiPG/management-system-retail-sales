// backend/src/services/salesService.js
import { getSalesData } from "../utils/csvLoader.js";
import { applySearch, applyFilters, applySorting, applyPagination } from "../utils/queryHelpers.js";

/* cache config */
const CACHE_TTL_MS = 8 * 1000; // 8 seconds
const queryCache = new Map();  // key -> { ts, payload }

const cacheKey = (q) => JSON.stringify(q || {});

const cacheGet = (key) => {
  const entry = queryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    queryCache.delete(key);
    return null;
  }
  return entry.payload;
};

const cacheSet = (key, payload) => {
  try {
    // shallow clone payload to avoid accidental mutation from outside
    const copy = { ...payload, items: Array.isArray(payload.items) ? payload.items.slice() : [] };
    queryCache.set(key, { ts: Date.now(), payload: copy });
  } catch (e) {
    // if cloning fails, still set original
    queryCache.set(key, { ts: Date.now(), payload });
  }
};

/* safe number coercion */
const toNumberSafe = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) && !Number.isNaN(n) ? Math.max(1, Math.floor(n)) : fallback;
};

export const getSales = (query) => {
  // normalize query shape to keyable values
  const q = {
    search: (query.search || "").toString(),
    regions: (query.regions || "").toString(),
    genders: (query.genders || "").toString(),
    productCategories: (query.productCategories || "").toString(),
    tags: (query.tags || "").toString(),
    paymentMethods: (query.paymentMethods || "").toString(),
    ageMin: query.ageMin ?? "",
    ageMax: query.ageMax ?? "",
    dateFrom: query.dateFrom ?? "",
    dateTo: query.dateTo ?? "",
    sortBy: query.sortBy ?? "",
    sortOrder: query.sortOrder ?? "",
    page: toNumberSafe(query.page, 1),
    pageSize: toNumberSafe(query.pageSize, 10)
  };

  const key = cacheKey(q);
  const cached = cacheGet(key);
  if (cached) {
    // Return a shallow copy so callers don't mutate cached data
    return { success: true, ...cached };
  }

  let data = getSalesData();

  const filters = {
    regions: q.regions ? q.regions.split(",").map(s => s.trim()).filter(Boolean) : [],
    genders: q.genders ? q.genders.split(",").map(s => s.trim()).filter(Boolean) : [],
    productCategories: q.productCategories ? q.productCategories.split(",").map(s => s.trim()).filter(Boolean) : [],
    tags: q.tags ? q.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
    paymentMethods: q.paymentMethods ? q.paymentMethods.split(",").map(s => s.trim()).filter(Boolean) : [],
    ageMin: q.ageMin !== "" ? Number(q.ageMin) : null,
    ageMax: q.ageMax !== "" ? Number(q.ageMax) : null,
    dateFrom: q.dateFrom || null,
    dateTo: q.dateTo || null,
  };

  data = applySearch(data, q.search);
  data = applyFilters(data, filters);
  data = applySorting(data, q.sortBy, q.sortOrder);

  const pagination = applyPagination(data, q.page, q.pageSize);

  // store in cache (TTL)
  cacheSet(key, pagination);

  return { success: true, ...pagination };
};

export const runPipelineNoPagination = (query) => {
  const q = {
    search: (query.search || "").toString(),
    regions: (query.regions || "").toString(),
    genders: (query.genders || "").toString(),
    productCategories: (query.productCategories || "").toString(),
    tags: (query.tags || "").toString(),
    paymentMethods: (query.paymentMethods || "").toString(),
    ageMin: query.ageMin ?? "",
    ageMax: query.ageMax ?? "",
    dateFrom: query.dateFrom ?? "",
    dateTo: query.dateTo ?? "",
    sortBy: query.sortBy ?? "",
    sortOrder: query.sortOrder ?? ""
  };

  const key = cacheKey(q);
  const cached = cacheGet(key);
  if (cached) {
    // cached may be paginated object; return full items if present
    return cached.items || [];
  }

  let data = getSalesData();

  const filters = {
    regions: q.regions ? q.regions.split(",").map(s => s.trim()).filter(Boolean) : [],
    genders: q.genders ? q.genders.split(",").map(s => s.trim()).filter(Boolean) : [],
    productCategories: q.productCategories ? q.productCategories.split(",").map(s => s.trim()).filter(Boolean) : [],
    tags: q.tags ? q.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
    paymentMethods: q.paymentMethods ? q.paymentMethods.split(",").map(s => s.trim()).filter(Boolean) : [],
    ageMin: q.ageMin !== "" ? Number(q.ageMin) : null,
    ageMax: q.ageMax !== "" ? Number(q.ageMax) : null,
    dateFrom: q.dateFrom || null,
    dateTo: q.dateTo || null,
  };

  data = applySearch(data, q.search);
  data = applyFilters(data, filters);
  data = applySorting(data, q.sortBy, q.sortOrder);

  // store a light cached shape (without items slice limitation)
  const payload = { total: data.length, items: data.slice(0, 1000), page: 1, pageSize: Math.min(1000, data.length), totalPages: Math.max(1, Math.ceil(data.length / Math.min(1000, data.length))) };
  cacheSet(key, payload);

  return data;
};
