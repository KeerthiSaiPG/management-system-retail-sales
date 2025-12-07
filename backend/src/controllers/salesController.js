import { getSales, runPipelineNoPagination } from "../services/salesService.js";

/**
 * GET /api/sales
 */
export const getSalesHandler = (req, res) => {
  try {
    const result = getSales(req.query);
    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("Error in getSalesHandler:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * GET /api/sales/export
 */
export const getSalesExportHandler = (req, res) => {
  try {
    const rows = runPipelineNoPagination(req.query);

    const headers = [
      "Date","Customer ID","Customer Name","Phone Number","Gender","Age","Customer Region","Customer Type",
      "Product ID","Product Name","Brand","Product Category","Tags",
      "Quantity","Price per Unit","Discount Percentage","Total Amount","Final Amount",
      "Payment Method","Order Status","Delivery Type","Store ID","Store Location","Salesperson ID","Employee Name"
    ];

    const escape = (v = "") => {
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };

    const lines = [];
    lines.push(headers.join(","));

    for (const r of rows) {
      const row = headers.map((h) => escape(r[h] ?? ""));
      lines.push(row.join(","));
    }

    const csv = lines.join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=sales_export.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Error in getSalesExportHandler:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to export sales data"
    });
  }
};
