// public/dashboard/main.js
import { loadProfilAdmin, logout } from "./modules/auth.js"; // pastikan export ada di auth.js
import "./modules/crud.js";   // Menempelkan fungsi global seperti openModal, loadKriteria, dsb
import "./modules/laporan.js"; // Menempelkan loadHasilWP dan renderLaporan
import { authFetch } from "./modules/utils.js";

console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded fired — setting up nav listeners");
  // cek token awal
  console.log("Token di main.js saat load:", localStorage.getItem("token"));

  // Setup nav
  const navLinks = document.querySelectorAll(".nav-link");
  const pageContents = document.querySelectorAll(".page-content");
  const pageTitle = document.getElementById("page-title");

  function showPage(pageId, linkEl) {
    pageContents.forEach((p) => p.classList.add("hidden"));
    const el = document.getElementById(`page-${pageId}`);
    if (el) el.classList.remove("hidden");

    navLinks.forEach((n) => n.classList.remove("bg-purple-700"));
    if (linkEl) linkEl.classList.add("bg-purple-700");
    if (linkEl) pageTitle.textContent = linkEl.textContent.trim();

    // load page data
    if (pageId === "kriteria") window.loadKriteria?.();
    if (pageId === "alternatif") window.loadAlternatif?.();
    if (pageId === "nilai") window.renderInputNilai?.();
    if (pageId === "hasil") window.loadHasilWP?.();
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
  const defaultPage = active?.getAttribute("data-page") || "profil";
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




// //mungkin harus ditambahkan import2an


// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Token di main.js saat load:", localStorage.getItem("token"));
//   const navLinks = document.querySelectorAll(".nav-link");
//   const pageContents = document.querySelectorAll(".page-content");
//   const pageTitle = document.getElementById("page-title");



// })
