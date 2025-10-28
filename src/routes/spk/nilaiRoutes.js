import express from "express";
//import { bulkUpdateNilai } from "../../controllers/spk/nilaiController.js";
//ganti dengan
import { getAllNilai } from "../../controllers/spk/nilaiController.js";
import { bulkUpdateNilai } from "../../controllers/index.js";
const router = express.Router();

router.get("/", getAllNilai); // kalau sudah ada
router.post("/bulk", bulkUpdateNilai);

export default router;


// import express from "express";
// import { verifyToken } from "../../middleware/authMiddleware.js";
// import { tambahNilai } from "../../controllers/index.js";

// const router = express.Router();

// router.use(verifyToken);
// router.post("/", tambahNilai);

// export default router;
