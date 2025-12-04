import { pool } from "../../config/db.js";
import { getLaporan } from "../../models/laporanModel.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// =====================
// 🔹 GET LAPORAN
// =====================
// === AMBIL DATA (JSON) ===
export async function getLaporanController(req, res) {
  try {
    const { startDate, endDate } = req.query;
    let query = "SELECT * FROM laporan_wp";
    const params = [];

    if (startDate && endDate) {
      query += " WHERE DATE(tanggal) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
    query += " ORDER BY tanggal DESC, nilai_preferensi DESC";

    const [rows] = await pool.query(query, params);
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
// === EXPORT PDF (DESAIN BARU & CEK DATA) ===
export async function exportLaporanPDF(req, res) {
  try {
    const { startDate, endDate } = req.query;
    console.log(`🖨️ Cetak PDF: ${startDate || 'Semua'} s/d ${endDate || 'Semua'}`);

    let query = "SELECT * FROM laporan_wp";
    const params = [];

    if (startDate && endDate) {
      query += " WHERE DATE(tanggal) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
    // Limit 1000 biar server gak meledak kalau kebanyakan (Opsional)
    query += " ORDER BY tanggal DESC, nilai_preferensi DESC"; 

    const [rows] = await pool.query(query, params);
    console.log(`📄 Data ditemukan: ${rows.length} baris.`);

    // === SETUP PDF ===
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Header Response (Langsung download)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=Laporan_SPK_${Date.now()}.pdf`);

    doc.pipe(res);

    // Judul
    doc.fontSize(16).text("Laporan Hasil SPK Hipertensi", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Periode Data: ${startDate || 'Awal'} s.d. ${endDate || 'Sekarang'}`, { align: "center" });
    doc.moveDown(2);

    if (rows.length === 0) {
      doc.fillColor("red").text("Tidak ada data ditemukan.", { align: "center" });
    } else {
      // === PERSIAPAN DATA TABEL (SANITIZING) ===
      // Kita ubah semua data jadi String biar PDFKit gak error baca null
      const tableData = rows.map((row, i) => {
        return [
            String(i + 1), // No
            row.tanggal ? new Date(row.tanggal).toLocaleDateString("id-ID") : "-", // Tanggal
            row.nama_alternatif ? String(row.nama_alternatif) : "Tanpa Nama", // Nama
            row.nilai_preferensi ? Number(row.nilai_preferensi).toFixed(4) : "0.0000", // Nilai
            i === 0 ? "Terbaik" : "-" // Status
        ];
      });

      const table = {
        title: `Total Data: ${rows.length}`,
        headers: ["No", "Tanggal", "Nama Obat", "Nilai", "Status"],
        rows: tableData // Masukkan data yang sudah dibersihkan
      };

      // Render Tabel
      await doc.table(table, {
        width: 500,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: (row, indexColumn, indexRow, rectRow) => {
          doc.font("Helvetica").fontSize(10);
          // Zebra striping
          if (indexRow % 2 === 0) {
             doc.addBackground(rectRow, '#f0f0f0', 0.5);
          }
        },
      });
    }

    doc.end();

  } catch (err) {
    console.error("❌ PDF Error:", err);
    if (!res.headersSent) res.status(500).send("Gagal cetak PDF: " + err.message);
  }
}