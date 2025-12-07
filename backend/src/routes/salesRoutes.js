import { Router } from "express";
import { getSalesHandler, getSalesExportHandler } from "../controllers/salesController.js";
import { salesQueryValidationRules, validateSalesQuery } from "../middleware/validateSalesQuery.js";

const router = Router();

// Main paginated sales endpoint
router.get("/", salesQueryValidationRules(), validateSalesQuery, getSalesHandler);

// CSV export (no pagination)
router.get("/export", salesQueryValidationRules(), validateSalesQuery, getSalesExportHandler);

export default router;
