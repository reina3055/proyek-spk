import { pool } from "../config/db.js";

// Cari user berdasarkan username
export async function findUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0];
}

// Buat admin baru
export async function createAdmin(username, hashedPassword) {
  const [result] = await pool.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')",
    [username, hashedPassword]
  );
  return result.insertId;
}

// Update foto profil user
export async function updateUserPhoto(id, filePath) {
  await pool.query("UPDATE users SET foto=? WHERE id=?", [filePath, id]);
}
