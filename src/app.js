import dotenv from "dotenv";

import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./config/db.js";
//import { autoKonversiNilai } from "./utils/autoKonversiNilaiKlinis.js";


// Routes
// import authRoutes from "./routes/auth/authRoutes.js";
//  import uploadRoutes from "./routes/auth/uploadRoutes.js";
//  import spkRoutes from "./routes/spk/index.js"; // ← aggregator spk routes
  import allRoutes from "./routes/index.js";
  import authRoutes from "./routes/auth/authRoutes.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use(session({
  secret: "rahasia",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

// === ROUTING ===
  app.use("/api", allRoutes);
//  app.use("/api/auth", uploadRoutes);
//  app.use("/api/spk", spkRoutes);

  //app.use("/api/spk", spkRoutes);

// Default route
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

dotenv.config();
// DB connection test
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL via XAMPP!");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

// autoKonversiNilai()
//   .then(() => console.log("WP klinis otomatis terisi!"))
//   .catch((e) => console.error("WP klinis gagal init:", e));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
