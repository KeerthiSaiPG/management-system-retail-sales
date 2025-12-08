import React from "react";
import { getCategoryColor } from "../utils/categoryColors";

export default function TransactionTable({ items = [] }) {
  if (!items || items.length === 0)
    return <div className="no-results">No transactions found</div>;

  return (
    <div style={{ overflowX: "auto" }}>
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
          {items.map((r, idx) => {
            const categoryColor = getCategoryColor(r.product_category);
            return (
            <tr key={idx}>
              {/* DATE */}
              <td>
                {r.date
                  ? new Date(r.date).toLocaleDateString()
                  : "-"}
              </td>

              {/* CUSTOMER */}
              <td style={{ fontWeight: 700 }}>
                {r.customer_name || "-"}
              </td>

              {/* PHONE */}
              <td style={{ color: "#6B7280" }}>
                {r.phone_number || "-"}
              </td>

              {/* PRODUCT */}
              <td>{r.product_name || "-"}</td>

              {/* CATEGORY - with color coding */}
              <td>
                <div 
                  className="chip" 
                  style={{ 
                    background: categoryColor.background,
                    color: categoryColor.text,
                    border: `1px solid ${categoryColor.border}`
                  }}
                >
                  {r.product_category || "-"}
                </div>
              </td>

              {/* QTY */}
              <td>{r.quantity || 0}</td>

              {/* FINAL AMOUNT */}
              <td>
                {r.final_amount
                  ? `₹ ${Number(r.final_amount).toLocaleString()}`
                  : "-"}
              </td>

              {/* PAYMENT METHOD */}
              <td>{r.payment_method || "-"}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
