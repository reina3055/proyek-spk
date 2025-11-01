import express from "express";
import authRoutes from "./auth/authRoutes.js";
import spkRoutersAggregator from "./spk/spkRoutersAggregator.js"; // ⬅️ rename aja

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/spk", spkRoutersAggregator);

export default router;
