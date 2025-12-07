import app from "./app.js";
import { loadSalesData } from "./utils/csvLoader.js";

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await loadSalesData();
    console.log("Sales data loaded!");
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();