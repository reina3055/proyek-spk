import express from "express";
import multer from "multer";
import path from "path";
import chalk from "chalk";

import { login, logout } from "../../controllers/auth/loginController.js";
import {
  checkSession,
  verifyTokenController,
} from "../../controllers/auth/sessionController.js";
import { updateFotoProfil } from "../../controllers/auth/uploadController.js";
import { verifyToken, authorizeRole } from "../../middleware/authMiddleware.js";
import { 
  registerAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser, } from "../../controllers/auth/registerController.js ";
//import { getAllUsers } from "../../controllers/auth/registerController.js";


const router = express.Router();

// ============================
// 📦 Konfigurasi multer (upload foto profil)
// ============================
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

// ============================
// 🧭 Logging helper
// ============================
function logAction(action, user = "-", color = "blue") {
  const emojiMap = {
    login: "🔐",
    logout: "🚪",
    register: "🧾",
    verify: "✅",
    upload: "📸",
    access: "🧭",
  };
  const colorFn = chalk[color] || chalk.white;
  console.log(
    `${emojiMap[action] || "📍"} ${colorFn(`[AUTH] ${action.toUpperCase()}`)} - User: ${user}`
  );
}

// ============================
// 🔐 Route dengan proteksi middleware
// ============================
router.get(
  "/admin-only",
  verifyToken,
  authorizeRole(["super-admin"]),
  (req, res) => {
    logAction("access", req.user?.username || "super-admin", "magenta");
    res.json({ message: "✅ Hanya super-admin yang bisa lihat ini." });
  }
);

// ============================
// 🔑 Route utama autentikasi
// ============================
router.get("/verify-token", (req, res, next) => {
  logAction("verify", "-", "green");
  next();
}, verifyTokenController);

router.post("/register", async (req, res, next) => {
  logAction("register", req.body?.email || "-", "yellow");
  next();
}, registerAdmin);

router.post("/login", async (req, res, next) => {
  logAction("login", req.body?.email || "-", "cyan");
  next();
}, login);

// router.get("/users", verifyToken, authorizeRole(["super-admin"]), getAllUsers);
// console.log("✅ authRoutes loaded: /api/auth/users aktif");

// router.delete("/spk/users/:id", verifyToken, authorizeRole(["admin", "super-admin"]), deleteUser);

// Kelola pengguna
router.get("/users", verifyToken, authorizeRole(["super-admin", "admin"]), getAllUsers);
router.get("/users/:id", verifyToken, authorizeRole(["super-admin", "admin"]), getUserById);
router.put("/users/:id", verifyToken, authorizeRole(["super-admin, admin"]), updateUser);
router.delete("/users/:id", verifyToken, authorizeRole(["super-admin"]), deleteUser);

router.post("/logout", async (req, res, next) => {
  logAction("logout", req.body?.email || "-", "red");
  next();
}, logout);

router.get("/session", (req, res, next) => {
  logAction("verify", "-", "green");
  next();
}, checkSession);

router.post("/upload-foto", upload.single("foto"), (req, res, next) => {
  logAction("upload", req.body?.id || "-", "blue");
  next();
}, updateFotoProfil);

export default router;
