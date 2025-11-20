import { pool } from "../config/db.js";

async function ambilKonversi() {
  const [golongan] = await pool.query("SELECT * FROM konversi_golongan");
  const [biaya] = await pool.query("SELECT * FROM konversi_biaya ORDER BY range_min ASC");
  const [freq] = await pool.query("SELECT * FROM konversi_frekuensi ORDER BY freq ASC");
  const [stok] = await pool.query("SELECT * FROM konversi_stok");
  const [[sistem]] = await pool.query("SELECT * FROM konfigurasi_sistem WHERE id=1");

  return { golongan, biaya, freq, stok, sistem };
}

function cariSkorBiaya(biaya, rules) {
  for (const r of rules) {
    if (biaya >= r.range_min && biaya <= r.range_max) return r.skor;
  }
  return rules[rules.length - 1].skor; // fallback
}

function cariSkorStok(stok, rules) {
  for (const r of rules) {
    if (stok >= r.stok_min && stok <= r.stok_max) return r.skor;
  }
  return 1;
}

function cariSkorFreq(freq, rules) {
  const found = rules.find(r => r.freq === freq);
  return found ? found.skor : rules[rules.length - 1].skor;
}

export async function autoKonversiNilai() {
  const config = await ambilKonversi();

  const { golongan, biaya, freq, stok, sistem } = config;

  const [alternatif] = await pool.query(`
    SELECT a.id_alternatif, s.golongan, s.frekuensi_dosis, s.biaya_bulanan, s.jumlah_stok
    FROM alternatif a
    JOIN stok_obat s ON a.id_alternatif = s.id_alternatif
  `);

  await pool.query("TRUNCATE nilai");

  for (const alt of alternatif) {
    const g = golongan.find(g => alt.golongan.includes(g.nama_golongan));

    const skorEfektivitas = g ? g.skor_efektivitas : sistem.skala_likert_max / 2;
    const skorEfekSamping = g ? g.skor_efek_samping : sistem.skala_likert_max / 2;
    const skorKontraindikasi = g ? g.skor_kontraindikasi : sistem.skala_likert_max / 2;
    const skorBiaya = cariSkorBiaya(alt.biaya_bulanan, biaya);
    const skorFreq = cariSkorFreq(alt.frekuensi_dosis, freq);
    const skorStok = cariSkorStok(alt.jumlah_stok, stok);

    const mapping = {
      "Efektivitas Penurunan TD": skorEfektivitas,
      "Kontraindikasi & Interaksi": skorKontraindikasi,
      "Profil Efek Samping": skorEfekSamping,
      "Frekuensi Dosis Harian": skorFreq,
      "Biaya Terapi Bulanan": skorBiaya,
      "Ketersediaan (Stok)": skorStok,
    };

    const [kriteria] = await pool.query("SELECT * FROM kriteria");

    for (const k of kriteria) {
      const nilai = mapping[k.nama_kriteria] ?? sistem.skala_likert_max/2;

      await pool.query(
        "INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)",
        [alt.id_alternatif, k.id_kriteria, nilai]
      );
    }
  }

  console.log("✨ Konversi klinis telah dihitung ulang secara penuh.");
}
