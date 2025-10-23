import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { tambahNilai } from "../../controllers/index.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", tambahNilai);

export default router;
