import { pool } from "../../config/db.js";


import { SECRET_KEY } from "../../config/secret.js";

// ============================
// 🔹 UPDATE FOTO PROFIL
// ============================
export async function updateFotoProfil(req, res) {
  try {
    const { id } = req.body;
    const filePath = `/uploads/${req.file.filename}`;

    await pool.query("UPDATE users SET foto=? WHERE id=?", [filePath, id]);
    res.json({ message: "✅ Foto profil berhasil diperbarui", foto: filePath });
  } catch (err) {
    console.error("❌ updateFotoProfil:", err);
    res.status(500).json({ message: "Gagal mengupdate foto profil" });
  }
}
