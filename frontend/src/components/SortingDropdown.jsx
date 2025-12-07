import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

/**
 * Props:
 *  - sort: { sortBy: string, sortOrder: string }
 *  - onChange: (newSort) => void
 *
 * Usage:
 *  <SortingDropdown sort={state.sort} onChange={setSort} />
 */

const OPTIONS = [
  { id: "date_desc", label: "Date (Newest)", sortBy: "date", sortOrder: "desc" },
  { id: "date_asc",  label: "Date (Oldest)",  sortBy: "date", sortOrder: "asc" },
  { id: "qty_asc",   label: "Quantity (Low → High)",  sortBy: "quantity", sortOrder: "asc" },
  { id: "qty_desc",  label: "Quantity (High → Low)",  sortBy: "quantity", sortOrder: "desc" },
  { id: "name_az",   label: "Customer Name (A → Z)",  sortBy: "customerName", sortOrder: "asc" }
];

export default function SortingDropdown({ sort = { sortBy: "date", sortOrder: "desc" }, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Click outside to close
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // keyboard: Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === ref.current?.querySelector(".dropdown-toggle")) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const active = OPTIONS.find(o => o.sortBy === sort.sortBy && o.sortOrder === sort.sortOrder) || OPTIONS[0];

  const handleSelect = (opt) => {
    setOpen(false);
    if (onChange) onChange({ sortBy: opt.sortBy, sortOrder: opt.sortOrder });
  };

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 220 }}>
      <button
        className="sort-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{fontWeight:700}}>{active.label}</div>
          <div style={{color:'#64748B', fontSize:13}}>Sort</div>
        </div>
        <FiChevronDown style={{marginLeft:8}} />
      </button>

      {open && (
        <div className="sort-menu" role="menu" aria-label="Sorting options">
          {OPTIONS.map(opt => {
            const selected = opt.sortBy === sort.sortBy && opt.sortOrder === sort.sortOrder;
            return (
              <button
                key={opt.id}
                className={`sort-item ${selected ? "selected" : ""}`}
                onClick={() => handleSelect(opt)}
                role="menuitem"
              >
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <div style={{fontWeight:600}}>{opt.label}</div>
                </div>
                {selected ? <FiCheck style={{color:'#2563EB'}}/> : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
