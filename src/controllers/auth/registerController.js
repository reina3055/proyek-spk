import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";

// === REGISTER ADMIN / SUPER-ADMIN ===

export const register = async (req, res) => {
  const { nama, email, password, role, securityCode } = req.body; // Tambah securityCode

  try {
    // 1. Validasi Input Dasar
    if (!nama || !email || !password || !securityCode) {
      return res.status(400).json({ message: "Semua data (termasuk kode keamanan) wajib diisi!" });
    }

    // 2. Validasi Kode Keamanan (Mencegah orang asing daftar)
    // Ambil kode dari .env
    const adminCode = process.env.ADMIN_SECRET_CODE;
    const superAdminCode = process.env.SUPER_ADMIN_CODE;

    let fixedRole = 'admin'; // Default role

    if (securityCode === superAdminCode) {
      fixedRole = 'super-admin';
    } else if (securityCode === adminCode) {
      fixedRole = 'admin';
    } else {
      // Jika kode salah, tolak pendaftaran!
      return res.status(403).json({ message: "Kode Keamanan/Token Salah! Anda tidak diizinkan mendaftar." });
    }

    // 3. Cek Email Kembar
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Simpan ke Database
    // Pastikan kolom role di database support enum('admin', 'super-admin')
    await pool.query(
      "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, hashedPassword, fixedRole]
    );

    res.status(201).json({ message: "Registrasi berhasil! Silakan login." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// export async function registerAdmin(req, res) {
//   try {
//     const { nama, email, password} = req.body;

//     if (!nama || !email || !password) {
//       console.warn("⚠️ Field register belum lengkap!");
//       return res.status(400).json({ message: "Lengkapi semua data!" });
//     }

//     // cek apakah email sudah ada
//     const [check] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
//     if (check.length > 0) {
//       console.warn("🚫 Email sudah digunakan:", email);
//       return res.status(400).json({ message: "Email sudah terdaftar!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await pool.query(
//       "INSERT INTO users (username, nama, email, password, role) VALUES (?, ?, ?, ?, ?)",
//       [ nama, nama, email, hashedPassword, 'admin']
//     );

//     console.log(`🧾 Register berhasil: ${nama} sebagai admin`);
//     res.json({ message: `Akun admin berhasil dibuat!` });
//   } catch (err) {
//     console.error("❌ Error registerAdmin:", err);
//     res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
//   }
// }

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

// === UPDATE USER ===
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, nama, email, role } = req.body; // Ambil role dari body juga

    // 1. Validasi Input
    if (!username || !nama || !email) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // 2. Cek User Ada/Tidak
    const [check] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (check.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan!" });

    // 3. Tentukan Role Baru
    // Jika 'role' dikirim dari frontend, pakai itu. Jika tidak, pakai role lama di database.
    // (Ini menjaga agar Super Admin tidak berubah jadi Admin, atau sebaliknya)
    const newRole = role ? role : check[0].role; 

    // 4. Update Database
    // ❌ KODE LAMA: ... role = 'admin' ... (JANGAN HARDCODE INI)
    // ✅ KODE BARU: ... role = ? ... (Pakai variabel)
    await pool.query(
      "UPDATE users SET username = ?, nama = ?, email = ?, role = ? WHERE id = ?",
      [username, nama, email, newRole, id]
    );

    console.log(`📝 User id=${id} berhasil diperbarui menjadi role: ${newRole}`);
    res.json({ message: "Data profil berhasil diperbarui." });
  } catch (err) {
    console.error("❌ Gagal memperbarui data user:", err);
    res.status(500).json({ message: "Gagal memperbarui data user." });
  }
}

// export async function updateUser(req, res) {
//   try {
//     const { id } = req.params;
//     const { username, nama, email } = req.body;

//     if (!username || !nama || !email) {
//       return res.status(400).json({ message: "Semua field wajib diisi." });
//     }

//     const [check] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
//     if (check.length === 0)
//       return res.status(404).json({ message: "User tidak ditemukan!" });

//     await pool.query(
//       "UPDATE users SET username = ?, nama = ?, email = ?, role = ? WHERE id = ?",
//       [username, nama, email, 'admin', id]
//     );

//     console.log(`📝 User id=${id} berhasil diperbarui.`);
//     res.json({ message: "Data users berhasil diperbarui." });
//   } catch (err) {
//     console.error("❌ Gagal memperbarui data user:", err);
//     res.status(500).json({ message: "Gagal memperbarui data user." });
//   }
// }


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


// ... import pool dan bcrypt di atas ...

// === RESET PASSWORD OLEH SUPER-ADMIN ===
export async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // 1. Validasi
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password baru minimal 6 karakter." });
    }

    // 2. Cek User Ada?
    const [check] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (check.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    // 3. Hash Password Baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update Database
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);

    console.log(`🔐 Password user ID ${id} di-reset oleh Super Admin.`);
    res.json({ message: "Password berhasil di-reset!" });

  } catch (err) {
    console.error("❌ Gagal reset password:", err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}