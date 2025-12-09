import { Router } from "express";
import { getSalesHandler, getSalesExportHandler } from "../controllers/salesController.js";
import { salesQueryValidationRules, validateSalesQuery } from "../middleware/validateSalesQuery.js";

const router = Router();


router.get("/", salesQueryValidationRules(), validateSalesQuery, getSalesHandler);


router.get("/export", salesQueryValidationRules(), validateSalesQuery, getSalesExportHandler);

export default router;
