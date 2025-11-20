import express from "express";
import kriteriaRoutes from "./kriteriaRoutes.js";
import alternatifRoutes from "./alternatifRoutes.js";
import nilaiRoutes from "./nilaiRoutes.js";
import perhitunganRoutes from "./perhitunganRoutes.js";
import laporanRoutes from "./laporanRoutes.js";
import stokRoutes from "./stokRoutes.js";



const router = express.Router();

router.use("/kriteria", kriteriaRoutes);
router.use("/alternatif", alternatifRoutes);
router.use("/nilai", nilaiRoutes);
router.use("/calculate", perhitunganRoutes);
router.use("/stok", stokRoutes);
router.use("/laporan", laporanRoutes);
//router.use("/nilai", nilaiRoutes);

export default router;
