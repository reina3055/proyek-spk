import { getLaporan } from "../../models/laporanModel.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// =====================
// 🔹 GET LAPORAN
// =====================
export async function getLaporanController(req, res) {
  try {
    const { start, end } = req.query;
    const rows = await getLaporan(start, end);
    res.json(rows);
  } catch (err) {
    console.error("❌ getLaporan:", err);
    res.status(500).json({ message: "Gagal memuat laporan" });
  }
}

// =====================
// 🔹 EXPORT EXCEL
// =====================
export async function exportLaporanExcel(req, res) {
  try {
    const { start, end } = req.query;
    const rows = await getLaporan(start, end);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan WP");

    sheet.columns = [
      { header: "Tanggal", key: "tanggal", width: 20 },
      { header: "Nama Obat", key: "nama_alternatif", width: 30 },
      { header: "Nilai Preferensi", key: "nilai_preferensi", width: 20 },
    ];

    rows.forEach(r => sheet.addRow(r));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=laporan_wp.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ exportLaporanExcel:", err);
    res.status(500).json({ message: "Gagal ekspor Excel" });
  }
}

// =====================
// 🔹 EXPORT PDF
// =====================
export async function exportLaporanPDF(req, res) {
  try {
    const { start, end } = req.query;
    const rows = await getLaporan(start, end);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=laporan_wp.pdf");

    doc.pipe(res);
    doc.fontSize(16).text("Laporan SPK WP", { align: "center" });
    doc.moveDown();

    rows.forEach((r, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${r.tanggal} — ${r.nama_alternatif} → ${r.nilai_preferensi.toFixed(4)}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("❌ exportLaporanPDF:", err);
    res.status(500).json({ message: "Gagal ekspor PDF" });
  }
}
