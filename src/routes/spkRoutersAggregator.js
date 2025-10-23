import express from "express";
import kriteriaRoutes from "./spk/kriteriaRoutes.js";
import alternatifRoutes from "./spk/alternatifRoutes.js";
import nilaiRoutes from "./spk/nilaiRoutes.js";
import perhitunganRoutes from "./spk/perhitunganRoutes.js";
import laporanRoutes from "./spk/laporanRoutes.js";

const router = express.Router();

router.use("/kriteria", kriteriaRoutes);
router.use("/alternatif", alternatifRoutes);
router.use("/nilai", nilaiRoutes);
router.use("/calculate", perhitunganRoutes);
router.use("/laporan", laporanRoutes);

export default router;
