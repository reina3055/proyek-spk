import express from "express";
import multer from "multer";
import path from "path";
import chalk from "chalk";

import { login, logout, changePassword } from "../../controllers/auth/loginController.js";
import {
  checkSession,
  verifyTokenController,
} from "../../controllers/auth/sessionController.js";
import { updateFotoProfil } from "../../controllers/auth/uploadController.js";
import { verifyToken, checkRole } from "../../middleware/authMiddleware.js"; // Pastikan pakai checkRole saja biar konsisten
import { 
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserPassword, 
} from "../../controllers/auth/registerController.js";

import spkRoutes from "../spk/spkRoutersAggregator.js";

const router = express.Router();

// ============================
// 📦 Konfigurasi multer
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
    login: "🔐", logout: "🚪", register: "🧾",
    verify: "✅", upload: "📸", access: "🧭",
  };
  const colorFn = chalk[color] || chalk.white;
  console.log(`${emojiMap[action] || "📍"} ${colorFn(`[AUTH] ${action.toUpperCase()}`)} - User: ${user}`);
}

// ============================
// 🔑 Auth Dasar (Login, Register, Verify)
// ============================
router.get("/verify-token", (req, res, next) => { logAction("verify", "-", "green"); next(); }, verifyTokenController);
router.post("/register", (req, res, next) => { logAction("register", "-", "yellow"); next(); }, register);
router.post("/login", (req, res, next) => { logAction("login", "-", "cyan"); next(); }, login);
router.post("/logout", (req, res, next) => { logAction("logout", "-", "red"); next(); }, logout);
router.get("/session", checkSession);

// ============================
// 🛡️ PROTECTED ROUTES (Butuh Token)
// ============================

// 1. UPLOAD FOTO (Bisa Admin & Super Admin)
router.post(
  "/upload-foto", 
  verifyToken, 
  checkRole(['admin', 'super-admin']), // ✨ DITAMBAHKAN: Izin dua role
  upload.single("foto"), 
  (req, res, next) => { logAction("upload", req.user?.id || "-", "blue"); next(); }, 
  updateFotoProfil
);

// 2. GANTI PASSWORD (Bisa Admin & Super Admin)
router.post(
  "/change-password", 
  verifyToken, 
  checkRole(['admin', 'super-admin']), // ✨ DITAMBAHKAN
  changePassword
);


// E. RESET PASSWORD USER (Hanya Super Admin)
router.put(
  "/users/:id/reset-password", 
  verifyToken, 
  checkRole(['super-admin']), // 🔒 Hanya Bos yang boleh
  resetUserPassword
);

// ============================
// 👥 MANAJEMEN USER (CRUD)
// ============================

// A. GET ALL USERS (Khusus Super Admin untuk kelola pengguna)
router.get(
  "/users", 
  verifyToken, 
  checkRole(['admin', 'super-admin']), // ✨ HANYA SUPER ADMIN
  getAllUsers
);

// B. GET USER BY ID (Bisa keduanya - misal buat load profil sendiri)
router.get(
  "/users/:id", 
  verifyToken, 
  checkRole(['admin', 'super-admin']), 
  getUserById
);

// C. UPDATE USER (Bisa keduanya - buat update profil sendiri)
router.put(
  "/users/:id", 
  verifyToken, 
  checkRole(['admin', 'super-admin']), // ✨ UPDATE DIBUKA BUAT KEDUANYA
  updateUser
);

// D. DELETE USER (Hanya Super Admin yang boleh hapus user)
router.delete(
  "/users/:id", 
  verifyToken, 
  checkRole(['super-admin']), 
  deleteUser
);


// ============================
// 💊 JALUR SPK (Obat & Perhitungan)
// ============================
// Admin boleh akses. 
// Super-Admin: Tergantung kebijakanmu. Kalau mau aman, block aja. 
// Kalau mau super admin bisa lihat doang, masukkan ke array checkRole.
router.use("/spk", verifyToken, checkRole(['admin']), spkRoutes);

export default router;


// import express from "express";
// import multer from "multer";
// import path from "path";
// import chalk from "chalk";

