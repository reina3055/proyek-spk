import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import {
  getAlternatif,
  getAlternatifById,
  tambahAlternatif,
  updateAlternatif,
  hapusAlternatif
} from "../../controllers/index.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAlternatif);
router.post("/", tambahAlternatif);
router.get("/:id", getAlternatifById);
router.put("/:id", updateAlternatif);
router.delete("/:id", hapusAlternatif);

export default router;
