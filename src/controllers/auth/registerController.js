import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";

// === REGISTER ADMIN / SUPER-ADMIN ===
export async function registerAdmin(req, res) {
  try {
    const { nama, email, password} = req.body;

    if (!nama || !email || !password) {
      console.warn("⚠️ Field register belum lengkap!");
      return res.status(400).json({ message: "Lengkapi semua data!" });
    }

    // cek apakah email sudah ada
    const [check] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (check.length > 0) {
      console.warn("🚫 Email sudah digunakan:", email);
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, nama, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [ nama, nama, email, hashedPassword, 'admin']
    );

    console.log(`🧾 Register berhasil: ${nama} sebagai admin`);
    res.json({ message: `Akun admin berhasil dibuat!` });
  } catch (err) {
    console.error("❌ Error registerAdmin:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
}

// === GET SEMUA USER (Untuk menu Kelola users) ===
export async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, nama, email, role, foto FROM users ORDER BY id ASC"
    );

    console.log(`👥 Mengambil ${rows.length} users dari database.`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal mengambil data users:", err);
    res.status(500).json({ message: "Gagal mengambil data users." });
  }
}

// === GET USER BY ID ===
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "users tidak ditemukan!" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Gagal mengambil data user:", err);
    res.status(500).json({ message: "Gagal mengambil data user." });
  }
}

// === UPDATE USER ===
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, nama, email } = req.body;

    if (!username || !nama || !email) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const [check] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (check.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan!" });

    await pool.query(
      "UPDATE users SET username = ?, nama = ?, email = ?, role = ? WHERE id = ?",
      [username, nama, email, 'admin', id]
    );

    console.log(`📝 User id=${id} berhasil diperbarui.`);
    res.json({ message: "Data users berhasil diperbarui." });
  } catch (err) {
    console.error("❌ Gagal memperbarui data user:", err);
    res.status(500).json({ message: "Gagal memperbarui data user." });
  }
}


// === HAPUS USER (Kalau nanti butuh fitur hapus di dashboard) ===
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const [check] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (check.length === 0) return res.status(404).json({ message: "User tidak ditemukan!" });

    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    console.log(`🗑️ User id=${id} berhasil dihapus`);
    res.json({ message: "User berhasil dihapus." });
  } catch (err) {
    console.error("❌ Gagal menghapus user:", err);
    res.status(500).json({ message: "Gagal menghapus user." });
  }
}



// import bcrypt from "bcrypt";
// import { pool } from "../../config/db.js";

// export async function registerAdmin(req, res) {
//   const { nama, email, password, role } = req.body;

//   if (!nama || !email || !password || !role)
//     return res.status(400).json({ message: "Lengkapi semua data!" });

//   const [check] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
//   if (check.length > 0)
//     return res.status(400).json({ message: "Email sudah terdaftar!" });

//   const hashed = await bcrypt.hash(password, 10);
//   await pool.query(
//     "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
//     [nama, email, hashed, role]
//   );

//   res.json({ message: `Akun ${role} berhasil dibuat!` });
// }

// export async function getAllUsers(req, res) {
//   try {
//     const [rows] = await pool.query(
//       "SELECT id, username, email, role, foto FROM users ORDER BY id ASC"
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("❌ Gagal mengambil data users:", err);
//     res.status(500).json({ message: "Gagal mengambil data users." });
//   }
// }