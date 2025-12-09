import React from "react";
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

  if (import.meta.env.PROD) {
    return (
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="logo">
              <img
                src={logo}
                alt="Retail Sales Management System Logo"
                className="logo-img"
              />
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="container">
      {/* HEADER: Logo, Title, Search & Sorting Controls */}
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

        {/* Search and Sort - Stack vertically on mobile, horizontally on desktop */}
        <div className="header-controls">
          <div className="search-wrapper">
            <SearchBar value={state.search} onSearch={setSearch} />
          </div>
          <SortingDropdown sort={state.sort} onChange={setSort} />
        </div>
      </header>

      {/* MAIN LAYOUT: Sidebar (Filter) on LEFT for desktop, STACKED on mobile */}
      <div className="layout">
        {/* FILTER SIDEBAR: Left on desktop, Top on mobile */}
        <aside className="sidebar card">
          <FilterPanel filters={state.filters} onChange={setFilters} />
        </aside>

        {/* TABLE SECTION: Right on desktop, Bottom on mobile */}
        <main className="main">
          <div className="card">
            {/* Title & Summary Info */}
            <div className="table-header-info">
              <div className="table-title">Transactions</div>
              <div className="table-summary">Showing {state.items.length} of {state.total}</div>
            </div>

            {/* STATS: Responsive grid that stacks on mobile */}
            <div className="stats" style={{marginBottom:12}}>
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

            {/* TABLE with horizontal scroll on mobile */}
            <TransactionTable items={state.items} />

            {/* Pagination & Tip */}
            <div className="table-footer">
              <div className="pagination-tip">Tip: Use filters to narrow results</div>
              <PaginationControls page={state.page} totalPages={state.totalPages} onPageChange={setPage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
