import { pool } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/secret.js";

// === LOGIN (Bisa pakai Username atau Email) ===
export async function login(req, res) {
  try {
    console.log("📩 req.body:", req.body);
    const { email, password } = req.body;

    // validasi awal
    if (!email || !password) {
      console.warn("⚠️ Field login belum lengkap!");
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    // deteksi input: apakah mengandung @ → berarti email
    const isEmail = email.includes("@");

    // query dinamis (email atau username)
    const query = isEmail
      ? "SELECT * FROM users WHERE email = ?"
      : "SELECT * FROM users WHERE username = ?";

    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      console.warn("🚫 Akun tidak ditemukan:", email);
      return res.status(401).json({ message: "Akun tidak ditemukan!" });
    }

    const user = rows[0];

    // validasi password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.warn("❌ Password salah untuk user:", email);
      return res.status(401).json({ message: "Password salah!" });
    }

    // validasi role (admin / super-admin)
    if (user.role !== 'admin') {
      console.warn(`🚫 Akses ditolak, bukan admin!`);
      return res.status(403).json({ message: "Bukan admin!" });
    }

    // buat JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'admin' },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log(`✅ Login berhasil: ${user.username} sebagai 'admin`);

    res.json({
      message: "Login berhasil!",
      token,
      user: { id: user.id, username: user.username, role: 'admin' },
    });
  } catch (err) {
    console.error("❌ Error di loginController:", err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
}

// === GANTI PASSWORD ===
export async function changePassword(req, res) {
  try {
    const userId = req.user.id; // Dari token middleware
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Password lama dan baru wajib diisi!" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password baru minimal 6 karakter!" });
    }

    // 1. Ambil hash password lama dari DB
    const [rows] = await pool.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });

    const currentHash = rows[0].password;

    // 2. Cek apakah password lama benar
    const isMatch = await bcrypt.compare(oldPassword, currentHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Password lama salah!" });
    }

    // 3. Hash password baru & Simpan
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [newHash, userId]);

    console.log(`🔐 User ID ${userId} berhasil ganti password.`);
    res.json({ message: "Password berhasil diperbarui! Silakan login ulang." });

  } catch (err) {
    console.error("❌ Gagal ganti password:", err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}

// === LOGOUT (hapus token di sisi client) ===
export async function logout(req, res) {
  console.log("🚪 Logout request diterima");
  res.json({ message: "Logout berhasil! Hapus token di client side." });
}



// import { pool } from "../../config/db.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { SECRET_KEY } from "../../config/secret.js";

// // === LOGIN (email atau username) ===
// export async function login(req, res) {
//   console.log("📩 req.body:", req.body);
//   const { email, password, role } = req.body;
//   if (!email || !password || !role)
//     return res.status(400).json({ message: "Semua field wajib diisi!" });

//   // deteksi: apakah input mengandung @ → berarti email
//   const isEmail = username.includes("@");
//   const query = isEmail
//     ? "SELECT * FROM users WHERE email = ?"
//     : "SELECT * FROM users WHERE username = ?";

//   const [rows] = await pool.query("SELECT * FROM users WHERE username = ? OR email = ?", [email, email]);
//   if (rows.length === 0)
//     return res.status(401).json({ message: "Akun tidak ditemukan!" });

//   const user = rows[0];
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(401).json({ message: "Password salah!" });

//   if (user.role !== role)
//     return res.status(403).json({ message: "Role tidak sesuai!" });

//   const token = jwt.sign(
//     { id: user.id, username: user.username, role: user.role },
//     SECRET_KEY,
//     { expiresIn: "1h" }
//   );

//   res.json({
//     message: "Login berhasil!",
//     token,
//     user: { id: user.id, username: user.username, role: user.role },
//   });
// }


// // import { pool } from "../../config/db.js";
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";
// // import { SECRET_KEY } from "../../config/secret.js";

// // // === LOGIN ===
// // export async function login(req, res) {
// //   const { email, password, role } = req.body;

// //   if (!email || !password || !role)
// //     return res.status(400).json({ message: "Semua field wajib diisi!" });

// //   const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
// //   if (rows.length === 0)
// //     return res.status(401).json({ message: "Email tidak ditemukan!" });

// //   const user = rows[0];
// //   const passwordMatch = await bcrypt.compare(password, user.password);
// //   if (!passwordMatch)
// //     return res.status(401).json({ message: "Password salah!" });

// //   // cek role
// //   if (user.role !== role)
// //     return res.status(403).json({ message: "Role tidak sesuai!" });

// //   const token = jwt.sign(
// //     { id: user.id, username: user.username, role: user.role },
// //     SECRET_KEY,
// //     { expiresIn: "1h" }
// //   );

// //   res.json({
// //     message: "Login berhasil!",
// //     token,
// //     user: { id: user.id, username: user.username, role: user.role },
// //   });
// // }


// // //   const { username, password } = req.body;

// // //   if (!username || !password)
// // //     return res.status(400).json({ message: "Semua field wajib diisi!" });

// // //   const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
// // //   if (rows.length === 0)
// // //     return res.status(401).json({ message: "Username tidak ditemukan!" });

// // //   const user = rows[0];
// // //   const passwordMatch = await bcrypt.compare(password, user.password);
// // //   if (!passwordMatch)
// // //     return res.status(401).json({ message: "Password salah!" });

// // //   // ✅ Gunakan SECRET_KEY dari config
// // //   console.log("SECRET_KEY dari loginController:", SECRET_KEY);

// // //   const token = jwt.sign(
// // //     { id: user.id, username: user.username },
// // //     SECRET_KEY,
// // //     { expiresIn: "1h" }
// // //   );

// // //   res.json({ message: "Login berhasil!", token });
// // // }

// // === LOGOUT (hapus token di sisi client) ===
// export async function logout(req, res) {
//   res.json({ message: "Logout berhasil! Hapus token di client side." });
// }
