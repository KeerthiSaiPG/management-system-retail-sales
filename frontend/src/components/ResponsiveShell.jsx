import React, { useState } from "react";
import FilterPanel from "./FilterPanel";
import TransactionsTable from "./TransactionsTable";
import "./styles.css";

export default function ResponsiveShell({ data, meta, onFilterChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* header */}
      <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <button
            aria-label={drawerOpen ? "Close filters" : "Open filters"}
            onClick={() => setDrawerOpen(v => !v)}
            className="btn"
            style={{display:'inline-flex', alignItems:'center', justifyContent:'center', width:40, height:40, borderRadius:10}}
          >
            {/* hamburger icon (simple) */}
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="20" height="2" rx="1" fill="#0f172a"/>
              <rect y="6" width="20" height="2" rx="1" fill="#0f172a"/>
              <rect y="12" width="20" height="2" rx="1" fill="#0f172a"/>
            </svg>
          </button>

          <div style={{fontWeight:800}}>Dashboard</div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <input className="search-input" placeholder="Search name, phone..." />
          {/* show sort control on desktop only */}
          <div className="sort-wrapper" style={{display: window.innerWidth > 980 ? "block" : "none"}} />
        </div>
      </header>

      {/* drawer overlay */}
      <div className={`drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />

      {/* drawer */}
      <aside className={`sidebar-drawer ${drawerOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h3 style={{margin:0}}>Filters</h3>
          <button className="btn" onClick={() => setDrawerOpen(false)}>Close</button>
        </div>
        <FilterPanel meta={meta} onFilterChange={(f) => { onFilterChange(f); setDrawerOpen(false); }} />
      </aside>

      {/* main layout for larger screens */}
      <div className="app-shell">
        <aside className="sidebar" aria-label="Filters" style={{display: window.innerWidth > 980 ? "block" : "none"}}>
          <FilterPanel meta={meta} onFilterChange={onFilterChange} />
        </aside>

        <main className="main">
          <section className="transactions-panel glass-card">
            <TransactionsTable data={data} />
          </section>
        </main>
      </div>
    </>
  );
}
