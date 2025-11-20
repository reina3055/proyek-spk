import { pool } from "../../config/db.js";

// ================================
// 🔹 Weighted Product Final Version
// ================================
export async function hitungWP(req, res) {
  try {
    // 1. Ambil data dasar
    const [alternatif] = await pool.query("SELECT * FROM alternatif");
    const [kriteria] = await pool.query("SELECT * FROM kriteria");
    const [nilaiRows] = await pool.query("SELECT * FROM nilai");

    if (!alternatif.length || !kriteria.length) {
      return res.status(400).json({ message: "Data alternatif atau kriteria kosong" });
    }

    // 2. Normalisasi bobot
    const totalBobot = kriteria.reduce((a, b) => a + Number(b.bobot), 0);

    const normalized = kriteria.map(k => ({
      ...k,
      w: Number(k.bobot) / totalBobot
    }));

    // 3. Hitung nilai WP tiap alternatif
    const hasilWP = alternatif.map(alt => {
      let score = 1;

      normalized.forEach(k => {
        // Cari nilai alternatif untuk kriteria ini
        const row = nilaiRows.find(
          n => n.id_alternatif === alt.id_alternatif && n.id_kriteria === k.id_kriteria
        );

        if (!row || row.nilai === null) {
          console.warn(`⚠ Nilai kosong untuk ${alt.nama_obat} di kriteria ID ${k.id_kriteria}`);
          return;
        }

        const v = Number(row.nilai);

        const kontribusi =
          k.tipe === "benefit"
            ? Math.pow(v, k.w)
            : Math.pow(1 / v, k.w);

        score *= kontribusi;
      });

      return {
        id_alternatif: alt.id_alternatif,
        nama: alt.nama_obat,
        score
      };
    });

    // 4. Normalisasi preferensi
    const totalScore = hasilWP.reduce((a, b) => a + b.score, 0);

    const hasilAkhir = hasilWP.map(h => ({
      ...h,
      preferensi: totalScore > 0 ? h.score / totalScore : 0
    }));

    hasilAkhir.sort((a, b) => b.preferensi - a.preferensi);

    // 5. Simpan ke laporan_wp hari ini
    await pool.query("DELETE FROM laporan_wp WHERE DATE(tanggal) = CURDATE()");

    for (const h of hasilAkhir) {
      await pool.query(
        `INSERT INTO laporan_wp 
          (tanggal, nama_alternatif, nilai_preferensi, saran_terbaik)
        VALUES (NOW(), ?, ?, ?)`,
        [
          h.nama,
          h.preferensi,
          hasilAkhir[0].nama // alternatif terbaik hari ini
        ]
      );
    }

    // 6. Kirim ke frontend
    res.json(hasilAkhir);

  } catch (err) {
    console.error("❌ calculateWP ERROR:", err);
    res.status(500).json({ message: "Gagal menghitung WP" });
  }
}


// import { pool } from "../../config/db.js";

// export async function hitungWP(req, res) {
//   try {
//     // 1. Ambil semua data
//     const [alternatif] = await pool.query("SELECT * FROM alternatif");
//     const [kriteria] = await pool.query("SELECT * FROM kriteria");
//     const [nilaiRows] = await pool.query("SELECT * FROM nilai");

//     // 2. Normalisasi bobot
//     const totalBobot = kriteria.reduce((a, b) => a + Number(b.bobot), 0);
//     const normalized = kriteria.map(k => ({
//       ...k,
//       w: Number(k.bobot) / totalBobot
//     }));

//     // 3. Hitung WP untuk setiap alternatif
//     const hasil = alternatif.map(alt => {
//       let nilaiWP = 1;

//       normalized.forEach(k => {
//         // Ambil nilai dari tabel "nilai"
//         const find = nilaiRows.find(
//           n => n.id_alternatif === alt.id_alternatif && n.id_kriteria === k.id_kriteria
//         );

//         if (!find || find.nilai === null) {
//           console.warn(`⚠ Nilai tidak ditemukan untuk alt ${alt.nama_obat}, kri ID ${k.id_kriteria}`);
//           return;  // skip
//         }

//         const v = Number(find.nilai);

//         // Benefit → v^w
//         // Cost → (1/v)^w
//         const kontribusi =
//           k.tipe === "benefit"
//             ? Math.pow(v, k.w)
//             : Math.pow(1 / v, k.w);

//         nilaiWP *= kontribusi;
//       });

//       return {
//         id: alt.id_alternatif,
//         nama: alt.nama_obat,
//         nilai: nilaiWP
//       };
//     });

//     // 4. Sort
//     hasil.sort((a, b) => b.nilai - a.nilai);

//     // 5. Simpan ke laporan_wp
//     await pool.query("DELETE FROM laporan_wp WHERE DATE(tanggal) = CURDATE()");

//     for (const row of hasil) {
//       await pool.query(
//         `INSERT INTO laporan_wp (tanggal, nama_alternatif, nilai_preferensi)
//          VALUES (NOW(), ?, ?)`,
//         [row.nama, row.nilai]
//       );
//     }

//     // 6. Return ke frontend
//     res.json(hasil);

//   } catch (err) {
//     console.error("❌ calculateWP:", err);
//     res.status(500).json({ message: "Gagal menghitung WP" });
//   }
// }



// // import { pool } from "../../config/db.js";

// // // ================================
// // // 🔹 Hitung WP + simpan ke database
// // // ================================
// // export async function hitungWP(req, res) {
// //   try {
// //     // 1. Ambil alternatif & kriteria
// //     const [alternatif] = await pool.query("SELECT * FROM alternatif");
// //     const [kriteria] = await pool.query("SELECT * FROM kriteria");

// //     // 2. Normalisasi bobot
// //     const totalBobot = kriteria.reduce((a, b) => a + b.bobot, 0);
// //     const normalized = kriteria.map(k => ({
// //       ...k,
// //       w: k.bobot / totalBobot
// //     }));

// //     // 3. Hitung WP
// //     const hasil = alternatif.map(alt => {
// //       let nilai = 1;

// //       normalized.forEach(k => {
// //         const v = alt[k.kode]; // ambil nilai alternatif berdasarkan kode kriteria
// //         const kontribusi = Math.pow(v, k.tipe === "benefit" ? k.w : -k.w);
// //         nilai *= kontribusi;
// //       });

// //       return {
// //         nama: alt.nama_alternatif,
// //         nilai
// //       };
// //     });

// //     // 4. Ranking
// //     hasil.sort((a, b) => b.nilai - a.nilai);

// //     // 5. SIMPAN KE DB laporan_wp
// //     await pool.query("DELETE FROM laporan_wp WHERE DATE(tanggal) = CURDATE()");

// //     for (const row of hasil) {
// //       await pool.query(
// //         "INSERT INTO laporan_wp (tanggal, nama_alternatif, nilai_preferensi) VALUES (NOW(), ?, ?)",
// //         [row.nama, row.nilai]
// //       );
// //     }

// //     // 6. Return ke frontend
// //     res.json(hasil);
// //   } catch (err) {
// //     console.error("❌ calculateWP:", err);
// //     res.status(500).json({ message: "Gagal menghitung WP" });
// //   }
// // }
