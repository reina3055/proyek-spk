import { pool } from "../../config/db.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/secret.js";



export async function verifyTokenController(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.json({ valid: true, user: decoded });
  } catch (err) {
    console.error("Token invalid:", err.message);
    return res.status(403).json({ valid: false });
  }
}


// === CHECK TOKEN / SESSION ===
export async function checkSession(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("⚠️ Tidak ada token dikirim dari frontend! ")
    return res.status(401).json({ loggedIn: false, message: "Token tidak ada" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("token diterima", token);
    const [rows] = await pool.query(
      "SELECT id, username, nama, email, role, foto FROM users WHERE id=?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ loggedIn: false, message: "User tidak ditemukan" });
    }

    res.json({ loggedIn: true, user: rows[0] });
  } catch (err) {
    console.error("❌ Token error:", err.message);
    res.status(403).json({ loggedIn: false, message: "Token tidak valid" });
  }
}
