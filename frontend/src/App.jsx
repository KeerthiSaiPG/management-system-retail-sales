import React, { useEffect } from "react";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import SortingDropdown from "./components/SortingDropdown";
import TransactionTable from "./components/TransactionTable";
import PaginationControls from "./components/PaginationControls";
import useSalesQuery from "./hooks/useSalesQuery";
import logo from "./assets/logo.png";

export default function App() {
  const {
    state,
    setSearch,
    setFilters,
    setSort,
    setPage,
    reload
  } = useSalesQuery();

  // Wake backend for production
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || "";
    fetch(`${base}/api/sales?page=1&pageSize=1`).catch(() => {});
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="logo">
            <img
              src={logo}
              alt="Retail Sales Management System Logo"
              className="logo-img"
            />
          </div>
          <div>
            <div className="h-title">Retail Sales Management System</div>
          </div>
        </div>

        {/* Search + Sorting */}
        <div className="header-controls">
          <div className="search-wrapper">
            <SearchBar value={state.search} onSearch={setSearch} />
          </div>
          <SortingDropdown sort={state.sort} onChange={setSort} />
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="layout">
        {/* FILTER SIDEBAR */}
        <aside className="sidebar card">
          <FilterPanel filters={state.filters} onChange={setFilters} />
        </aside>

        {/* TABLE SECTION */}
        <main className="main">
          <div className="card">
            <div className="table-header-info">
              <div className="table-title">Transactions</div>
              <div className="table-summary">Showing {state.items.length} of {state.total}</div>
            </div>

            {/* STATS */}
            <div className="stats" style={{ marginBottom: 12 }}>
              <div className="stat">
                <div>
                  <div className="lbl">Total Transactions</div>
                  <div className="val">{state.total}</div>
                </div>
                <div className="stat-meta">All time</div>
              </div>

              <div className="stat">
                <div>
                  <div className="lbl">Current Page</div>
                  <div className="val">{state.page}</div>
                </div>
                <div className="stat-meta">Page size {state.pageSize}</div>
              </div>

              <div className="stat">
                <div>
                  <div className="lbl">Results</div>
                  <div className="val">{state.items.length}</div>
                </div>
                <div className="stat-meta">Filtered</div>
              </div>
            </div>

            {/* TABLE */}
            <TransactionTable items={state.items} />

            {/* FOOTER */}
            <div className="table-footer">
              <div className="pagination-tip">Tip: Use filters to narrow results</div>
              <PaginationControls
                page={state.page}
                totalPages={state.totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
