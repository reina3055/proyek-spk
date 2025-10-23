import { pool } from "../../config/db.js";


// ============================
// 🔹 INPUT Nilai
// ============================
export async function tambahNilai(req, res) {
  const { id_alternatif, id_kriteria, nilai } = req.body;
  try {
    const [cek] = await pool.query(
      "SELECT * FROM nilai WHERE id_alternatif=? AND id_kriteria=?",
      [id_alternatif, id_kriteria]
    );

    if (cek.length > 0) {
      await pool.query(
        "UPDATE nilai SET nilai=? WHERE id_alternatif=? AND id_kriteria=?",
        [nilai, id_alternatif, id_kriteria]
      );
    } else {
      await pool.query(
        "INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)",
        [id_alternatif, id_kriteria, nilai]
      );
      alert("✅ Nilai berhasil disimpan!");
renderInputNilai();

    }

    res.json({ message: "✅ Nilai berhasil disimpan" });
  } catch (err) {
    console.error("❌ tambahNilai:", err);
    res.status(500).json({ message: "Gagal menyimpan nilai" });
  }
}

