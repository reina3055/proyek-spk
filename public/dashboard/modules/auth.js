import { authFetch } from "./utils.js";

// ============================================================
// 🔹 Load Profil Admin & Session Check
// ============================================================
export async function loadProfilAdmin() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch("/api/auth/session", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!data.loggedIn) {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    const user = data.user;
    document.getElementById("nama-admin").textContent = user.username;
    document.getElementById("email-admin").textContent = `${user.username}@spk.com`;
    document.getElementById("user-id").value = user.id;
    document.getElementById("foto-admin").src =
      user.foto || "/assets/default-avatar.png";
  } catch (err) {
    console.error("❌ Gagal memuat profil admin:", err);
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}


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