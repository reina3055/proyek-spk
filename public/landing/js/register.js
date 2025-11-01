// ============================================================
// register.js — Registrasi publik tanpa role
// ============================================================
const form = document.getElementById('registerForm');
const nama = document.getElementById('nama');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorMsg = document.getElementById('errorMessage');
const successMsg = document.getElementById('successMessage');
const btn = document.getElementById('registerBtn');
const text = document.getElementById('registerText');
const spinner = document.getElementById('spinner');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMsg.classList.add('opacity-0');
  successMsg.classList.add('opacity-0');
  spinner.classList.remove('hidden');
  text.textContent = 'Mendaftar...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: nama.value.trim(),
        email: email.value.trim(),
        password: password.value.trim()
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mendaftar.');

    successMsg.textContent = 'Berhasil mendaftar! Silakan login.';
    successMsg.classList.remove('opacity-0');

    setTimeout(() => (window.location.href = './login.html'), 1500);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove('opacity-0');
  } finally {
    spinner.classList.add('hidden');
    text.textContent = 'Daftar';
    btn.disabled = false;
  }
});
