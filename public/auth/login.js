// ============================================================
// login.js — Login untuk Admin / Super-Admin
// ============================================================
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const role = document.getElementById('role');
const err = document.getElementById('errorMessage');
const btn = document.getElementById('loginBtn');
const text = document.getElementById('loginText');
const spinner = document.getElementById('spinner');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  err.classList.add('opacity-0');
  spinner.classList.remove('hidden');
  btn.disabled = true;
  text.textContent = 'Memeriksa...';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value.trim(),
        role: role.value,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login gagal.');

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);

    // navigasi
    if (data.user.role === 'super-admin' || data.user.role === 'admin') {
      window.location.href = '/dashboard/index.html';
    } else {
      throw new Error('Role tidak diizinkan.');
    }
  } catch (errMsg) {
    err.textContent = errMsg.message;
    err.classList.remove('opacity-0');
  } finally {
    spinner.classList.add('hidden');
    text.textContent = 'Login';
    btn.disabled = false;
  }
});
