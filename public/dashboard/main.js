document.addEventListener("DOMContentLoaded", async () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const pageContents = document.querySelectorAll(".page-content");
  const pageTitle = document.getElementById("page-title");

  // Delay ringan supaya token sudah siap
  await new Promise((resolve) => setTimeout(resolve, 150));

  // ============================================================
  // 🧠 LOAD PROFIL ADMIN
  // ============================================================
  async function loadProfilAdmin() {
    if (window.location.pathname.includes("login.html")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Token belum ada, redirect ke login...");
      window.location.href = "/login.html";
      return;
    }

    try {
      const res = await fetch("/api/auth/session", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`❌ Gagal koneksi ke server (${res.status})`);
        return;
      }

      const data = await res.json();
      if (!data.loggedIn) {
        console.warn("⚠️ Token tidak valid atau sesi berakhir");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
        return;
      }

      // ✅ Tampilkan profil admin
      const user = data.user;
      document.getElementById("nama-admin").textContent = user.username;
      document.getElementById("email-admin").textContent = `${user.username}@spk.com`;
      document.getElementById("user-id").value = user.id;
      document.getElementById("foto-admin").src =
        user.foto || "https://via.placeholder.com/100/A78BFA/FFFFFF?text=A";
    } catch (err) {
      console.error("❌ Gagal memuat profil admin:", err);
    }
  }

  loadProfilAdmin();

  // ============================================================
  // 🧭 NAVIGASI ANTAR HALAMAN
  // ============================================================
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = link.getAttribute("data-page");

      // Sembunyikan semua section
      pageContents.forEach((p) => p.classList.add("hidden"));
      document.getElementById(`page-${pageId}`).classList.remove("hidden");

      // Ubah highlight sidebar
      navLinks.forEach((n) => n.classList.remove("bg-purple-700"));
      link.classList.add("bg-purple-700");

      // Ubah judul
      pageTitle.textContent = link.textContent.trim();

      // Load konten halaman sesuai menu
      if (pageId === "kriteria") loadKriteria();
      if (pageId === "alternatif") loadAlternatif();
      if (pageId === "nilai") renderInputNilai();
      if (pageId === "hasil") loadHasilWP();
      if (pageId === "laporan") renderLaporan();
    });
  });

  // Tombol hitung ulang hasil WP
  const hitungBtn = document.getElementById("hitung-ulang");
  if (hitungBtn) hitungBtn.addEventListener("click", loadHasilWP);
});

// ============================================================
// 🔹 Helper fetch universal pakai token (dengan auto-refresh)
// ============================================================
async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    let res = await fetch(url, { ...options, headers });

    // Jika token expired
    if (res.status === 401 || res.status === 403) {
      console.warn("⚠️ Token expired, mencoba refresh...");

      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem("token", data.token);
        headers["Authorization"] = `Bearer ${data.token}`;
        res = await fetch(url, { ...options, headers });
      } else {
        console.error("❌ Refresh gagal, logout");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
      }
    }

    return res;
  } catch (err) {
    console.error("❌ Gagal menghubungi server:", err);
    throw err;
  }
}

// ============================================================
// 🔹 MODAL HANDLER
// ============================================================
window.openModal = (type, id = null) => {
  const modalBackdrop = document.getElementById("modal-backdrop");
  const crudModal = document.getElementById("crud-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  let title = "";
  let formHtml = "";

  if (type === "kriteria") {
    title = id ? "Edit Kriteria" : "Tambah Kriteria";
    formHtml = `
      <form id="form-kriteria" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Kriteria</label>
          <input type="text" name="nama" class="w-full border rounded-lg px-3 py-2" required>
        </div>
        <div>
          <label class="block text-sm font-medium">Bobot</label>
          <input type="number" name="bobot" step="0.01" class="w-full border rounded-lg px-3 py-2" required>
        </div>
        <div>
          <label class="block text-sm font-medium">Tipe</label>
          <select name="tipe" class="w-full border rounded-lg px-3 py-2" required>
            <option value="benefit">Benefit</option>
            <option value="cost">Cost</option>
          </select>
        </div>
      </form>`;
  } else if (type === "alternatif") {
    title = id ? "Edit Obat" : "Tambah Obat";
    formHtml = `
      <form id="form-alternatif" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Obat</label>
          <input type="text" name="nama_obat" class="w-full border rounded-lg px-3 py-2" required>
        </div>
      </form>`;
  }

  modalTitle.textContent = title;
  modalBody.innerHTML = formHtml;
  modalBackdrop.classList.remove("hidden");
  crudModal.classList.remove("hidden");
};

window.closeModal = () => {
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.getElementById("crud-modal").classList.add("hidden");
};

// ============================================================
// 🔹 CRUD & LAPORAN (fungsi lain tetap sama seperti versi kamu)
// ============================================================
