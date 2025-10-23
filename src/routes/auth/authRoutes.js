import express from "express";
import multer from "multer";
import path from "path";

import { registerAdmin } from "../../controllers/auth/registerController.js";
import { login, logout } from "../../controllers/auth/loginController.js";
import { checkSession } from "../../controllers/auth/sessionController.js";
import { updateFotoProfil } from "../../controllers/auth/uploadController.js";

const router = express.Router();

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `foto_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// === ROUTES ===
router.post("/register", registerAdmin);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", checkSession);
router.post("/upload-foto", upload.single("foto"), updateFotoProfil);

export default router;
