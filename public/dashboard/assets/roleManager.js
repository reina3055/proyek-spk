document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem('role'); // Ambil role dari login
    const labelRole = document.getElementById('roleLabel'); // Text kecil di sidebar

    // Ambil elemen berdasarkan label class yang kita buat di HTML tadi
    const adminElements = document.querySelectorAll('.access-admin');
    const superElements = document.querySelectorAll('.access-super');

    if (role === 'super-admin') {
        // === JIKA SUPER ADMIN ===
        if(labelRole) labelRole.textContent = "Super Admin Area";

        // 1. Sembunyikan semua menu Admin (SPK, Laporan, dll)
        adminElements.forEach(el => el.style.display = 'none');

        // 2. Munculkan menu Super Admin (Kelola Pengguna)
        superElements.forEach(el => el.style.display = 'block');

    } else if (role === 'admin') {
        // === JIKA ADMIN BIASA ===
        if(labelRole) labelRole.textContent = "Apoteker Dashboard";

        // 1. Pastikan menu Admin muncul
        adminElements.forEach(el => el.style.display = 'block');

        // 2. Sembunyikan menu Super Admin
        superElements.forEach(el => el.style.display = 'none');
        
    } else {
        // Jaga-jaga kalau role aneh/kosong
        alert("Role tidak dikenali, silakan login ulang.");
        window.location.href = '/login.html';
    }
});