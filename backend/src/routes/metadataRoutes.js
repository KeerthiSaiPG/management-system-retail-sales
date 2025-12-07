import { Router } from "express";
import { getMetadata } from "../services/metadataService.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    const meta = getMetadata();
    return res.json({
      success: true,
      ...meta
    });
  } catch (err) {
    console.error("Metadata error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load metadata"
    });
  }
});

export default router;