import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({ value = "", onSearch }) {
  const [q, setQ] = useState(value);

  useEffect(()=> setQ(value), [value]);

  const submit = (e) => {
    e?.preventDefault();
    onSearch(q);
  };

  return (
    <form className="search-bar" onSubmit={submit} role="search">
      <FiSearch style={{color:'#9CA3AF'}}/>
      <input
        aria-label="Search"
        placeholder="Search customer name or phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {q ? <button type="button" className="icon-btn" aria-label="clear" onClick={() => { setQ(''); onSearch(''); }}>
        <FiX />
      </button> : null}
      <button type="submit" className="btn btn-apply" style={{marginLeft:6}}>Search</button>
    </form>
  );
}
