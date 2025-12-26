// ============================================================
// register.js — Registrasi Admin / Super-Admin
// ============================================================
const form = document.getElementById('registerForm');
const nama = document.getElementById('nama');
const email = document.getElementById('email');
const password = document.getElementById('password');
const role = document.getElementById('role');
const err = document.getElementById('errorMessage');
const success = document.getElementById('successMessage');
const btn = document.getElementById('registerBtn');
const text = document.getElementById('registerText');
const spinner = document.getElementById('spinner');
// ... kode sebelumnya ...
const securityCodeInput = document.getElementById('securityCode'); // Ambil elemen input baru
// ============================================
// Fitur Lihat/Sembunyikan Password
// ============================================
const toggleBtn = document.getElementById('togglePassword');
const passInput = document.getElementById('password');

if (toggleBtn && passInput) {
  toggleBtn.addEventListener('click', function () {
    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);

    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
}

    // ... sisa kode sama ...
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  err.classList.add('opacity-0');
  success.classList.add('opacity-0');
  spinner.classList.remove('hidden');
  btn.disabled = true;
  text.textContent = 'Mendaftar...';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: nama.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        // role: 'admin',
        securityCode: securityCodeInput.value.trim() // Kirim kode rahasia
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mendaftar.');

    success.textContent = 'Berhasil mendaftar! Silakan login.';
    success.classList.remove('opacity-0');

    setTimeout(() => (window.location.href = './login.html'), 1500);
  } catch (errMsg) {
    err.textContent = errMsg.message;
    err.classList.remove('opacity-0');
  } finally {
    spinner.classList.add('hidden');
    text.textContent = 'Daftar';
    btn.disabled = false;
  }
});



// // ============================================================
// // register.js — Registrasi Akun dengan Role (User / Apoteker)
// // ============================================================
// const registerForm = document.getElementById('registerForm');
// const namaInput = document.getElementById('nama');
// const emailInput = document.getElementById('email');
// const passwordInput = document.getElementById('password');
// const roleSelect = document.querySelector('select[name="role"]');
// const registerBtn = document.getElementById('registerBtn');
// const registerText = document.getElementById('registerText');
// const spinner = document.getElementById('spinner');
// const errorMsg = document.getElementById('errorMessage');
// const successMsg = document.getElementById('successMessage');

// registerForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const nama = namaInput.value.trim();
//   const email = emailInput.value.trim();
//   const password = passwordInput.value.trim();
//   const role = roleSelect.value;

//   if (!nama || !email || !password || !role) {
//     return showError('Lengkapi semua kolom terlebih dahulu.');
//   }

//   spinner.classList.remove('hidden');
//   registerBtn.disabled = true;
//   registerText.textContent = 'Mendaftar...';

//   try {
//     const res = await fetch('/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ nama, email, password, role }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || 'Gagal mendaftar.');

//     successMsg.textContent = 'Berhasil mendaftar! Silakan login.';
//     successMsg.classList.remove('opacity-0');

//     // redirect otomatis ke login
//     setTimeout(() => (window.location.href = '/auth/login.html'), 1500);
//   } catch (err) {
//     showError(err.message);
//   } finally {
//     spinner.classList.add('hidden');
//     registerBtn.disabled = false;
//     registerText.textContent = 'Daftar';
//   }
// });

// function showError(msg) {
//   errorMsg.textContent = msg;
//   errorMsg.classList.remove('opacity-0');
// }
