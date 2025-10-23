import { pool } from "../../config/db.js";
// ============================
// 🔹 GET Semua Alternatif
// ============================
export async function getAlternatif(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM alternatif ORDER BY id_alternatif ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ getAlternatif:", err);
    res.status(500).json({ message: "Gagal mengambil data alternatif" });
  }
}

// ============================
// 🔹 TAMBAH Alternatif
// ============================
export async function tambahAlternatif(req, res) {
  const { nama_obat } = req.body;
  console.log("tambahAlternatif body:", req.body);
  try {
    const [result] = await pool.query(
      "INSERT INTO alternatif (nama_obat) VALUES (?)",
      [nama_obat]
    );
    res.json({ message: "✅ Alternatif berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ tambahAlternatif:", err);
    res.status(500).json({ message: "Gagal menambah alternatif" });
  }
}

// ============================
// 🔹 UPDATE Alternatif
// ============================
export async function updateAlternatif(req, res) {
  const { id } = req.params;
  const { nama_obat } = req.body;
  try {
    await pool.query("UPDATE alternatif SET nama_obat=? WHERE id_alternatif=?", [
      nama_obat,
      id,
    ]);
    res.json({ message: "✅ Alternatif diperbarui" });
  } catch (err) {
    console.error("❌ updateAlternatif:", err);
    res.status(500).json({ message: "Gagal memperbarui alternatif" });
  }
}

// ============================
// 🔹 HAPUS Alternatif
// ============================
// Hapus Alternatif
export async function hapusAlternatif(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM nilai WHERE id_alternatif=?", [id]);
    await pool.query("DELETE FROM alternatif WHERE id_alternatif=?", [id]);
    res.json({ message: "✅ Alternatif berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus alternatif" });
  }
}

// Hasil WP — pastikan hasilAkhir terdefinisi sebelum digunakan
// Pindahkan INSERT laporan setelah res.json, hapus duplikasi bawah.



