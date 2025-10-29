import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { hitungWP } from "../../controllers/spk/perhitunganController.js"; // pastikan import langsung

const router = express.Router();

router.use(verifyToken);

// ✅ alias /calculate agar cocok dengan frontend
router.get("/calculate", hitungWP);
router.get("/", hitungWP);

export default router;
