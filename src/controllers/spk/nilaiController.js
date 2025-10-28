import { pool } from "../../config/db.js";

export const getAllNilai = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM nilai");
    res.json(rows);
  } catch (err) {
    console.error("getAllNilai error:", err);
    res.status(500).json({ message: "Gagal mengambil data nilai" });
  }
};


export const bulkUpdateNilai = async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ message: "Format data salah!" });

    for (const item of data) {
      const { id_alternatif, id_kriteria, nilai } = item;
      await pool.query(
        `REPLACE INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)`,
        [id_alternatif, id_kriteria, nilai]
      );
    }

    res.json({ message: "Nilai berhasil disimpan!" });
  } catch (err) {
    console.error("bulkUpdateNilai error:", err);
    res.status(500).json({ message: "Gagal menyimpan nilai!" });
  }
};


// ============================
// 🔹 INPUT Nilai
// ============================
// export async function tambahNilai(req, res) {
//   const { id_alternatif, id_kriteria, nilai } = req.body;
//   try {
//     const [cek] = await pool.query(
//       "SELECT * FROM nilai WHERE id_alternatif=? AND id_kriteria=?",
//       [id_alternatif, id_kriteria]
//     );

//     if (cek.length > 0) {
//       await pool.query(
//         "UPDATE nilai SET nilai=? WHERE id_alternatif=? AND id_kriteria=?",
//         [nilai, id_alternatif, id_kriteria]
//       );
//     } else {
//       await pool.query(
//         "INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)",
//         [id_alternatif, id_kriteria, nilai]
//       );
//       alert("✅ Nilai berhasil disimpan!");
// renderInputNilai();

//     }

//     res.json({ message: "✅ Nilai berhasil disimpan" });
//   } catch (err) {
//     console.error("❌ tambahNilai:", err);
//     res.status(500).json({ message: "Gagal menyimpan nilai" });
//   }
// }

