import express from "express";
import {
  getAllStok,
  getStokById,
  createStok,
  updateStok,
  deleteStok,
} from "../../controllers/spk/stokController.js";

const router = express.Router();

router.get("/", getAllStok);
router.get("/:id", getStokById);
router.post("/", createStok);
router.put("/:id", updateStok);
router.delete("/:id", deleteStok);

export default router;
