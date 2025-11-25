import { authFetch } from "../modules/utils.js";

// Animasi angka
function animateNumber(el, target, duration = 700) {
  let current = 0;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  update();
}

export async function renderDashboard() {
  try {
    const [alt, kri, adm, calc] = await Promise.all([
      authFetch("/api/spk/alternatif"),
      authFetch("/api/spk/kriteria"),
      //authFetch("/api/spk/stok"),
      authFetch("/api/auth/users"),
      authFetch("/api/spk/calculate"), // sudah WP versi baru
    ]);

    const alternatif = await alt.json();
    const kriteria = await kri.json();
    //const stokData = await stok.json();
    const admin = await adm.json();
    const hasil = await calc.json(); // WP sekarang -> score + preferensi

    // Update Cards
    animateNumber(document.getElementById("card-alternatif"), alternatif.length);
    animateNumber(document.getElementById("card-kriteria"), kriteria.length);
    // animateNumber(
    //   document.getElementById("card-stok-rendah"),
    //   stokData.filter(s => (s.jumlah_stok ?? 0) < 10).length
    // );
    animateNumber(document.getElementById("card-admin"), admin.length);

    // ============================
    // 🔹 Alternatif terbaik (preferensi tertinggi)
    // ============================
    if (hasil.length > 0) {
      const terbaik = [...hasil].sort((a, b) => b.preferensi - a.preferensi)[0];
      document.getElementById("alternatif-terbaik").textContent =
        `${terbaik.nama} ( ${terbaik.preferensi.toFixed(4)} )`;
    }

    // ============================
    // 🔹 Render Chart WP (pakai preferensi)
    // ============================
    const ctx = document.getElementById("chartWpResults").getContext("2d");

    if (window.wpChart) window.wpChart.destroy();

    window.wpChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: hasil.map(h => h.nama),
        datasets: [
          {
            label: "Nilai Preferensi WP",
            data: hasil.map(h => h.preferensi),
            backgroundColor: "#A78BFA",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      },
    });

    // ============================
    // 🔹 Top 5 Ranking (by preferensi)
    // ============================
    const top5 = [...hasil].sort((a, b) => b.preferensi - a.preferensi).slice(0, 5);

    document.getElementById("top5-ranking").innerHTML = top5
      .map(
        (r, i) => `
        <tr>
          <td class="px-3 py-2">${i + 1}</td>
          <td class="px-3 py-2">${r.nama}</td>
          <td class="px-3 py-2">${r.preferensi.toFixed(4)}</td>
        </tr>`
      )
      .join("");

    // ============================
    // 🔹 Bobot Kriteria
    // ============================
    document.getElementById("bobot-kriteria").innerHTML = kriteria
      .map(
        k => `
      <div class="p-4 bg-gray-50 border rounded-lg shadow-sm">
        <p class="font-semibold text-purple-800">${k.nama_kriteria}</p>
        <p class="text-sm text-gray-600">Bobot: ${k.bobot}</p>
        <p class="text-xs text-gray-500">Tipe: ${k.tipe}</p>
      </div>`
      )
      .join("");

    // Klik navigasi
    document.querySelectorAll("#dashboard-cards > div[data-target]").forEach(card => {
      card.addEventListener("click", () => {
        const target = card.dataset.target;
        document.querySelector(`.nav-link[data-page="${target}"]`).click();
      });
    });

  } catch (err) {
    console.error("Error render dashboard:", err);
  }
}

window.renderDashboard = renderDashboard;
