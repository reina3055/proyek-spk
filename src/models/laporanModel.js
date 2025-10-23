import { pool } from "../config/db.js";

export async function getLaporan(start, end) {
  let query = "SELECT * FROM laporan_wp ORDER BY tanggal DESC";
  let params = [];

  if (start && end) {
    query = "SELECT * FROM laporan_wp WHERE tanggal BETWEEN ? AND ? ORDER BY tanggal DESC";
    params = [start, end];
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function insertLaporan({ tanggal, nama_alternatif, nilai_preferensi }) {
  await pool.query(
    "INSERT INTO laporan_wp (tanggal, nama_alternatif, nilai_preferensi) VALUES (?, ?, ?)",
    [tanggal, nama_alternatif, nilai_preferensi]
  );
}
