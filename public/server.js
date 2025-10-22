const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON & file statis
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API Login sederhana
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Ganti sesuai data kamu
  const admin = {
    username: "admin",
    password: "12345",
  };

  if (username === admin.username && password === admin.password) {
    return res.json({
      message: "Login berhasil!",
      token: "dummy-token-123",
    });
  } else {
    return res.status(401).json({ message: "Username atau password salah!" });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
