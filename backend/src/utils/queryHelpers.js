/**
 * SEARCH → FILTER → SORT → PAGINATE
 * Clean reusable pipeline for professional backend systems.
 */

// ----------------------------
// 🔍 SEARCH
// ----------------------------
// ----------------------------
// 🔍 FULL-TEXT SEARCH (STRICT REQUIREMENTS)
// ----------------------------
export const applySearch = (data, search) => {
  if (!search || typeof search !== "string") return data;

  const term = search.trim().toLowerCase();
  if (!term) return data;

  // Pre-split for multi-word search like "john doe"
  const terms = term.split(/\s+/);

  return data.filter((row) => {
    const name = (row["Customer Name"] || "").toLowerCase();
    const phone = (row["Phone Number"] || "").toLowerCase();

    // Full-text accuracy: ALL search parts must match at least one field
    return terms.every((t) => {
      return name.includes(t) || phone.includes(t);
    });
  });
};


// ----------------------------
// 🎛 STRICT MULTI-SELECT & RANGE FILTERING
// ----------------------------
export const applyFilters = (data, filters) => {
  let filtered = [...data];

  const {
    regions,
    genders,
    ageMin,
    ageMax,
    productCategories,
    tags,
    paymentMethods,
    dateFrom,
    dateTo
  } = filters;

  // Normalize all multi-select values to lowercase for stable matching
  const rLower = regions?.map(v => v.toLowerCase()) || [];
  const gLower = genders?.map(v => v.toLowerCase()) || [];
  const cLower = productCategories?.map(v => v.toLowerCase()) || [];
  const tLower = tags?.map(v => v.toLowerCase()) || [];
  const pLower = paymentMethods?.map(v => v.toLowerCase()) || [];

  // ----------------------------
  // REGION FILTER (multi-select)
  // ----------------------------
  if (rLower.length > 0) {
    filtered = filtered.filter((row) => {
      const val = (row["Customer Region"] || "").toLowerCase();
      return rLower.includes(val);
    });
  }

  // ----------------------------
  // GENDER (multi-select)
  // ----------------------------
  if (gLower.length > 0) {
    filtered = filtered.filter((row) => {
      const val = (row.Gender || "").toLowerCase();
      return gLower.includes(val);
    });
  }

  // ----------------------------
  // AGE RANGE (min–max)
  // ----------------------------
  if (ageMin != null || ageMax != null) {
    filtered = filtered.filter((row) => {
      const age = row.Age;
      if (!age) return false;
      if (ageMin != null && age < ageMin) return false;
      if (ageMax != null && age > ageMax) return false;
      return true;
    });
  }

  // ----------------------------
  // PRODUCT CATEGORY (multi-select)
  // ----------------------------
  if (cLower.length > 0) {
    filtered = filtered.filter((row) => {
      const val = (row["Product Category"] || "").toLowerCase();
      return cLower.includes(val);
    });
  }

  // ----------------------------
  // TAGS (multi-select, row contains CSV list)
  // ----------------------------
  if (tLower.length > 0) {
    filtered = filtered.filter((row) => {
      const rowTags = (row.Tags || "")
        .split(",")
        .map((t) => t.trim().toLowerCase());
      
      // any tag must match
      return tLower.some((t) => rowTags.includes(t));
    });
  }

  // ----------------------------
  // PAYMENT METHOD (multi-select)
  // ----------------------------
  if (pLower.length > 0) {
    filtered = filtered.filter((row) => {
      const val = (row["Payment Method"] || "").toLowerCase();
      return pLower.includes(val);
    });
  }

  // ----------------------------
  // DATE RANGE FILTERING
  // ----------------------------
  if (dateFrom || dateTo) {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    filtered = filtered.filter((row) => {
      if (!row.Date) return false;
      const d = new Date(row.Date);

      if (from && d < from) return false;
      if (to && d > to) return false;

      return true;
    });
  }

  return filtered;
};


// ----------------------------
// ↕ SORTING
// ----------------------------
export const applySorting = (data, sortBy, sortOrder = "asc") => {
  if (!sortBy) return data;

  const sorted = [...data];
  const dir = sortOrder === "desc" ? -1 : 1;

  sorted.sort((a, b) => {
    if (sortBy === "finalAmount") {
    const f1 = a.FinalAmount ?? 0;
    const f2 = b.FinalAmount ?? 0;
    return (f1 - f2) * dir;
    }

    // Sort by Date
    if (sortBy === "date") {
      return (a.Date - b.Date) * dir;
    }

    // Sort by Quantity
    if (sortBy === "quantity") {
      const q1 = a.Quantity ?? 0;
      const q2 = b.Quantity ?? 0;
      return (q1 - q2) * dir;
    }

    // Sort by Customer Name A-Z
    if (sortBy === "customerName") {
      const c1 = (a["Customer Name"] || "").toLowerCase();
      const c2 = (b["Customer Name"] || "").toLowerCase();
      return c1 < c2 ? -1 * dir : c1 > c2 ? 1 * dir : 0;
    }

    return 0;
  });

  return sorted;
};

// ----------------------------
// 📄 PAGINATION
// ----------------------------
// backend/src/utils/queryHelpers.js
export const applyPagination = (data, page = 1, pageSize = 10) => {
  const total = Array.isArray(data) ? data.length : 0;

  const p = Number.isFinite(Number(page)) ? Math.max(1, Math.floor(Number(page))) : 1;
  const ps = Number.isFinite(Number(pageSize)) ? Math.max(1, Math.floor(Number(pageSize))) : 10;

  const totalPages = Math.max(1, Math.ceil(total / ps));
  const currentPage = Math.min(Math.max(1, p), totalPages);

  const start = (currentPage - 1) * ps;
  const end = Math.min(start + ps, total);

  // slice will always return at most `ps` items
  const items = Array.isArray(data) ? data.slice(start, end) : [];

  return {
    total,
    page: currentPage,
    pageSize: ps,
    totalPages,
    items
  };
};

