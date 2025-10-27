
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