
import express from "express";
import cors from "cors";
import compression from "compression";
import salesRoutes from "./routes/salesRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";


const app = express();
app.use(compression()); // <<< add this early, before routes
app.use(cors());
app.use(express.json());


// API routes
app.use("/api/sales", salesRoutes);
app.use("/api/metadata", metadataRoutes);

// 404 and error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

