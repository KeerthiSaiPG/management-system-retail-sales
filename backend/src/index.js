import "dotenv/config";
console.log("DATABASE_URL =", process.env.DATABASE_URL);
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
