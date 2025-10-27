import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secret.js";

// === Middleware JWT untuk verifikasi token ===
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

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
