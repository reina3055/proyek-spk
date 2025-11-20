import { pool } from "../config/db.js";

const klinis = {
  "Amlodipine": {
    efek: "Edema perifer, pusing, flushing",
    kontra: "Syok kardiogenik"
  },
  "Captopril": {
    efek: "Batuk kering, hipotensi, gangguan rasa, hiperkalemia",
    kontra: "Kehamilan, angioedema, stenosis arteri renalis"
  },
  "Lisinopril": {
    efek: "Batuk, angioedema, hiperkalemia",
    kontra: "Kehamilan, riwayat angioedema"
  },
  "Enalapril": {
    efek: "Batuk, hiperkalemia, pusing",
    kontra: "Kehamilan, stenosis arteri renalis"
  },
  "Losartan": {
    efek: "Pusing, hiperkalemia",
    kontra: "Kehamilan, stenosis arteri renalis"
  },
  "Valsartan": {
    efek: "Pusing, kelelahan",
    kontra: "Kehamilan"
  },
  "Candesartan": {
    efek: "Sakit kepala, pusing",
    kontra: "Kehamilan"
  },
  "Telmisartan": {
    efek: "Pusing, diare",
    kontra: "Kehamilan"
  },
  "Olmesartan": {
    efek: "Pusing, hiperkalemia",
    kontra: "Kehamilan"
  },
  "Hydrochlorothiazide (HCTZ)": {
    efek: "Hipokalemia, hiponatremia",
    kontra: "Gout, gagal ginjal berat"
  },
  "Furosemide": {
    efek: "Dehidrasi, hipokalemia",
    kontra: "Anuria, dehidrasi berat"
  },
  "Spironolactone": {
    efek: "Hiperkalemia, ginekomastia",
    kontra: "Hiperkalemia, gagal ginjal berat"
  },
  "Bisoprolol": {
    efek: "Bradikardia, kelelahan",
    kontra: "Asma, bradikardia, gagal jantung dekompensasi"
  },
  "Metoprolol": {
    efek: "Lelah, bradikardia",
    kontra: "Asma, gangguan konduksi jantung"
  },
  "Atenolol": {
    efek: "Lemas, dingin ekstremitas",
    kontra: "Asma, syok kardiogenik"
  },
  "Propranolol": {
    efek: "Bronkospasme, kelelahan",
    kontra: "Asma, bradikardia, blok AV"
  },
  "Clonidine": {
    efek: "Mulut kering, sedasi",
    kontra: "Depresi berat, hipotensi berat"
  },
  "Doxazosin": {
    efek: "Hipotensi ortostatik",
    kontra: "Hipotensi berat"
  },
  "Hydralazine": {
    efek: "Takikardia refleks, sakit kepala",
    kontra: "Lupus (SLE), penyakit jantung koroner"
  },
  "Nifedipine": {
    efek: "Edema, palpitasi, sakit kepala",
    kontra: "Hipotensi berat, syok kardiogenik"
  }
};

async function run() {
  const [rows] = await pool.query("SELECT id_alternatif, nama_obat FROM alternatif");

  for (const r of rows) {
    const data = klinis[r.nama_obat];
    if (!data) continue;

    await pool.query(
      `UPDATE stok_obat SET efek_samping_teks=?, kontraindikasi_teks=? WHERE id_alternatif=?`,
      [data.efek, data.kontra, r.id_alternatif]
    );

    console.log(`✔ Update klinis: ${r.nama_obat}`);
  }

  console.log("🎉 Update klinis selesai.");
  process.exit();
}

run();
