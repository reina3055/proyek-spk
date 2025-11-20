import { pool } from "../../config/db.js";


// ============================
// 🔹 GET Semua Kriteria
// ============================
export async function getKriteria(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM kriteria ORDER BY id_kriteria ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ getKriteria:", err);
    res.status(500).json({ message: "Gagal mengambil data kriteria" });
  }
}

// ============================
// 🔹 TAMBAH Kriteria
// ============================
export async function tambahKriteria(req, res) {
  const { nama_kriteria, bobot, tipe } = req.body;
  console.log("tambahKriteria body:", req.body);

  try {
    const [result] = await pool.query(
      "INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES (?, ?, ?)",
      [nama_kriteria, bobot, tipe]
    );
    res.json({ message: "✅ Kriteria berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ tambahKriteria:", err);
    res.status(500).json({ message: "Gagal menambah kriteria" });
  }
}

// ============================
// 🔹 UPDATE Kriteria
// ============================
export async function updateKriteria(req, res) {
  const { id } = req.params;
  const { nama_kriteria, bobot, tipe } = req.body;
  try {
    await pool.query(
      "UPDATE kriteria SET nama_kriteria=?, bobot=?, tipe=? WHERE id_kriteria=?",
      [ nama_kriteria, bobot, tipe, id ]
    ); 
    res.json({ message: "✅ Kriteria berhasil diperbarui" });
  } catch (err) {
    console.error("❌ updateKriteria:", err);
    res.status(500).json({ message: "Gagal memperbarui kriteria" });
  }
}

// ============================
// 🔹 HAPUS Kriteria
// ============================
// Hapus Kriteria
export async function hapusKriteria(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM nilai WHERE id_kriteria=?", [id]);
    await pool.query("DELETE FROM kriteria WHERE id_kriteria=?", [id]);
    res.json({ message: "✅ Kriteria berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus kriteria" });
  }
}

