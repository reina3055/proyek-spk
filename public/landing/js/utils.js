// ============================================================
// utils.js
// 🔹 Helper universal untuk fetch data dari backend SPK
// ============================================================

/**
 * Fungsi authFetch digunakan untuk melakukan fetch dengan token (jika ada).
 * Token disimpan di localStorage agar bisa digunakan lintas halaman.
 *
 * @param {string} url - Endpoint API (misal: /api/spk/calculate)
 * @param {object} options - Opsi tambahan untuk fetch (method, headers, body)
 * @returns {Promise<Response>}
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers ? { ...options.headers } : {};

  // Tambahkan header Authorization jika token tersedia
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Tambahkan Content-Type default
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url, { ...options, headers });

    // Cek status response untuk error 401/403
    if (res.status === 401 || res.status === 403) {
      console.warn("⚠️ Akses ditolak, token tidak valid atau kadaluarsa.");
      localStorage.removeItem("token");
      alert("Sesi Anda telah berakhir. Silakan login ulang.");
      window.location.href = "/login.html";
    }

    return res;
  } catch (err) {
    console.error("❌ Gagal menghubungi server:", err);
    throw err;
  }
}

/**
 * Utility tambahan: format tanggal agar lebih mudah dibaca
 * @param {string|Date} dateStr
 * @returns {string} format tanggal (DD-MM-YYYY)
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
