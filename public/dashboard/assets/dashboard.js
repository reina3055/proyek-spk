// ============================================================
// dashboard.js — Statistik Ringkas + Chart WP
// ============================================================
import { authFetch } from "../modules/utils.js";

// 🔹 Animasi angka naik (count-up)
function animateNumber(element, target, duration = 800) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  function update() {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// 🔹 Render Dashboard Utama
export async function renderDashboard() {
  try {
    // Ambil semua data utama secara paralel
    const [altRes, kriRes, stokRes, admRes, calcRes] = await Promise.all([
      authFetch("/api/spk/alternatif"),
      authFetch("/api/spk/kriteria"),
      authFetch("/api/spk/stok"),
      authFetch("/api/auth/users"),
      authFetch("/api/spk/calculate"),
    ]);

    // Cek apakah semua respon OK
    if (![altRes, kriRes, stokRes, admRes, calcRes].every(r => r.ok)) {
      console.error("Gagal mengambil salah satu sumber data.");
      return;
    }

    const [alternatif, kriteria, stok, admin, hasil] = await Promise.all([
      altRes.json(),
      kriRes.json(),
      stokRes.json(),
      admRes.json(),
      calcRes.json(),
    ]);

    // ============================================================
    // 🟣 Update card summary (total data)
    // ============================================================
    animateNumber(document.getElementById("card-alternatif"), alternatif.length);
    animateNumber(document.getElementById("card-kriteria"), kriteria.length);
    animateNumber(
      document.getElementById("card-stok-rendah"),
      stok.filter(s => (s.jumlah_stok ?? 0) < 10).length
    );
    animateNumber(document.getElementById("card-admin"), admin.length);

    // ============================================================
    // 🟣 Fallback jika belum ada hasil WP (belum input nilai)
    // ============================================================
    const ctx = document.getElementById("chartWpResults").getContext("2d");

    if (!hasil || hasil.length === 0) {
      console.warn("⚠️ Belum ada data hasil WP. Kemungkinan belum ada nilai yang diinput.");

      // Bersihkan chart lama kalau ada
      if (window.wpChart) window.wpChart.destroy();

      // Tampilkan teks placeholder di kanvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.fillText(
        "Belum ada hasil perhitungan. Silakan isi nilai terlebih dahulu.",
        ctx.canvas.width / 2,
        ctx.canvas.height / 2
      );

      return; // hentikan proses biar gak lanjut render chart kosong
    }

    // ============================================================
    // 🟣 Render Chart WP
    // ============================================================
    const chartData = hasil.map(h => ({
      label: h.nama_alternatif,
      value: parseFloat(h.nilai_preferensi) || 0,
    }));

    if (window.wpChart) window.wpChart.destroy();

    window.wpChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.map(d => d.label),
        datasets: [
          {
            label: "Nilai Preferensi",
            data: chartData.map(d => d.value),
            borderWidth: 1,
            backgroundColor: "#A78BFA",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Nilai Preferensi" },
          },
        },
      },
    });

    // ============================================================
    // 🟣 Navigasi dari card ke halaman terkait
    // ============================================================
    document.querySelectorAll("#dashboard-cards > div[data-target]").forEach(card => {
      card.addEventListener("click", () => {
        const target = card.getAttribute("data-target");
        const navLink = document.querySelector(`.nav-link[data-page='${target}']`);
        if (navLink) navLink.click();
      });
    });
  } catch (err) {
    console.error("renderDashboard error:", err);
  }
}

window.renderDashboard = renderDashboard;



// // ============================================================
// // dashboard.js — Statistik Ringkas + Chart WP
// // ============================================================
// import { authFetch } from "../modules/utils.js";

// // fungsi kecil buat animasi count-up
// function animateNumber(element, target, duration = 800) {
//   const start = 0;
//   const increment = target / (duration / 16);
//   let current = start;
//   function update() {
//     current += increment;
//     if (current < target) {
//       element.textContent = Math.floor(current);
//       requestAnimationFrame(update);
//     } else {
//       element.textContent = target;
//     }
//   }
//   requestAnimationFrame(update);
// }

// export async function renderDashboard() {

//   try {
//     // ambil semua data utama
//     const [altRes, kriRes, stokRes, admRes, calcRes] = await Promise.all([
//       authFetch("/api/spk/alternatif"),
//       authFetch("/api/spk/kriteria"),
//       authFetch("/api/spk/stok"),
//       authFetch("/api/auth/users"),
//       authFetch("/api/spk/calculate"),
//     ]);

//     if (![altRes, kriRes, stokRes, admRes, calcRes].every(r => r.ok)) {
//       console.error("Gagal mengambil salah satu sumber data.");
//       return;
//     }

//     const [alternatif, kriteria, stok, admin, hasil] = await Promise.all([
//       altRes.json(),
//       kriRes.json(),
//       stokRes.json(),
//       admRes.json(),
//       calcRes.json(),
//     ]);

//     // isi card dengan animasi
//     animateNumber(document.getElementById("card-alternatif"), alternatif.length);
//     animateNumber(document.getElementById("card-kriteria"), kriteria.length);
//     animateNumber(
//       document.getElementById("card-stok-rendah"),
//       stok.filter(s => (s.jumlah_stok ?? 0) < 10).length
//     );
//     animateNumber(document.getElementById("card-admin"), admin.length);

//     // render chart WP
//     const ctx = document.getElementById("chartWpResults").getContext("2d");
//     const chartData = hasil.map(h => ({
//       label: h.nama_alternatif,
//       value: parseFloat(h.nilai_preferensi) || 0,
//     }));

    

    

//     // hapus chart lama kalau ada
//     if (window.wpChart) window.wpChart.destroy();

//     window.wpChart = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: chartData.map(d => d.label),
//         datasets: [
//           {
//             label: "Nilai Preferensi",
//             data: chartData.map(d => d.value),
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: { legend: { display: false } },
//         scales: {
//           y: {
//             beginAtZero: true,
//             title: { display: true, text: "Nilai Preferensi" },
//           },
//         },
//       },
//     });

//     // 🔹 navigasi dari card
// document.querySelectorAll("#dashboard-cards > div[data-target]").forEach(card => {
//   card.addEventListener("click", () => {
//     const target = card.getAttribute("data-target");
//     const navLink = document.querySelector(`.nav-link[data-page='${target}']`);
//     if (navLink) navLink.click();
//   });
// });

//   } catch (err) {
//     console.error("renderDashboard error:", err);
//   }
// }

// window.renderDashboard = renderDashboard;
