import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const fetchSales = async (query, signal) => {
  // Build URLSearchParams to keep params consistent
  const params = new URLSearchParams();
  for (const key in query) {
    if (query[key] == null) continue;

    if (Array.isArray(query[key])) {
      if (query[key].length === 0) continue;
      params.set(key, query[key].join(","));
    } else {
      params.set(key, String(query[key]));
    }
  }

  const url = `${API_BASE}/api/sales?${params.toString()}`;

  const { data } = await axios.get(url, {
    signal, // <-- Pass AbortController signal here
  });

  return data;
};
