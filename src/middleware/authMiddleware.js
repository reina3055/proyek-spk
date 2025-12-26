import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secret.js";

// === Middleware JWT untuk verifikasi token ===
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>
  //ganti dengan ini
 if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan di header Authorization." });
  }

  const token =
  req.headers.authorization?.split(" ")[1] ||
  req.query.token ||
  req.body.token;


  if (!token) {
    console.warn("🚫 Token tidak ditemukan di header Authorization.");
    return res.status(401).json({ message: "Token tidak ditemukan!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token tidak valid:", err.message);
    return res.status(403).json({ message: "Token tidak valid!" });
  }
}
export function authorizeRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  };
}

export const isSuperAdmin = (req, res, next) => {
    // req.user biasanya didapat dari middleware verifikasi token sebelumnya
    if (req.user && req.user.role === 'super-admin') {
        next();
    } else {
        return res.status(403).json({ message: "Akses ditolak! Hanya Super Admin." });
    }
};

// Middleware Cek Role (Bisa terima 1 role atau lebih)
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Pastikan req.user ada (dari verifyToken sebelumnya)
    if (!req.user) {
      return res.status(401).json({ message: "Tidak terautentikasi." });
    }

    // Cek apakah role user ada di daftar yang diizinkan
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ 
        message: "Akses Ditolak! Role anda tidak memiliki izin untuk fitur ini." 
      });
    }
  };
};