import { pool } from "../../config/db.js";


// ============================
// 🔹 HITUNG Weighted Product + Simpan Laporan
// ============================
export async function hitungWP(req, res) {
  try {
    const [kriteria] = await pool.query("SELECT * FROM kriteria");
    const [alternatif] = await pool.query("SELECT * FROM alternatif");
    const [nilai] = await pool.query("SELECT * FROM nilai");

    if (kriteria.length === 0 || alternatif.length === 0) {
      return res.status(400).json({ message: "Data kriteria/alternatif belum lengkap!" });
    }

    const totalBobot = kriteria.reduce((sum, k) => sum + k.bobot, 0);
    const normalisasi = kriteria.map((k) => ({
      ...k,
      w: k.bobot / totalBobot,
    }));

    const hasil = alternatif.map((alt) => {
      const nilaiAlt = nilai.filter((n) => n.id_alternatif === alt.id_alternatif);

      // Pastikan semua kriteria punya nilai
      if (nilaiAlt.length !== kriteria.length) {
        return { nama_alternatif: alt.nama_obat, nilai_preferensi: 0 };
      }

      let S = 1;
      normalisasi.forEach((k) => {
        const n = nilaiAlt.find((v) => v.id_kriteria === k.id_kriteria);
        if (n && n.nilai > 0) {
          const pangkat = k.tipe === "cost" ? -k.w : k.w;
          S *= Math.pow(n.nilai, pangkat);
        }
      });

      return { nama_alternatif: alt.nama_obat, S };
    });

    // Filter hanya alternatif valid
    const validHasil = hasil.filter((a) => a.S > 0);
    if (validHasil.length === 0) {
      return res.status(400).json({ message: "Belum ada nilai valid untuk dihitung." });
    }

    const totalS = validHasil.reduce((sum, a) => sum + a.S, 0);
    const hasilAkhir = validHasil.map((a) => ({
      nama_alternatif: a.nama_alternatif,
      nilai_preferensi: a.S / totalS,
    }));

    hasilAkhir.sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);

    // ✅ Simpan ke tabel laporan_wp (dengan timestamp)
    const tanggal = new Date().toISOString().slice(0, 10);
    for (const h of hasilAkhir) {
      await pool.query(
        "INSERT INTO laporan_wp (tanggal, nama_alternatif, nilai_preferensi) VALUES (?, ?, ?)",
        [tanggal, h.nama_alternatif, h.nilai_preferensi]
      );
    }

    res.json(hasilAkhir);
  } catch (err) {
    console.error("❌ hitungWP:", err);
    res.status(500).json({ message: "Gagal menghitung Weighted Product", error: err.message });
  }
}
  // Simpan ke tabel laporan_wp + saran terbaik
// const saran = hasilAkhir[0].nama_alternatif;
// for (const h of hasilAkhir) {
//   await pool.query(
//     "INSERT INTO laporan_wp (tanggal, nama_alternatif, nilai_preferensi, saran_terbaik) VALUES (?, ?, ?, ?)",
//     [tanggal, h.nama_alternatif, h.nilai_preferensi, saran]
//   );
// }
// }
