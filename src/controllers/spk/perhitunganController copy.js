// src/controllers/spk/perhitunganController.js

import { pool } from "../../config/db.js";
import { weightedProduct } from "../../utils/WeightedProducts.js";

export async function hitungWP(req, res) {
  try {
    // Ambil data kriteria dan alternatif
    const [kriteria] = await pool.query("SELECT * FROM kriteria ORDER BY id_kriteria");
    const [alternatif] = await pool.query("SELECT * FROM alternatif ORDER BY id_alternatif");

    // Ambil nilai
    const [nilaiRows] = await pool.query(`
      SELECT * FROM nilai ORDER BY id_alternatif, id_kriteria
    `);

    if (!kriteria.length || !alternatif.length) {
      return res.status(400).json({ message: "Kriteria atau alternatif belum lengkap." });
    }

    // Persiapkan data untuk WP
    const bobot = kriteria.map((k) => k.bobot);
    const tipe = kriteria.map((k) => k.tipe);

    // Kelompokkan nilai per alternatif → array
    const alternatifWP = alternatif.map((alt) => {
      const nilaiAlt = nilaiRows
        .filter((n) => n.id_alternatif === alt.id_alternatif)
        .sort((a, b) => a.id_kriteria - b.id_kriteria)
        .map((n) => n.nilai);

      return {
        nama: alt.nama_obat,
        nilai: nilaiAlt
      };
    });

    // Hitung WP
//     console.log("=== alternatifWP ===");
// console.log(JSON.stringify(alternatifWP, null, 2));
    const hasil = weightedProduct(alternatifWP, bobot, tipe);

    // Simpan ke laporan
    const tanggal = new Date().toISOString().slice(0, 10);
    const saran = hasil[0]?.nama || null;

    for (const h of hasil) {
      await pool.query(
        `INSERT INTO laporan_wp 
         (tanggal, nama_alternatif, nilai_preferensi, saran_terbaik) 
         VALUES (?, ?, ?, ?)`,
        [tanggal, h.nama, h.preferensi, saran]
      );
    }

    res.json(hasil);
  } catch (err) {
    console.error("❌ hitungWP:", err);
    res.status(500).json({ message: "Gagal menghitung Weighted Product", error: err.message });
  }
}


// import { pool } from "../../config/db.js";

// // ============================
// // 🔹 HITUNG Weighted Product + Simpan Laporan
// // ============================
// export async function hitungWP(req, res) {
//   try {
//     // Ambil data
//     const [kriteria] = await pool.query("SELECT * FROM kriteria");
//     const [alternatif] = await pool.query("SELECT * FROM alternatif");
//     const [nilai] = await pool.query(`
//       SELECT n.id_alternatif, n.id_kriteria, n.nilai, k.bobot, k.tipe
//       FROM nilai n
//       JOIN kriteria k ON n.id_kriteria = k.id_kriteria
//     `);

//     if (!kriteria.length || !alternatif.length || !nilai.length) {
//       return res.status(400).json({ message: "Data nilai/kriteria/alternatif belum lengkap!" });
//     }

//     // Normalisasi bobot
//     const totalBobot = kriteria.reduce((sum, k) => sum + (k.bobot || 0), 0);
//     const normalisasi = kriteria.map((k) => ({
//       ...k,
//       w: totalBobot > 0 ? k.bobot / totalBobot : 0,
//     }));

//     // Hitung S untuk tiap alternatif
//     const hasil = [];
//     for (const alt of alternatif) {
//       const nilaiAlt = nilai.filter((n) => n.id_alternatif === alt.id_alternatif);
//       if (!nilaiAlt.length) continue; // lewati kalau belum ada nilai

//       let S = 1;
//       for (const k of normalisasi) {
//         const n = nilaiAlt.find((v) => v.id_kriteria === k.id_kriteria);
//         if (!n || n.nilai == null || isNaN(n.nilai) || n.nilai <= 0) continue;

//         const pangkat = k.tipe === "cost" ? -k.w : k.w;
//         S *= Math.pow(n.nilai, pangkat);
//       }

//       hasil.push({ nama_alternatif: alt.nama_obat, S });
//     }

//     // Filter hasil valid
//     const validHasil = hasil.filter((a) => a.S > 0);
//     if (!validHasil.length) {
//       return res.status(400).json({ message: "Belum ada nilai valid untuk dihitung." });
//     }

//     // Normalisasi preferensi
//     const totalS = validHasil.reduce((sum, a) => sum + a.S, 0);
//     const hasilAkhir = validHasil.map((a) => ({
//       nama_alternatif: a.nama_alternatif,
//       nilai_preferensi: a.S / totalS,
//     }));

//     // Urutkan dan simpan laporan
//     hasilAkhir.sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);

//     const tanggal = new Date().toISOString().slice(0, 10);
//     const saran = hasilAkhir[0].nama_alternatif;
//     for (const h of hasilAkhir) {
//       await pool.query(
//         "INSERT INTO laporan_wp (tanggal, nama_alternatif, nilai_preferensi, saran_terbaik) VALUES (?, ?, ?, ?)",
//         [tanggal, h.nama_alternatif, h.nilai_preferensi, saran]
//       );
//     }

//     res.json(hasilAkhir);
//   } catch (err) {
//     console.error("❌ hitungWP:", err);
//     res.status(500).json({ message: "Gagal menghitung Weighted Product", error: err.message });
//   }
// }
