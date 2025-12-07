import React, { useState, useEffect } from "react";
import Select from "react-select";
import { PRODUCT_CATEGORY_OPTIONS, TAG_OPTIONS, PAYMENT_METHOD_OPTIONS } from "../utils/options";


export default function FilterPanel({ filters = {}, onChange }) {
  const [local, setLocal] = useState({
    regions: filters.regions || [],
    genders: filters.genders || [],
    ageMin: filters.ageMin || "",
    ageMax: filters.ageMax || "",
    productCategories: filters.productCategories || [],
    tags: filters.tags || [],
    paymentMethods: filters.paymentMethods || [],
    dateFrom: filters.dateFrom || "",
    dateTo: filters.dateTo || ""
  });

  useEffect(()=> {
    setLocal({
      regions: filters.regions || [],
      genders: filters.genders || [],
      ageMin: filters.ageMin || "",
      ageMax: filters.ageMax || "",
      productCategories: filters.productCategories || [],
      tags: filters.tags || [],
      paymentMethods: filters.paymentMethods || [],
      dateFrom: filters.dateFrom || "",
      dateTo: filters.dateTo || ""
    });
  }, [filters]);

  const apply = () => onChange(local);
  const reset = () => {
    const empty = { regions: [], genders: [], ageMin: "", ageMax: "", productCategories: [], tags: [], paymentMethods: [], dateFrom: "", dateTo: "" };
    setLocal(empty);
    onChange(empty);
  };

  return (
    <div>
      <div className="filter-section">
        <div className="filter-title">Region</div>
        <Select isMulti options={[
          "North","South","East","West"
        ].map(v=>({value:v,label:v}))}
          value={local.regions.map(r=>({value:r,label:r}))}
          onChange={(vals)=> setLocal(prev=>({...prev, regions: vals? vals.map(v=>v.value):[] }))}
          placeholder="Select regions"
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Gender</div>
        <Select isMulti options={["Male","Female","Other"].map(v=>({value:v,label:v}))}
          value={local.genders.map(g=>({value:g,label:g}))}
          onChange={(vals)=> setLocal(prev=>({...prev, genders: vals? vals.map(v=>v.value):[] }))}
          placeholder="Select genders"
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Age Range</div>
        <div style={{ display: 'flex', gap: 8 }}>
          
          {/* Min Age */}
          <input
            type="number"
            min="0"            // prevents negative numbers
            style={{ width: '48%' }}
            placeholder="Min"
            value={local.ageMin ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setLocal(prev => ({
                ...prev,
                ageMin: value < 0 ? 0 : value   // extra protection in JS
              }));
            }}
          />

          {/* Max Age */}
          <input
            type="number"
            min="0"            // also prevents negative numbers
            style={{ width: '48%' }}
            placeholder="Max"
            value={local.ageMax ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setLocal(prev => ({
                ...prev,
                ageMax: value < 0 ? 0 : value   // extra protection in JS
              }));
            }}
          />

        </div>
      </div>


      <div className="filter-section">
        <div className="filter-title">Product Category</div>
        <Select isMulti options={PRODUCT_CATEGORY_OPTIONS}
          value={local.productCategories.map(v=>({value:v,label:v}))}
          onChange={(vals)=> setLocal(prev=>({...prev, productCategories: vals? vals.map(v=>v.value):[] }))}
          placeholder="Select categories"
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Tags</div>
        <Select isMulti options={TAG_OPTIONS}
          value={local.tags.map(v=>({value:v,label:v}))}
          onChange={(vals)=> setLocal(prev=>({...prev, tags: vals? vals.map(v=>v.value):[] }))}
          placeholder="Select tags"
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Payment Method</div>
        <Select isMulti options={PAYMENT_METHOD_OPTIONS}
          value={local.paymentMethods.map(v=>({value:v,label:v}))}
          onChange={(vals)=> setLocal(prev=>({...prev, paymentMethods: vals? vals.map(v=>v.value):[] }))}
          placeholder="Select payment methods"
        />
      </div>

      <div className="filter-section">
        <div className="filter-title">Date Range</div>
        <div style={{display:'flex', gap:8}}>
          <input type="date" value={local.dateFrom||''} onChange={(e)=> setLocal(prev=>({...prev, dateFrom: e.target.value}))} />
          <input type="date" value={local.dateTo||''} onChange={(e)=> setLocal(prev=>({...prev, dateTo: e.target.value}))} />
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn btn-apply" onClick={apply}>Apply</button>
        <button className="btn btn-reset" onClick={reset}>Reset</button>
      </div>

      <div style={{marginTop:14}}>
        { /* chips preview of active filters */ }
        <div className="filter-title" style={{marginBottom:8}}>Active Filters</div>
        <div className="chips">
          {local.regions.map(r=> <div key={r} className="chip">{r}</div>)}
          {local.genders.map(g=> <div key={g} className="chip">{g}</div>)}
          {local.productCategories.map(c=> <div key={c} className="chip">{c}</div>)}
          {local.tags.map(t=> <div key={t} className="chip">{t}</div>)}
          {local.paymentMethods.map(p=> <div key={p} className="chip">{p}</div>)}
          {(local.ageMin || local.ageMax) ? <div className="chip">Age: {local.ageMin || '—'} - {local.ageMax || '—'}</div> : null}
          {(local.dateFrom || local.dateTo) ? <div className="chip">Date: {local.dateFrom || '—'} → {local.dateTo || '—'}</div> : null}
          {!(local.regions.length||local.genders.length||local.productCategories.length||local.tags.length||local.paymentMethods.length||local.ageMin||local.ageMax||local.dateFrom||local.dateTo) && <div className="no-results">No active filters</div>}
        </div>
      </div>
    </div>
  );
}
