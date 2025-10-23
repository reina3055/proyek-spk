import { pool } from "../config/db.js";

export async function getAllAlternatif() {
  const [rows] = await pool.query("SELECT * FROM alternatif ORDER BY id_alternatif ASC");
  return rows;
}

export async function createAlternatif(nama_obat) {
  const [result] = await pool.query("INSERT INTO alternatif (nama_obat) VALUES (?)", [nama_obat]);
  return result.insertId;
}

export async function updateAlternatifById(id, nama_obat) {
  await pool.query("UPDATE alternatif SET nama_obat=? WHERE id_alternatif=?", [nama_obat, id]);
}

export async function deleteAlternatifById(id) {
  await pool.query("DELETE FROM nilai WHERE id_alternatif=?", [id]);
  await pool.query("DELETE FROM alternatif WHERE id_alternatif=?", [id]);
}
