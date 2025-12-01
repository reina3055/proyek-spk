// public/dashboard/main.js
import { logout } from "./modules/auth.js"; 
import "./modules/crud.js"; 
import "./modules/laporan.js"; 
import "./assets/dashboard.js";
import { authFetch } from "./modules/utils.js";

console.log("main.js loaded");

// ==========================================
// 1. CEK TOKEN AWAL (Fast Check)
// ==========================================
(async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    window.location.href = "../login.html"; // Sesuaikan path jika perlu
    return;
  }

  try {
    // Verifikasi token valid ke server
    const res = await fetch("/api/auth/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.valid) throw new Error("Token invalid");

    // Cek Role
    if (role !== "admin") {
      throw new Error("Role tidak sesuai");
    }

    console.log(`✅ ${role} terverifikasi, lanjut ke dashboard`);
  } catch (err) {
    console.error("Session invalid:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "../login.html";
  }
})();

// ==========================================
// 2. MAIN EVENT LISTENER
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded fired — setting up dashboard");

  // A. Load Profil User (Header & Card)
  await initUserProfile();

  setupProfileUpdate();

  // B. Setup Fitur Upload Foto
  setupPhotoUpload();

  // C. Setup Dropdown Profil (Header)
  setupDropdown();

  // D. Setup Navigasi Halaman
  setupNavigation();

  // E. Setup Tombol Logout Global
  const logoutBtns = document.querySelectorAll("#logout-btn, #logout-Btn"); // Cover tombol sidebar & dropdown
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.logout();
    });
  });

  const hitungBtn = document.getElementById("hitung-ulang");
    if (hitungBtn) {
        // Hapus listener lama (opsional, tapi aman) biar gak double
        const newBtn = hitungBtn.cloneNode(true);
        hitungBtn.parentNode.replaceChild(newBtn, hitungBtn);
        
        // Pasang listener baru
        newBtn.addEventListener("click", () => {
            console.log("Tombol Hitung Ulang diklik!");
            window.loadHasilWP();
        });
    }

  // F. Setup Konversi Nilai (Jika ada)
  //setupKonversi();
  setupChangePassword();
  setupPasswordToggle();
  setupSidebar();
});

// ==========================================
// 3. FUNGSI-FUNGSI LOGIKA (Helpers)
// ==========================================

// --- Setup Navigasi (Show Page) ---
function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const pageContents = document.querySelectorAll(".page-content");
    const pageTitle = document.getElementById("page-title");

    function showPage(pageId, linkEl) {
        // Sembunyikan semua page
        pageContents.forEach((p) => p.classList.add("hidden"));
        
        // Munculkan page yang dipilih
        const el = document.getElementById(`page-${pageId}`);
        if (el) el.classList.remove("hidden");

        // Update style tombol aktif
        navLinks.forEach((n) => n.classList.remove("bg-purple-700"));
        if (linkEl) linkEl.classList.add("bg-purple-700");
        
        // Update Judul Halaman
        if (linkEl && pageTitle) pageTitle.textContent = linkEl.textContent.trim();

        // Trigger fungsi load data per halaman (Module Loading)
        if (pageId === "beranda") window.renderDashboard?.();
        if (pageId === "kriteria") window.loadKriteria?.();
        if (pageId === "alternatif") window.loadAlternatif?.();
        if (pageId === "nilai") window.renderInputNilai?.();
        if (pageId === "hasil") window.loadHasilWP?.();
        if (pageId === "stok") window.loadStok?.();
        if (pageId === "pengguna") window.loadPengguna?.();
        if (pageId === "laporan") window.renderLaporan?.();
    }

    // Event Listener Klik Menu
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const pageId = link.getAttribute("data-page");
            showPage(pageId, link);
        });
    });

    // Load Halaman Default (Biasanya Beranda)
    const active = document.querySelector(".nav-link.bg-purple-700") || navLinks[0];
    const defaultPage = active?.getAttribute("data-page") || "beranda";
    showPage(defaultPage, active);
}

// --- Setup Dropdown Header ---
function setupDropdown() {
    const profileBtn = document.getElementById("profile-btn");
    const dropdown = document.getElementById("profile-dropdown");

    if (profileBtn && dropdown) {
        // Toggle klik
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });

        // Tutup kalau klik di luar
        document.addEventListener("click", (e) => {
            if (!profileBtn.contains(e.target)) dropdown.classList.add("hidden");
        });
    }
}

