import React from "react";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import SortingDropdown from "./components/SortingDropdown";
import TransactionTable from "./components/TransactionTable";
import PaginationControls from "./components/PaginationControls";
import useSalesQuery from "./hooks/useSalesQuery";

export default function App() {
  const {
    state,
    setSearch,
    setFilters,
    setSort,
    setPage,
    reload
  } = useSalesQuery();

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo"></div>
          <div>
            <div className="h-title">Retail Sales Management System</div>
          </div>
        </div>

        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{minWidth:220}}>
            <SearchBar value={state.search} onSearch={setSearch} />
          </div>
          <SortingDropdown sort={state.sort} onChange={setSort} />
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar card">
          <FilterPanel filters={state.filters} onChange={setFilters} />
        </aside>

        <main className="main">
          <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
              <div style={{fontWeight:700}}>Transactions</div>
              <div style={{color:'#6B7280', fontSize:13}}>Showing {state.items.length} of {state.total}</div>
            </div>

            <div className="stats" style={{marginBottom:12}}>
              <div className="stat">
                <div>
                  <div className="lbl">Total Transactions</div>
                  <div className="val">{state.total}</div>
                </div>
                <div style={{textAlign:'right', color: 'var(--muted)'}}>All time</div>
              </div>

              <div className="stat">
                <div>
                  <div className="lbl">Current Page</div>
                  <div className="val">{state.page}</div>
                </div>
                <div style={{textAlign:'right', color:'var(--muted)'}}>Page size {state.pageSize}</div>
              </div>

              <div className="stat">
                <div>
                  <div className="lbl">Results</div>
                  <div className="val">{state.items.length}</div>
                </div>
                <div style={{textAlign:'right', color:'var(--muted)'}}>Filtered</div>
              </div>
            </div>

            <TransactionTable items={state.items} />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
              <div style={{color:'var(--muted)'}}>Tip: Use filters to narrow results</div>
              <PaginationControls page={state.page} totalPages={state.totalPages} onPageChange={setPage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
