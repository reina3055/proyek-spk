import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { hitungWP } from "../../controllers/index.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", hitungWP);

export default router;