// --- Load Data Profil (Backend -> UI) ---
async function initUserProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("/api/auth/session", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        // 🔥 TAMBAHKAN BARIS INI UNTUK NGECEK 🔥
console.log("DATA DARI SERVER:", data);
        
        // Kalau sesi habis, logout
        if (!data.loggedIn) {
            window.logout();
            return;
        }

        const user = data.user;

        // 1. UPDATE TAMPILAN HEADER (Pojok Kanan Atas)
        const headerName = document.getElementById("admin-name");
        const headerEmail = document.getElementById("admin-email");
        const headerAvatar = document.getElementById("admin-avatar");

        if (headerName) headerName.textContent = user.nama || user.username;
        if (headerEmail) headerEmail.textContent = user.email;
        
        // Logic Foto Profil
        const inisial = (user.nama || "A").charAt(0);
        const fotoUrl = user.foto ? user.foto : `https://via.placeholder.com/150/A78BFA/FFFFFF?text=${inisial}`;
        if (headerAvatar) headerAvatar.src = fotoUrl;

        // 2. UPDATE TAMPILAN KARTU PROFIL
        const cardName = document.getElementById("nama-admin-card");
        if (cardName) {
            // Teks Statis di Kiri
            cardName.textContent = user.nama || user.username;
            document.getElementById("email-admin-card").textContent = user.email;
            document.getElementById("role-admin-card").textContent = user.role;
            document.getElementById("foto-admin").src = fotoUrl;

            // === BAGIAN PENTING: ISI FORM INPUT DI KANAN ===
            // Kita set property .value agar form terisi
            const inputNama = document.getElementById("edit-nama");
            const inputUser = document.getElementById("edit-username");
            const inputEmail = document.getElementById("edit-email");
            const inputId = document.getElementById("user-id");

            if (inputNama) inputNama.value = user.nama || "";
            if (inputUser) inputUser.value = user.username || "";
            if (inputEmail) inputEmail.value = user.email || "";
            if (inputId) inputId.value = user.id; 
            
            console.log("✅ Data profil berhasil dimuat ke form:", user.nama);
        }

    } catch (err) {
        console.error("Gagal memuat profil:", err);
    }
}

