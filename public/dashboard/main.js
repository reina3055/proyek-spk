// public/dashboard/main.js
import { loadProfilAdmin, logout } from "./modules/auth.js"; // pastikan export ada di auth.js
import "./modules/crud.js";   // Menempelkan fungsi global seperti openModal, loadKriteria, dsb
import "./modules/laporan.js"; // Menempelkan loadHasilWP dan renderLaporan
import "./assets/dashboard.js";
import { authFetch } from "./modules/utils.js";

console.log("main.js loaded");

(async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    window.location.href = "/dashboard/login.html";
    return;
  }

  try {
    const res = await fetch("/api/auth/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.valid) throw new Error("Token invalid");

    // role check
    if (role !== "admin" && role !== "super-admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/dashboard/login.html";
    }

    console.log(`✅ ${role} terverifikasi, lanjut ke dashboard`);
  } catch (err) {
    console.error("Session invalid:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/dashboard/login.html";
  }
})();


document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded fired — setting up nav listeners");
  // cek token awal
  console.log("Token di main.js saat load:", localStorage.getItem("token"));

  // Setup nav
  const navLinks = document.querySelectorAll(".nav-link");
  const pageContents = document.querySelectorAll(".page-content");
  const pageTitle = document.getElementById("page-title");
  // dropdown profil
  const profileBtn = document.getElementById("profile-btn");
  const dropdown = document.getElementById("profile-dropdown");

  if (profileBtn && dropdown) {
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target)) dropdown.classList.add("hidden");
  });
}


  function showPage(pageId, linkEl) {
    pageContents.forEach((p) => p.classList.add("hidden"));
    const el = document.getElementById(`page-${pageId}`);
    if (el) el.classList.remove("hidden");

    navLinks.forEach((n) => n.classList.remove("bg-purple-700"));
    if (linkEl) linkEl.classList.add("bg-purple-700");
    if (linkEl) pageTitle.textContent = linkEl.textContent.trim();

    // load page data
    if (pageId === "beranda") window.renderDashboard?.();
    if (pageId === "kriteria") window.loadKriteria?.();
    if (pageId === "alternatif") window.loadAlternatif?.();
    if (pageId === "nilai") window.renderInputNilai?.();
    if (pageId === "hasil") window.loadHasilWP?.();
    if (pageId === "stok") window.loadStok?.();
    if (pageId === "pengguna") window.loadPengguna?.();
    if (pageId === "laporan") window.renderLaporan?.();
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = link.getAttribute("data-page");
      console.log("nav clicked:", pageId);
      showPage(pageId, link);
    });
  });

  // default page (profil)
  const active = document.querySelector(".nav-link.bg-purple-700") || navLinks[0];
  const defaultPage = active?.getAttribute("data-page") || "beranda";
  showPage(defaultPage, active);

  // load profile (cek session)
  await loadProfilAdmin();

  // logout handler (opsional: jika kamu ganti link logout)
  const logoutLink = document.querySelector('a[href="/login.html"]');
  if (logoutLink) logoutLink.addEventListener("click", (e) => {
    // kita hanya clear token, halaman login akan muncul
    localStorage.removeItem("token");
  });

  // Attach hitung ulang button (jika ada)
  const hitungBtn = document.getElementById("hitung-ulang");
  if (hitungBtn) hitungBtn.addEventListener("click", () => window.loadHasilWP?.());
});


document.getElementById("btn-simpan-konversi")?.addEventListener("click", async () => {
  const skala = document.getElementById("skala-likert").value;

  await authFetch("/api/spk/konversi/setSkala", {
    method: "POST",
    body: JSON.stringify({ skala }),
  });

  await authFetch("/api/spk/konversi/refresh", {
    method: "POST"
  });

  document.getElementById("status-konversi").classList.remove("hidden");
});

// //mungkin harus ditambahkan import2an


// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Token di main.js saat load:", localStorage.getItem("token"));
//   const navLinks = document.querySelectorAll(".nav-link");
//   const pageContents = document.querySelectorAll(".page-content");
//   const pageTitle = document.getElementById("page-title");



// })
