import React from "react";

export default function TransactionTable({ items = [] }) {
  if (!items || items.length === 0) return <div className="no-results">No transactions found</div>;

  return (
    <div style={{overflowX:'auto'}}>
      <table className="transactions">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Final Amount</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, idx) => (
            <tr key={idx}>
              <td>{ r.Date ? new Date(r.Date).toLocaleDateString() : (r.DateRaw || '-') }</td>
              <td style={{fontWeight:700}}>{ r["Customer Name (mapped)"] || r["Customer Name"] || "-" }</td>
              <td style={{color:'#6B7280'}}>{r["Phone Number (mapped)"] || r["Phone Number"] || "-"}</td>
              <td>{r["Product Name (mapped)"] || r["Product Name"] || "-"}</td>
              <td><div className="chip" style={{background:'#EEF2FF'}}>{r["Product Category (mapped)"] || r["Product Category"] || "-"}</div></td>
              <td>{r.Quantity ?? 0}</td>
              <td>{ typeof r.FinalAmount === "number" ? `₹ ${Number(r.FinalAmount).toLocaleString()}` : (r.FinalAmountRaw || '-') }</td>
              <td>{r["Payment Method (mapped)"] || r["Payment Method"] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
