import express from "express";
import { verifyToken } from "../src/middleware/authMiddleware.js";
import {
  getKriteria,
  tambahKriteria,
  updateKriteria,
  hapusKriteria,
  getAlternatif,
  tambahAlternatif,
  updateAlternatif,
  hapusAlternatif,
  tambahNilai,
  hitungWP,
  getLaporan,
  exportLaporanExcel,
  exportLaporanPDF
} from "../controllers/spkControllers.js";

const router = express.Router();

// --- Kriteria ---
router.get("/kriteria", getKriteria);
router.post("/kriteria", tambahKriteria);
router.put("/kriteria/:id", updateKriteria);
router.delete("/kriteria/:id", hapusKriteria);

// --- Alternatif ---
router.get("/alternatif", getAlternatif);
router.post("/alternatif", tambahAlternatif);
router.put("/alternatif/:id", updateAlternatif);
router.delete("/alternatif/:id", hapusAlternatif);

// --- Nilai ---
router.post("/nilai", tambahNilai);

// --- Perhitungan WP ---
router.get("/calculate", hitungWP);

//laporna

router.get("/laporan", getLaporan);

//Xport laporan ke excel
router.get("/laporan/excel", exportLaporanExcel);

//Xport laporan ke pdf
router.get("/laporan/pdf", exportLaporanPDF); 

router.use(verifyToken); // aktifkan middleware untuk semua di bawahnya


export default router;
