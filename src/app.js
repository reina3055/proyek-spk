import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./config/db.js";

// Routes
// import authRoutes from "./routes/auth/authRoutes.js";
//  import uploadRoutes from "./routes/auth/uploadRoutes.js";
//  import spkRoutes from "./routes/spk/index.js"; // ← aggregator spk routes
  import allRoutes from "./routes/index.js";

dotenv.config();
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
//  app.use("/api/auth", authRoutes);
//  app.use("/api/auth", uploadRoutes);
//  app.use("/api/spk", spkRoutes);
  app.use("/api", allRoutes);

// Default route
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
