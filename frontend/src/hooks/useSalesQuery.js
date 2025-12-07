import { useEffect, useState, useCallback } from "react";
import { fetchSales } from "../api/salesApi";
import { parseQueryString, toQueryString } from "../utils/qsUtils";

const DEFAULT_PAGE_SIZE = 10;

export default function useSalesQuery() {
  // Initialize from location.search so state is shareable/bookmarkable
  const initial = parseQueryString(window.location.search);

  const [search, setSearchRaw] = useState(initial.search || "");
  const [filters, setFiltersRaw] = useState(initial.filters || {});
  const [sort, setSortRaw] = useState(initial.sort || { sortBy: "date", sortOrder: "desc" });
  const [page, setPageRaw] = useState(initial.page || 1);
  const [pageSize] = useState(initial.pageSize || DEFAULT_PAGE_SIZE);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Helpers that also sync URL (keeps app state persistent)
  const syncUrl = useCallback(() => {
    const q = toQueryString({ search, filters, ...sort, page, pageSize });
    const newUrl = `${window.location.pathname}?${q}`;
    window.history.replaceState(null, "", newUrl);
  }, [search, filters, sort, page, pageSize]);

  useEffect(() => { syncUrl(); }, [syncUrl]);

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      // Build api query shape expected by backend
      const apiQuery = {
        search,
        regions: (filters.regions || []).join(","),
        genders: (filters.genders || []).join(","),
        ageMin: filters.ageMin ?? "",
        ageMax: filters.ageMax ?? "",
        productCategories: (filters.productCategories || []).join(","),
        tags: (filters.tags || []).join(","),
        paymentMethods: (filters.paymentMethods || []).join(","),
        dateFrom: filters.dateFrom || "",
        dateTo: filters.dateTo || "",
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        page,
        pageSize
      };

      const res = await fetchSales(apiQuery, signal);
      if (res && res.success) {
        setItems(res.items || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch sales", err);
    } finally {
      setLoading(false);
    }
  }, [search, filters, sort, page, pageSize]);

  // Load whenever query state changes
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const t = setTimeout(() => {
      load(signal);
    }, 220);

    return () => {
      clearTimeout(t);
      controller.abort(); // cancel pending axios request
    };
  }, [load]);



  // Wrapped setters that reset page when relevant
  const setSearch = (val) => { setSearchRaw(val); setPageRaw(1); };
  const setFilters = (f) => { setFiltersRaw(f); setPageRaw(1); };
  const setSort = (s) => { setSortRaw(s); setPageRaw(1); };
  const setPage = (p) => { setPageRaw(p); };

  const reload = () => load();

  // Expose a single state object to components
  return {
    state: { search, filters, sort, page, pageSize, items, total, totalPages, loading },
    setSearch,
    setFilters,
    setSort,
    setPage,
    reload
  };
}
