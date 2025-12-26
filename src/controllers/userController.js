import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

// Get All Admins (Kecuali Super Admin sendiri)
export const getAllAdmins = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nama, email, role FROM users WHERE role = 'admin'");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Reset Password Admin (Oleh Super Admin)
export const resetAdminPassword = async (req, res) => {
    const { id } = req.params; // ID admin yang mau direset
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "Password baru wajib diisi" });

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await pool.query("UPDATE users SET password = ? WHERE id = ?", [hash, id]);
        
        res.json({ message: "Password admin berhasil direset!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};