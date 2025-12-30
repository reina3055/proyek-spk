import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import { pool } from "../../config/db.js";


import { SECRET_KEY } from "../../config/secret.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================
// 🔹 UPDATE FOTO PROFIL
// ============================

export const updateFotoProfil = async (req, res) => {
  try {
      // 1. Cek apakah ada file di memory
      if (!req.file) {
          return res.status(400).json({ message: "Tidak ada file yang diupload." });
      }

      const userId = req.body.id || req.user.id;

      // 2. Fungsi Upload Stream ke Cloudinary
      const uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                  {
                      folder: "spk_profil_user", // Nama folder di Cloudinary
                      public_id: `foto_${userId}_${Date.now()}`,
                      transformation: [{ width: 500, height: 500, crop: "fill" }] // Auto crop
                  },
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
              streamifier.createReadStream(buffer).pipe(stream);
          });
      };

      // 3. Eksekusi Upload
      const result = await uploadFromBuffer(req.file.buffer);
      const fotoUrl = result.secure_url; // Dapat URL online (https://...)

      // 4. Update Database dengan URL baru
      await pool.query("UPDATE users SET foto = ? WHERE id = ?", [fotoUrl, userId]);

      res.json({
          message: "Foto berhasil diupload!",
          foto: fotoUrl
      });

  } catch (error) {
      console.error("Gagal upload Cloudinary:", error);
      res.status(500).json({ message: "Gagal upload foto." });
  }
};


// export async function updateFotoProfil(req, res) {
//   try {
//     const { id } = req.body;
//     const filePath = `/uploads/${req.file.filename}`;

//     await pool.query("UPDATE users SET foto=? WHERE id=?", [filePath, id]);
//     res.json({ message: "✅ Foto profil berhasil diperbarui", foto: filePath });
//   } catch (err) {
//     console.error("❌ updateFotoProfil:", err);
//     res.status(500).json({ message: "Gagal mengupdate foto profil" });
//   }
// }
