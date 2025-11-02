// ============================================================
// auth.js
// 🔹 Load profil admin & helper logout
// ============================================================
import { authFetch } from "./utils.js";

export async function loadProfilAdmin() {
  try {
    const token = localStorage.getItem("token");
    const res = await authFetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    // Jika server merespon non-ok, redirect ke login
    if (!res.ok) {
      console.warn("Session check gagal:", res.status);
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    const data = await res.json();
    if (data.loggedIn) {
      // update header baru
  const nameEl = document.getElementById("admin-name");
  const emailEl = document.getElementById("admin-email");

  if (nameEl) nameEl.textContent = data.user.username || "Admin";
  if (emailEl) emailEl.textContent = data.user.email || `${data.user.username}@spk.com`;

  // tetap simpan user id (jika perlu di form lain)
  const idEl = document.getElementById("user-id");
  if (idEl) idEl.value = data.user.id || "";

      const img = document.getElementById("admin-avatar");
if (img && !data.user.foto) {
  const initial = (data.user.username?.[0] || "A").toUpperCase();
  img.src = `https://via.placeholder.com/40/A78BFA/FFFFFF?text=${initial}`;
}

    } else {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    }
  } catch (err) {
    console.error("Gagal memuat profil admin:", err);
    // fallback: redirect ke login
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// backward compatibility (jika ada kode lama yang pakai window)
window.loadProfilAdmin = window.loadProfilAdmin || loadProfilAdmin;
window.logout = window.logout || logout;



// import { authFetch } from "./utils.js";

// // ============================================================
// // 🔹 Load Profil Admin & Session Check
// // ============================================================
// export async function loadProfilAdmin() {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     window.location.href = "/login.html"; 
//     return;
//   }

//   try {
//     const res = await fetch("/api/auth/session", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     if (!data.loggedIn) {
//       localStorage.removeItem("token");
//       window.location.href = "/login.html";
//       return;
//     }

//     const user = data.user;
//     document.getElementById("nama-admin").textContent = user.username;
//     document.getElementById("email-admin").textContent = `${user.username}@spk.com`;
//     document.getElementById("user-id").value = user.id;
//     document.getElementById("foto-admin").src =
//       user.foto || "/assets/default-avatar.png";
//   } catch (err) {
//     console.error("❌ Gagal memuat profil admin:", err);
//   }
// }

// export function logout() {
//   localStorage.removeItem("token");
//   window.location.href = "/login.html";
// }


//  async function loadProfilAdmin() {
//       // Sedikit delay biar localStorage keburu keisi
//   await new Promise((resolve) => setTimeout(resolve, 150));
//     // 🛡️ Guard: jangan jalan di halaman login
//     if (window.location.pathname.includes("login.html")) {
//       console.log("🔸 Skip session check di halaman login");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("⚠️ Token belum ada, redirect ke login...");
//       window.location.href = "/login.html";
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/session", {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       // Jika backend error total
//       if (!res.ok) {
//         console.error(`❌ Gagal koneksi ke server (${res.status})`);
//         return;
//       }

//       const data = await res.json();
//       if (!data.loggedIn) {
//         console.warn("⚠️ Token tidak valid atau sesi berakhir");
//         localStorage.removeItem("token");
//         window.location.href = "/login.html";
//         return;
//       }

//       // ✅ Tampilkan profil admin
//       const user = data.user;
//       document.getElementById("nama-admin").textContent = user.username;
//       document.getElementById("email-admin").textContent = `${user.username}@spk.com`;
//       document.getElementById("user-id").value = user.id;
//       document.getElementById("foto-admin").src =
//         user.foto || "https://via.placeholder.com/100/A78BFA/FFFFFF?text=A";

//       console.log("✅ Token valid, user:", user.username);
//     } catch (err) {
//       console.error("❌ Gagal memuat profil admin:", err);
//     }
//   }

//   // Jalankan otomatis pas dashboard diload
//   loadProfilAdmin();
// });