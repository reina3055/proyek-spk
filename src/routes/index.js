import express from "express";
import authRoutes from "./auth/authRoutes.js";
import spkRoutersAggregator from "./spk/spkRoutersAggregator.js"; // ⬅️ rename aja
import konversiRoutes from "./spk/konversiRoutes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/spk", spkRoutersAggregator);
router.use("/spk", konversiRoutes);

export default router;
