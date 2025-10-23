export async function checkSession() {
  const token = localStorage.getItem("token");

  if (!token) {
    // gak ada token → langsung redirect
    window.location.href = "/login.html";
    return;
  }

  const res = await fetch("/api/auth/session", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!data.loggedIn) {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  }
}
