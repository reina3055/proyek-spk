import { pool } from "../../config/db.js";
import ExcelJS from "exceljs"
import PDFDocument from "pdfkit"
import fs from "fs"


// ============================
// 🔹 LAPORAN PERIODIK (Filter Tanggal)
// ============================
export async function getLaporan(req, res) {
  try {
    const { start, end } = req.query;

    //let query = "SELECT * FROM laporan_wp ORDER BY tanggal DESC";
    const calcRes = await fetch ("http://localhost:3000/api/spk/calculate");
    const data = await calcRes.json();

    let filtered = data;

    // if (start && end) {
    //   query = "SELECT * FROM laporan_wp WHERE tanggal BETWEEN ? AND ? ORDER BY tanggal DESC";
    //   params = [start, end];
    // }
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);

      filtered = data.filter(item => {
        const t = new Date(item.tanggal);
        return t >= s && t <= e;
      });
    }

    //const [rows] = await pool.query(query, params);
    res.json(filtered);
  } catch (err) {
    console.error("❌ getLaporan:", err);
    res.status(500).json({ message: "Gagal memuat laporan" });
  }
}

// ============================
// 🔹 EXPORT LAPORAN KE EXCEL
// ============================
export async function exportLaporanExcel(req, res) {
  try {
    const calcRes = await fetch("http://localhost:3000/api/spk/calculate");
    const rows = await calcRes.json();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan WP");

    sheet.columns = [
      { header: "Tanggal", key: "tanggal", width: 20 },
      { header: "Nama Obat", key: "nama_alternatif", width: 30 },
      { header: "Nilai Preferensi", key: "nilai_preferensi", width: 20 },
    ];

    rows.forEach((r) => sheet.addRow(r));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=laporan_wp.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ exportLaporanExcel:", err);
    res.status(500).json({ message: "Gagal ekspor Excel" });
  }
}

// ============================
// 🔹 EXPORT LAPORAN KE PDF
// ============================
export async function exportLaporanPDF(req, res) {
  try {
    const calcRes = await fetch("http://localhost:3000/api/spk/calculate");
    const rows = await calcRes.json();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=laporan_wp.pdf");
    doc.pipe(res);

    doc.fontSize(16).text("Laporan SPK Weighted Product", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`);
    doc.moveDown(2);

    rows.forEach((r, i) => {
      doc.text(`${i + 1}. [${r.tanggal}] ${r.nama} → ${r.nilai.toFixed(4)}`);
    });

    doc.moveDown(2);
    doc.text("— Sistem Pendukung Keputusan Hipertensi —", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("❌ exportLaporanPDF:", err);
    res.status(500).json({ message: "Gagal ekspor PDF" });
  }
}

