import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import {
  getLaporan,
  exportLaporanExcel,
  exportLaporanPDF
} from "../../controllers/index.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getLaporan);
router.get("/excel", exportLaporanExcel);
router.get("/pdf", exportLaporanPDF);

export default router;
