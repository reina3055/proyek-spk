import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import {
  getKriteria,
  getKriteriaById,
  tambahKriteria,
  updateKriteria,
  hapusKriteria
} from "../../controllers/index.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getKriteria);
router.get("/:id", getKriteriaById);
router.post("/", tambahKriteria);
router.put("/:id", updateKriteria);
router.delete("/:id", hapusKriteria);

export default router;
