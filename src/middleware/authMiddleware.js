import jwt from "jsonwebtoken";

const SECRET_KEY = "INI_RAHASIA";

// 🔹 Middleware JWT (dipakai untuk API yang butuh login)
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid!" });
    }
    req.user = user; // simpan info user ke request
    next();
  });
  console.log("Authorization Header:", req.headers["authorization"]);
console.log("SECRET_KEY in middleware:", SECRET_KEY);

}

// 🔹 Middleware Session-based (jika kamu masih pakai req.session)
export function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Akses ditolak! Silakan login dulu." });
  }
  console.log("Authorization Header:", req.headers["authorization"]);
console.log("SECRET_KEY in middleware:", SECRET_KEY);

}

// 🔹 Middleware khusus role admin (opsional)
export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Hanya admin yang boleh mengakses!" });
  } 
  console.log("Authorization Header:", req.headers["authorization"]);
console.log("SECRET_KEY in middleware:", SECRET_KEY);

}

