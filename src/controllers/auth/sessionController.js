import { pool } from "../../config/db.js";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../../config/secret.js";


// === CHECK TOKEN / SESSION ===
export async function checkSession(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(200).json({ loggedIn: false, message: "Token tidak ada" });

  try {
    // ✅ Gunakan secret dari environment
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const [rows] = await pool.query(
      "SELECT id, username, role, foto FROM users WHERE id=?",
      [decoded.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ loggedIn: false, message: "User tidak ditemukan" });

    res.json({ loggedIn: true, user: rows[0] });
  } catch (err) {
    res.status(403).json({ loggedIn: false, message: "Token tidak valid" });
  }
}
