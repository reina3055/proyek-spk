import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import {
  getKriteria,
  tambahKriteria,
  updateKriteria,
  hapusKriteria
} from "../../controllers/index.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getKriteria);
router.post("/", tambahKriteria);
router.put("/:id", updateKriteria);
router.delete("/:id", hapusKriteria);

export default router;
