import { pool } from "../config/db.js";

export async function saveNilai({ id_alternatif, id_kriteria, nilai }) {
  const [cek] = await pool.query(
    "SELECT * FROM nilai WHERE id_alternatif=? AND id_kriteria=?",
    [id_alternatif, id_kriteria]
  );

  if (cek.length > 0) {
    await pool.query(
      "UPDATE nilai SET nilai=? WHERE id_alternatif=? AND id_kriteria=?",
      [nilai, id_alternatif, id_kriteria]
    );
  } else {
    await pool.query(
      "INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)",
      [id_alternatif, id_kriteria, nilai]
    );
  }
}

export async function getAllNilai() {
  const [rows] = await pool.query("SELECT * FROM nilai");
  return rows;
}
