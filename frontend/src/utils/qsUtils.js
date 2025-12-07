// Simple helpers to parse and stringify the URL query used for UI state syncing
export const toQueryString = ({ search, filters, sortBy, sortOrder, page, pageSize, filters: _f }) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  // We'll stringify filters as needed — only include non-empty arrays
  const f = _f || filters || {};
  if (f.regions?.length) params.set("regions", f.regions.join(","));
  if (f.genders?.length) params.set("genders", f.genders.join(","));
  if (f.productCategories?.length) params.set("productCategories", f.productCategories.join(","));
  if (f.tags?.length) params.set("tags", f.tags.join(","));
  if (f.paymentMethods?.length) params.set("paymentMethods", f.paymentMethods.join(","));
  if (f.ageMin != null) params.set("ageMin", f.ageMin);
  if (f.ageMax != null) params.set("ageMax", f.ageMax);
  if (f.dateFrom) params.set("dateFrom", f.dateFrom);
  if (f.dateTo) params.set("dateTo", f.dateTo);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);
  if (page) params.set("page", page);
  if (pageSize) params.set("pageSize", pageSize);
  return params.toString();
};

export const parseQueryString = (qs) => {
  const p = new URLSearchParams(qs);
  return {
    search: p.get("search") || "",
    filters: {
      regions: p.get("regions") ? p.get("regions").split(",") : [],
      genders: p.get("genders") ? p.get("genders").split(",") : [],
      productCategories: p.get("productCategories") ? p.get("productCategories").split(",") : [],
      tags: p.get("tags") ? p.get("tags").split(",") : [],
      paymentMethods: p.get("paymentMethods") ? p.get("paymentMethods").split(",") : [],
      ageMin: p.get("ageMin") ? Number(p.get("ageMin")) : null,
      ageMax: p.get("ageMax") ? Number(p.get("ageMax")) : null,
      dateFrom: p.get("dateFrom") || null,
      dateTo: p.get("dateTo") || null
    },
    sort: {
      sortBy: p.get("sortBy") || "date",
      sortOrder: p.get("sortOrder") || "desc"
    },
    page: p.get("page") ? Number(p.get("page")) : 1,
    pageSize: p.get("pageSize") ? Number(p.get("pageSize")) : 10
  };
};