function setupProfileUpdate() {
    const form = document.getElementById("form-update-profil");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const id = document.getElementById("user-id").value;
        const nama = document.getElementById("edit-nama").value;
        const username = document.getElementById("edit-username").value;
        const email = document.getElementById("edit-email").value;
        // Role kita ambil statis atau dari hidden input kalau mau, tapi biasanya admin gak bisa ganti role sendiri sembarangan
        const role = document.getElementById("role-admin-card").textContent.toLowerCase(); 

        const token = localStorage.getItem("token");

        Swal.fire({ title: 'Menyimpan...', didOpen: () => Swal.showLoading() });

        try {
            // Kita pakai endpoint update user yang sudah ada (registerController.js)
            const res = await fetch(`/api/auth/users/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nama, username, email, role })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            Swal.fire("Berhasil", "Profil berhasil diperbarui!", "success");
            
            // Refresh tampilan profil biar update
            initUserProfile(); 

        } catch (err) {
            Swal.fire("Gagal", err.message, "error");
        }
    });
}

// --- Upload Foto Logic ---
function setupPhotoUpload() {
    const uploadInput = document.getElementById("upload-foto");
    const userIdInput = document.getElementById("user-id");

    if (!uploadInput) return;

    uploadInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            Swal.fire("Error", "Format file harus JPG atau PNG!", "error");
            return;
        }

        const formData = new FormData();
        formData.append("foto", file);
        if(userIdInput && userIdInput.value) {
            formData.append("id", userIdInput.value);
        }

        const token = localStorage.getItem("token");

        // UI Loading
        Swal.fire({
            title: 'Mengupload...',
            didOpen: () => Swal.showLoading()
        });

        try {
            const res = await fetch("/api/auth/upload-foto", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal upload");

            // Sukses
            Swal.fire("Berhasil", "Foto profil diperbarui!", "success");

            // Update Image Realtime
            const newSrc = `${data.foto}?t=${new Date().getTime()}`;
            
            const imgProfil = document.getElementById("foto-admin");
            if (imgProfil) imgProfil.src = newSrc;

            const imgHeader = document.getElementById("admin-avatar");
            if (imgHeader) imgHeader.src = newSrc;

        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.message, "error");
        }
    });
}

// --- Setup Tombol Konversi (Opsional) ---
// function setupKonversi() {
//     const btnKonversi = document.getElementById("btn-simpan-konversi");
//     if (btnKonversi) {
//         btnKonversi.addEventListener("click", async () => {
//             const skala = document.getElementById("skala-likert").value;
//             try {
//                 await authFetch("/api/spk/konversi/setSkala", {
//                     method: "POST",
//                     body: JSON.stringify({ skala }),
//                 });
//                 await authFetch("/api/spk/konversi/refresh", { method: "POST" });
//                 document.getElementById("status-konversi").classList.remove("hidden");
//             } catch (error) {
//                 console.error("Gagal konversi:", error);
//             }
//         });
//     }
// }

function setupChangePassword() {
  const formPass = document.getElementById("form-ganti-password");
  if (!formPass) return;

  formPass.addEventListener("submit", async (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById("pass-lama").value;
    const newPassword = document.getElementById("pass-baru").value;
    const confirmPassword = document.getElementById("pass-konfirm").value;

    // Validasi Sederhana di Frontend
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Konfirmasi password baru tidak cocok!", "error");
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire("Error", "Password baru minimal 6 karakter!", "warning");
      return;
    }

    const token = localStorage.getItem("token");

    // Loading...
    Swal.fire({
      title: 'Memproses...',
      didOpen: () => Swal.showLoading()
    });

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Password telah diganti. Silakan login ulang.",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        // Logout otomatis supaya aman
        window.logout(); 
      });

      formPass.reset(); // Kosongkan form

    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
  });
}

function setupPasswordToggle() {
    // Cari semua tombol yang punya class 'toggle-password'
    const toggleBtns = document.querySelectorAll('.toggle-password');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cari input sibling (saudaranya) di dalam div parent yang sama
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text'; // Jadi kelihatan
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash'); // Ganti ikon jadi mata dicoret
            } else {
                input.type = 'password'; // Jadi titik-titik lagi
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye'); // Ganti ikon jadi mata biasa
            }
        });
    });
}
function setupSidebar() {
    const sidebar = document.getElementById("sidebar");
    const burgerBtn = document.getElementById("hamburger-btn");
    const overlay = document.getElementById("sidebar-overlay");
    const mainContent = document.querySelector("main"); // Ambil konten utama

    // Fungsi Toggle
    function toggleSidebar() {
        const isMobile = window.innerWidth < 768; // Cek ukuran layar (768px batas tailwind 'md')

        if (isMobile) {
            // --- LOGIKA HP (Overlay) ---
            const isClosed = sidebar.classList.contains("-translate-x-full");
            if (isClosed) {
                sidebar.classList.remove("-translate-x-full"); // Buka
                overlay.classList.remove("hidden");
            } else {
                sidebar.classList.add("-translate-x-full"); // Tutup
                overlay.classList.add("hidden");
            }
        } else {
            // --- LOGIKA LAPTOP (Collapsible / Menyusut) ---
            // Kita mainkan class w-64 (lebar) dan w-0 (hilang)
            
            if (sidebar.classList.contains("w-64")) {
                // TUTUP SIDEBAR DI LAPTOP
                sidebar.classList.remove("w-64");
                sidebar.classList.add("w-0");
                sidebar.classList.add("p-0"); // Hapus padding biar bener-bener ilang
            } else {
                // BUKA SIDEBAR DI LAPTOP
                sidebar.classList.remove("w-0");
                sidebar.classList.remove("p-0");
                sidebar.classList.add("w-64");
            }
        }
    }

    if (burgerBtn) {
        // Hapus listener lama (karena pakai replace element agak ribet, kita timpa onclick aja biar simpel)
        burgerBtn.onclick = (e) => {
            e.stopPropagation();
            toggleSidebar();
        };
    }

    if (overlay) {
        overlay.onclick = toggleSidebar;
    }
    
    // Auto-fix layout saat resize layar
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            overlay.classList.add("hidden"); // Sembunyikan overlay hitam di laptop
            sidebar.classList.remove("-translate-x-full"); // Reset posisi translate
            
            // Pastikan sidebar kebuka default di laptop kalau belum diapa-apain
            if (!sidebar.classList.contains("w-0")) {
                sidebar.classList.add("w-64");
            }
        } else {
            // Balikin ke mode mobile default (tertutup)
            sidebar.classList.add("w-64"); 
            sidebar.classList.remove("w-0", "p-0");
            sidebar.classList.add("-translate-x-full");
        }
    });
}
// ==========================================
// 4. GLOBAL EXPORT
// ==========================================
window.logout = function() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "../login.html"; // Sesuaikan path login
};