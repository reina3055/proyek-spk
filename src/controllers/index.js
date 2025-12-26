// ===============================
// 🔹 AGGREGATOR CONTROLLERS
// ===============================

// ==== AUTH CONTROLLERS ====
export { login, logout } from "./auth/loginController.js";
export { register } from "./auth/registerController.js";
export { checkSession } from "./auth/sessionController.js";
export { updateFotoProfil } from "./auth/uploadController.js";

// ==== SPK CONTROLLERS ====
export { getAlternatif, tambahAlternatif, getAlternatifById, updateAlternatif, hapusAlternatif } from "./spk/alternatifController.js";
export { getKriteria, getKriteriaById, tambahKriteria, updateKriteria, hapusKriteria } from "./spk/kriteriaController.js";
export { getAllNilai, bulkUpdateNilai } from "./spk/nilaiController.js";
export { hitungWP } from "./spk/perhitunganController.js";
export { getLaporanController, exportLaporanExcel, exportLaporanPDF } from "./spk/laporanController.js";
