import { pool } from "../../config/db.js";


// export async function getAutoFilledValues(req, res) {
//   try {
//     // Ambil kriteria dan alternatif
//     const [kriteria] = await pool.query("SELECT id_kriteria, nama_kriteria, bobot, tipe FROM kriteria ORDER BY id_kriteria");
//     const [alternatif] = await pool.query("SELECT id_alternatif, nama_obat FROM alternatif ORDER BY id_alternatif");

//     // Ambil nilai final yang ada di tabel nilai (hasil auto-konversi / seed / previous manual)
//     const [nilaiRows] = await pool.query("SELECT id_alternatif, id_kriteria, nilai FROM nilai");

//     // Ambil override untuk menandai sumber
//     const [overrides] = await pool.query("SELECT id_alternatif, id_kriteria, nilai as nilai_override FROM nilai_override");

//     // Buat map untuk nilai cepat lookup
//     const nilaiMap = new Map();
//     for (const r of nilaiRows) {
//       nilaiMap.set(`${r.id_alternatif}__${r.id_kriteria}`, { nilai: r.nilai, source: "auto" });
//     }
//     for (const o of overrides) {
//       // jika ada override, pakai override sebagai source
//       nilaiMap.set(`${o.id_alternatif}__${o.id_kriteria}`, { nilai: o.nilai_override ?? o.nilai_override, source: "override" });
//       // note: we insert override native value below in upsert path
//     }

    // Format nilai array
//     const nilai = [];
//     for (const alt of alternatif) {
//       for (const kri of kriteria) {
//         const key = `${alt.id_alternatif}__${kri.id_kriteria}`;
//         const found = nilaiMap.get(key);
//         nilai.push({
//           id_alternatif: alt.id_alternatif,
//           id_kriteria: kri.id_kriteria,
//           nilai: found ? found.nilai : null,
//           source: found ? found.source : "none"
//         });
//       }
//     }

//     res.json({ kriteria, alternatif, nilai });
//   } catch (err) {
//     console.error("getAutoFilledValues:", err);
//     res.status(500).json({ message: "Gagal ambil nilai autofill", error: err.message });
//   }
// }
export const getAllNilai = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM nilai");
    res.json(rows);
  } catch (err) {
    console.error("getAllNilai error:", err);
    res.status(500).json({ message: "Gagal mengambil data nilai" });
  }
};


export async function bulkUpdateNilai(req, res) {
  const payload = req.body;

  if (!Array.isArray(payload)) {
    return res.status(400).json({ message: "Payload harus berupa array" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const u of payload) {
      const id_alt = u.id_alternatif;
      const id_kri = u.id_kriteria;
      const val = Number(u.nilai);

      if (!id_alt || !id_kri || isNaN(val)) continue;

      await conn.query(
        `INSERT INTO nilai (id_alternatif, id_kriteria, nilai)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)`,
        [id_alt, id_kri, val]
      );
    }

    await conn.commit();
    res.json({ success: true, message: "Nilai berhasil disimpan" });
  } catch (err) {
    await conn.rollback();
    console.error("bulkUpdateNilai:", err);
    res.status(500).json({ success: false, message: "Gagal simpan nilai", error: err.message });
  } finally {
    conn.release();
  }
}


// export async function bulkUpdateNilai(req, res) {
//   const payload = req.body;

//   if (!Array.isArray(payload)) {
//     return res.status(400).json({ message: "Payload harus berupa array" });
//   }

//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     for (const u of payload) {
//       const id_alt = u.id_alternatif;
//       const id_kri = u.id_kriteria;
//       const val = Number(u.nilai);

//       if (!id_alt || !id_kri || isNaN(val)) continue;

//       await conn.query(
//         `INSERT INTO nilai (id_alternatif, id_kriteria, nilai)
//          VALUES (?, ?, ?)
//          ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)`,
//         [id_alt, id_kri, val]
//       );
//     }

//     await conn.commit();
//     res.json({ success: true, message: "Nilai berhasil disimpan" });
//   } catch (err) {
//     await conn.rollback();
//     console.error("bulkUpdateNilai:", err);
//     res.status(500).json({
//       success: false,
//       message: "Gagal simpan nilai",
//       error: err.message
//     });
//   } finally {
//     conn.release();
//   }
// }


/**
 * POST /api/spk/nilai/bulk-update
 * Body: { updates: [{ id_alternatif, id_kriteria, nilai, alasan? }], user? }
 * Lakukan upsert ke tabel nilai dan juga upsert ke nilai_override.
 */
// export async function bulkUpdateNilai(req, res) {
//   const payload = req.body;
//   if (!payload || !Array.isArray(payload.updates)) {
//     return res.status(400).json({ message: "Payload tidak tepat" });
//   }
//   const updates = payload.updates;
//   const user = payload.user || null;

//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     for (const u of updates) {
//       const id_alt = u.id_alternatif;
//       const id_kri = u.id_kriteria;
//       const val = Number(u.nilai);

//       if (!id_alt || !id_kri || isNaN(val)) continue;

//       // Upsert ke tabel nilai (nilai final yang dipakai WP)
//       await conn.query(
//         `INSERT INTO nilai (id_alternatif, id_kriteria, nilai)
//          VALUES (?, ?, ?)
//          ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)`,
//         [id_alt, id_kri, val]
//       );

//       // Simpan override di tabel nilai_override
//       await conn.query(
//         `INSERT INTO nilai_override (id_alternatif, id_kriteria, nilai, user, alasan)
//          VALUES (?, ?, ?, ?, ?)
//          ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), user = VALUES(user), alasan = VALUES(alasan), updated_at = CURRENT_TIMESTAMP`,
//         [id_alt, id_kri, val, user, u.alasan || null]
//       );
//     }

//     await conn.commit();
//     res.json({ success: true, message: "Nilai berhasil disimpan" });
//   } catch (err) {
//     await conn.rollback();
//     console.error("bulkUpdateNilai:", err);
//     res.status(500).json({ success: false, message: "Gagal simpan nilai", error: err.message });
//   } finally {
//     conn.release();
//   }
// }

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

