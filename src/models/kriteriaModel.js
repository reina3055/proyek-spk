import { pool } from "../config/db.js";

export async function getAllKriteria() {
  const [rows] = await pool.query("SELECT * FROM kriteria ORDER BY id_kriteria ASC");
  return rows;
}

export async function createKriteria({ nama, bobot, tipe }) {
  const [result] = await pool.query(
    "INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES (?, ?, ?)",
    [nama, bobot, tipe]
  );
  return result.insertId;
}

export async function updateKriteriaById(id, { nama, bobot, tipe }) {
  await pool.query(
    "UPDATE kriteria SET nama_kriteria=?, bobot=?, tipe=? WHERE id_kriteria=?",
    [nama, bobot, tipe, id]
  );
}

export async function deleteKriteriaById(id) {
  await pool.query("DELETE FROM nilai WHERE id_kriteria=?", [id]);
  await pool.query("DELETE FROM kriteria WHERE id_kriteria=?", [id]);
}
