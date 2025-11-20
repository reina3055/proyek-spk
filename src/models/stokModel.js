import { pool } from "../config/db.js";

// 🔹 ambil semua stok obat
export const getAllStok = async () => {
  const [rows] = await pool.query(`
    SELECT 
      s.id_stok,
      s.id_alternatif,
      s.nama_obat,
      s.golongan,
      s.fungsi,
      s.nama_dagang,
      s.efek_samping_teks,
      s.produsen,
      s.jumlah_stok,
      s.biaya_bulanan,
      s.frekuensi_dosis,
      s.kontraindikasi_teks,
      s.tanggal_update
    FROM stok_obat s
    ORDER BY s.tanggal_update DESC
  `);
  return rows;
};

// 🔹 ambil stok berdasarkan id
export const getStokById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM stok_obat WHERE id = ?`, [id]);
  return rows[0];
};

// 🔹 tambah stok obat baru
export const createStok = async (data) => {
  const {
    id_alternatif,
    nama_obat,
    golongan,
    fungsi,
    nama_dagang,
    produsen,
    efek_samping,
    jumlah_stok,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO stok_obat 
      (id_alternatif, nama_obat, golongan, fungsi, nama_dagang, produsen, efek_samping, jumlah_stok)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_alternatif, nama_obat, golongan, fungsi, nama_dagang, produsen, efek_samping, jumlah_stok]
  );
  return result.insertId;
};

// 🔹 update stok obat
export const updateStok = async (id, data) => {
  const {
    id_alternatif,
    nama_obat,
    golongan,
    fungsi,
    nama_dagang,
    produsen,
    efek_samping,
    jumlah_stok,
  } = data;

  await pool.query(
    `UPDATE stok_obat
     SET id_alternatif=?, nama_obat=?, golongan=?, fungsi=?, nama_dagang=?, produsen=?, efek_samping=?, jumlah_stok=?, tanggal_update=NOW()
     WHERE id=?`,
    [id_alternatif, nama_obat, golongan, fungsi, nama_dagang, produsen, efek_samping, jumlah_stok, id]
  );
  return true;
};

// 🔹 hapus stok
export const deleteStok = async (id) => {
  await pool.query(`DELETE FROM stok_obat WHERE id=?`, [id]);
  return true;
};
