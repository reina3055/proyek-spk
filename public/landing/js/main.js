// ============================================================
// main.js
// 🔹 Logika umum landing page (navigasi & efek interaktif ringan)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌐 Landing Page Loaded.");

  // Navbar link aktif
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    if (currentPath.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Tombol ke halaman hitung (jika ada)
  const hitungLink = document.getElementById("btn-hitung-wp");
  if (hitungLink) {
    hitungLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./hitung.html";
    });
  }

  // Animasi scroll halus untuk elemen dengan href #
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth"
      });
    });
  });
});
