import express from "express";
import { autoKonversiNilai } from "../../utils/autoKonversiNilaiKliniscopy.js";

const router = express.Router();

router.post("/refresh", async (req, res) => {
  try {
    await autoKonversiNilai();
    res.json({ success: true, message: "Nilai klinis berhasil diperbarui!" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
