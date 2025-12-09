
import express from "express";
import cors from "cors";
import compression from "compression";
import salesRoutes from "./routes/salesRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import db from "./db.js";


const app = express();
app.use(compression()); // <<< add this early, before routes
app.use(cors());
app.use(express.json());


// API routes
app.use("/api/sales", salesRoutes);
app.use("/api/metadata", metadataRoutes);

// Lightweight ping route to wake the DB (Neon) and the host (Render)
app.get("/ping", async (req, res) => {
	try {
		await db.query("SELECT 1");
		res.status(200).send("OK");
	} catch (err) {
		console.error("/ping error:", err);
		res.status(500).send("DB error");
	}
});

// 404 and error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

