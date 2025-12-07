import React from "react";

export default function PaginationControls({ page = 1, totalPages = 1, onPageChange }) {
  const prev = () => { if (page > 1) onPageChange(page - 1); };
  const next = () => { if (page < totalPages) onPageChange(page + 1); };

  // show up to 5 page buttons
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button className="pg-btn" onClick={prev} disabled={page <= 1}>Previous</button>
      {pages.map(p => (
        <button key={p} className="pg-btn" onClick={()=> onPageChange(p)} style={p===page ? {background:'#2563EB', color:'#fff'} : {}}>{p}</button>
      ))}
      <button className="pg-btn" onClick={next} disabled={page >= totalPages}>Next</button>
    </div>
  );
}
