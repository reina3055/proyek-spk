export async function checkSession() {
  // ⛔ Jangan cek session di login page
  if (window.location.pathname.includes("login.html")) return;

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  } 

  const res = await fetch("/api/auth/session", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  

  const data = await res.json();
  if (!data.loggedIn) {
    alert("Sesi kamu sudah berakhir, silakan login ulang.");
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  }
}
