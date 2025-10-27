import { pool } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/secret.js";

// === LOGIN ===
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Semua field wajib diisi!" });

  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0)
    return res.status(401).json({ message: "Username tidak ditemukan!" });

  const user = rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    return res.status(401).json({ message: "Password salah!" });

  // ✅ Gunakan SECRET_KEY dari config
  console.log("SECRET_KEY dari loginController:", SECRET_KEY);

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login berhasil!", token });
}

// === LOGOUT (hapus token di sisi client) ===
export async function logout(req, res) {
  res.json({ message: "Logout berhasil! Hapus token di client side." });
}
