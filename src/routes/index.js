import express from "express";
import authRoutes from "./auth/authRoutes.js";
import spkRoutes from "./spkRoutersAggregator.js"; // ⬅️ rename aja

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/spk", spkRoutes);

export default router;