// import { login, logout, changePassword } from "../../controllers/auth/loginController.js";
// import {
//   checkSession,
//   verifyTokenController,
// } from "../../controllers/auth/sessionController.js";
// import { updateFotoProfil } from "../../controllers/auth/uploadController.js";
// import { verifyToken, authorizeRole, checkRole } from "../../middleware/authMiddleware.js";
// import { 
//   register,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser, } from "../../controllers/auth/registerController.js ";
// //import { getAllUsers } from "../../controllers/auth/registerController.js";
// import userRoutes from "../userRoutes.js";
// import spkRoutes from "../spk/spkRoutersAggregator.js";

// const router = express.Router();

// // ============================
// // 📦 Konfigurasi multer (upload foto profil)
// // ============================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(process.cwd(), "public/uploads"));
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `foto_${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // ============================
// // 🧭 Logging helper
// // ============================
// function logAction(action, user = "-", color = "blue") {
//   const emojiMap = {
//     login: "🔐",
//     logout: "🚪",
//     register: "🧾",
//     verify: "✅",
//     upload: "📸",
//     access: "🧭",
//   };
//   const colorFn = chalk[color] || chalk.white;
//   console.log(
//     `${emojiMap[action] || "📍"} ${colorFn(`[AUTH] ${action.toUpperCase()}`)} - User: ${user}`
//   );
// }

// // ============================
// // 🔐 Route dengan proteksi middleware
// // ============================
// router.get(
//   "/admin-only",
//   verifyToken,
//   authorizeRole(["admin"]),
//   (req, res) => {
//     logAction("access", req.user?.username || "admin", "magenta");
//     res.json({ message: "✅ Hanya admin yang bisa lihat ini." });
//   }
// );

// // ============================
// // 🔑 Route utama autentikasi
// // ============================
// router.get("/verify-token", (req, res, next) => {
//   logAction("verify", "-", "green");
//   next();
// }, verifyTokenController);

// router.post("/register", async (req, res, next) => {
//   logAction("register", req.body?.email || "-", "yellow");
//   next();
// }, register);

// router.post("/login", async (req, res, next) => {
//   logAction("login", req.body?.email || "-", "cyan");
//   next();
// }, login);

// router.get(
//   "/users", 
//   verifyToken, 
//   checkRole(['super-admin']), // Hanya Super Admin yang boleh lihat semua user
//   getAllUsers
// );

// // =================================================================
// // 1. JALUR SUPER-ADMIN (Hanya boleh kelola user/keamanan)
// // =================================================================
// // Super-Admin BOLEH masuk sini, Admin BIASA DILARANG.
// router.use("/users", verifyToken, checkRole(['super-admin']), userRoutes);


// // =================================================================
// // 2. JALUR ADMIN APOTEKER (SPK, Obat, Laporan)
// // =================================================================
// // Admin BOLEH masuk sini. 
// // Pertanyaannya: Apakah Super-Admin boleh intip SPK?
// // OPSI A: Kalau Super-Admin BENAR-BENAR DILARANG lihat SPK:
// router.use("/spk", verifyToken, checkRole(['admin']), spkRoutes);

// // OPSI B: Kalau Super-Admin BOLEH lihat tapi gak boleh ngubah (perlu logic lain), 
// // atau boleh akses penuh juga:
// // router.use("/spk", verifyToken, checkRole(['admin', 'super-admin']), spkRoutes);
// // router.get("/users", verifyToken, authorizeRole(["super-admin"]), getAllUsers);
// // console.log("✅ authRoutes loaded: /api/auth/users aktif");

// // router.delete("/spk/users/:id", verifyToken, authorizeRole(["admin", "super-admin"]), deleteUser);

// // Kelola pengguna
// router.get("/users", verifyToken, authorizeRole(["admin"]), getAllUsers);
// router.get("/users/:id", verifyToken, authorizeRole(["admin"]), getUserById);
// router.put("/users/:id", verifyToken, authorizeRole(["admin"]), updateUser);
// router.delete("/users/:id", verifyToken, authorizeRole(["admin"]), deleteUser);

// router.post("/logout", async (req, res, next) => {
//   logAction("logout", req.body?.email || "-", "red");
//   next();
// }, logout);

// router.get("/session", (req, res, next) => {
//   logAction("verify", "-", "green");
//   next();
// }, checkSession);

// router.post("/upload-foto", upload.single("foto"), (req, res, next) => {
//   logAction("upload", req.body?.id || "-", "blue");
//   next();
// }, updateFotoProfil);

// router.post("/change-password", verifyToken, (req, res, next) => {
//  logAction("password", req.user?.username || "-", "yellow"); // Opsional kalau mau log
//   next();
// }, changePassword);

// export default router;
