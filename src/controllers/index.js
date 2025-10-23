// ===============================
// 🔹 AGGREGATOR CONTROLLERS
// ===============================

// ==== AUTH CONTROLLERS ====
export { login, logout } from "./auth/loginController.js";
export { registerAdmin } from "./auth/registerController.js";
export { checkSession } from "./auth/sessionController.js";
export { updateFotoProfil } from "./auth/uploadController.js";

// ==== SPK CONTROLLERS ====
export { getAlternatif, tambahAlternatif, updateAlternatif, hapusAlternatif } from "./spk/alternatifController.js";
export { getKriteria, tambahKriteria, updateKriteria, hapusKriteria } from "./spk/kriteriaController.js";
export { tambahNilai } from "./spk/nilaiController.js";
export { hitungWP } from "./spk/perhitunganController.js";
export { getLaporan, exportLaporanExcel, exportLaporanPDF } from "./spk/laporanController.js";
