// src/controllers/salesController.js
import { getSales, runPipelineNoPagination } from "../services/salesService.js";

export const getSalesHandler = async (req, res) => {
  try {
    const result = await getSales(req.query);

    return res.json({
      success: true,
      ...result,        // <-- IMPORTANT: spreads items, total, page, pageSize, totalPages
    });
  } catch (err) {
    console.error("Error in getSalesHandler:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSalesExportHandler = async (req, res) => {
  try {
    const rows = await runPipelineNoPagination(req.query);

    const headers = Object.keys(rows[0] || {});

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
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales_export.csv"
    );

    return res.send(csv);
  } catch (err) {
    console.error("Error in getSalesExportHandler:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to export sales data",
    });
  }
};
