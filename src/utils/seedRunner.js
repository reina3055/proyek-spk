import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    console.log("🌱 Memulai seeding: Kriteria + Alternatif (id,nama) + Stok Obat (lengkap + nama_obat)");

    // ====== RESET DATA ======
    console.log("🧹 Menghapus data lama...");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("DELETE FROM nilai");
    await conn.query("DELETE FROM stok_obat");
    await conn.query("DELETE FROM alternatif");
    await conn.query("DELETE FROM kriteria");
    await conn.query("ALTER TABLE alternatif AUTO_INCREMENT = 1");
    await conn.query("ALTER TABLE stok_obat AUTO_INCREMENT = 1");
    await conn.query("ALTER TABLE kriteria AUTO_INCREMENT = 1");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    // ====== KRITERIA (STANDAR KLINIS) ======
    const kriteria = [
      { nama: "Efektivitas Penurunan TD", bobot: 0.30, tipe: "benefit" },
      { nama: "Kontraindikasi & Interaksi", bobot: 0.25, tipe: "cost" },
      { nama: "Profil Efek Samping", bobot: 0.20, tipe: "cost" },
      { nama: "Frekuensi Dosis Harian", bobot: 0.10, tipe: "cost" },
      { nama: "Biaya Terapi Bulanan", bobot: 0.10, tipe: "cost" },
      { nama: "Ketersediaan (Stok)", bobot: 0.05, tipe: "benefit" },
    ];

    console.log("📦 Menyisipkan data kriteria...");
    for (const k of kriteria) {
      await conn.query(
        "INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES (?, ?, ?)",
        [k.nama, k.bobot, k.tipe]
      );
      console.log(`  ➕ ${k.nama} (Bobot: ${k.bobot}, Tipe: ${k.tipe})`);
    }

    // ====== DATA OBAT (20 ITEM) ======
    const obatList = [
      { nama_obat: "Amlodipine", golongan: "Calcium Channel Blocker (CCB)", fungsi: "Mengendurkan pembuluh darah, menurunkan tekanan darah.", nama_dagang: "Norvasc, Amlodipin Hexpharm", produsen: "Pfizer, Hexpharm Jaya" },
      { nama_obat: "Captopril", golongan: "ACE Inhibitor", fungsi: "Menghambat enzim pembentuk angiotensin II.", nama_dagang: "Capoten, Captopril Dexa", produsen: "Bristol Myers Squibb, Dexa Medica" },
      { nama_obat: "Lisinopril", golongan: "ACE Inhibitor", fungsi: "Menurunkan tekanan darah dengan menghambat sistem renin-angiotensin.", nama_dagang: "Zestril, Prinivil", produsen: "AstraZeneca, Merck" },
      { nama_obat: "Enalapril", golongan: "ACE Inhibitor", fungsi: "Melebarkan pembuluh darah, menurunkan tekanan darah.", nama_dagang: "Renitec, Enapril Dexa", produsen: "Merck, Dexa Medica" },
      { nama_obat: "Losartan", golongan: "ARB", fungsi: "Menghambat reseptor angiotensin II untuk menurunkan tekanan darah.", nama_dagang: "Cozaar, Losartan Novell", produsen: "Merck Sharp & Dohme, Novell Pharma" },
      { nama_obat: "Valsartan", golongan: "ARB", fungsi: "Melindungi jantung dan ginjal, menurunkan tekanan darah.", nama_dagang: "Diovan, Valsartan Novell", produsen: "Novartis, Novell Pharma" },
      { nama_obat: "Candesartan", golongan: "ARB", fungsi: "Mengontrol tekanan darah dan mencegah gagal jantung.", nama_dagang: "Atacand", produsen: "AstraZeneca" },
      { nama_obat: "Telmisartan", golongan: "ARB", fungsi: "Menurunkan tekanan darah dan risiko stroke.", nama_dagang: "Micardis", produsen: "Boehringer Ingelheim" },
      { nama_obat: "Olmesartan", golongan: "ARB", fungsi: "Mengontrol tekanan darah jangka panjang.", nama_dagang: "Benicar", produsen: "Daiichi Sankyo" },
      { nama_obat: "Hydrochlorothiazide (HCTZ)", golongan: "Thiazide Diuretic", fungsi: "Mengeluarkan garam & air untuk menurunkan tekanan darah.", nama_dagang: "Hydrex", produsen: "Sanbe Farma" },
      { nama_obat: "Furosemide", golongan: "Loop Diuretic", fungsi: "Mengurangi volume cairan tubuh.", nama_dagang: "Lasix", produsen: "Sanofi" },
      { nama_obat: "Spironolactone", golongan: "Potassium-sparing Diuretic", fungsi: "Mengurangi cairan tubuh tanpa kehilangan kalium.", nama_dagang: "Aldactone", produsen: "Pfizer" },
      { nama_obat: "Bisoprolol", golongan: "Beta Blocker", fungsi: "Mengurangi denyut jantung dan tekanan darah.", nama_dagang: "Concor", produsen: "Merck" },
      { nama_obat: "Metoprolol", golongan: "Beta Blocker", fungsi: "Menurunkan tekanan darah dan menjaga ritme jantung.", nama_dagang: "Lopressor, Betaloc", produsen: "AstraZeneca" },
      { nama_obat: "Atenolol", golongan: "Beta Blocker", fungsi: "Mengontrol tekanan darah dan detak jantung.", nama_dagang: "Tenormin", produsen: "AstraZeneca" },
      { nama_obat: "Propranolol", golongan: "Beta Blocker", fungsi: "Mengontrol tekanan darah dan kecemasan.", nama_dagang: "Inderal", produsen: "ICI Pharma" },
      { nama_obat: "Clonidine", golongan: "Alpha-2 Adrenergic Agonist", fungsi: "Menurunkan aktivitas saraf simpatis, menurunkan tekanan darah.", nama_dagang: "Catapres", produsen: "Boehringer Ingelheim" },
      { nama_obat: "Doxazosin", golongan: "Alpha-1 Blocker", fungsi: "Melebarkan pembuluh darah dan mengurangi tekanan darah.", nama_dagang: "Cardura", produsen: "Pfizer" },
      { nama_obat: "Hydralazine", golongan: "Vasodilator langsung", fungsi: "Melebarkan otot pembuluh darah.", nama_dagang: "Apresoline", produsen: "Novartis" },
      { nama_obat: "Nifedipine", golongan: "Calcium Channel Blocker (CCB)", fungsi: "Mengendurkan pembuluh darah dan menurunkan tekanan darah cepat.", nama_dagang: "Adalat, Nifedipin Dexa", produsen: "Bayer, Dexa Medica" },
    ];

    console.log("💊 Menambahkan data alternatif dan stok_obat...");
    for (const o of obatList) {
      // Simpan ke tabel alternatif (hanya nama)
      const [resAlt] = await conn.query(
        "INSERT INTO alternatif (nama_obat) VALUES (?)",
        [o.nama_obat]
      );
      const altId = resAlt.insertId;

      // Simpan ke tabel stok_obat (lengkap, termasuk kolom baru)
      // 🟣 MODIFIKASI: Menambahkan 3 kolom baru di INSERT
      await conn.query(
        `INSERT INTO stok_obat
         (id_alternatif, nama_obat, golongan, fungsi, nama_dagang, produsen, 
          efek_samping_teks, jumlah_stok, 
          biaya_bulanan, frekuensi_dosis, kontraindikasi_teks)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          altId,
          o.nama_obat,
          o.golongan,
          o.fungsi,
          o.nama_dagang,
          o.produsen,
          null, // efek_samping_teks (kosong dulu)
          0,    // jumlah_stok (awal = 0)
          
          // 🟣 MODIFIKASI: Nilai default untuk kolom baru
          0,    // biaya_bulanan (dummy = 0)
          1,    // frekuensi_dosis (dummy = 1x sehari)
          null  // kontraindikasi_teks (kosong dulu)
        ]
      );
      console.log(`  ➕ ${o.nama_obat}`);
    }

    await conn.commit();
    console.log("✅ Seeding selesai tanpa error. Semua tabel siap digunakan!");
  } catch (err) {
    await conn.rollback();
    console.error("❌ Gagal seeding:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();