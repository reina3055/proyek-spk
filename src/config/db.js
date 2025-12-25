import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

console.log("🛠️  Mencoba koneksi ke Database...");
console.log("📍  Host:", process.env.DB_HOST);     // Cek apakah ini alamat yang benar?
console.log("🔌  Port:", process.env.DB_PORT);     // Cek apakah ini 16961?
console.log("👤  User:", process.env.DB_USER);
console.log("📁  DB  :", process.env.DB_NAME);

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,          
  ssl: { rejectUnauthorized: false }, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000
});

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
