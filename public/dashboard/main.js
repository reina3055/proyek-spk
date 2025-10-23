document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const pageContents = document.querySelectorAll(".page-content");
  const pageTitle = document.getElementById("page-title");

  async function loadProfilAdmin() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/session", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.loggedIn) {
        document.getElementById("nama-admin").textContent = data.user.username;
        document.getElementById("email-admin").textContent = `${data.user.username}@spk.com`;
        document.getElementById("user-id").value = data.user.id;

        const img = document.getElementById("foto-admin");
        img.src = data.user.foto
          ? data.user.foto
          : "https://via.placeholder.com/100/A78BFA/FFFFFF?text=A";
      } else {
        window.location.href = "/login.html";
      }
    } catch {
      console.error("Gagal memuat profil admin");
    }
  }

  loadProfilAdmin();
// Helper fetch dengan token
async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, { ...options, headers });
}

  // 🔹 Navigasi antar halaman
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = link.getAttribute("data-page");

      pageContents.forEach((p) => p.classList.add("hidden"));
      document.getElementById(`page-${pageId}`).classList.remove("hidden");

      navLinks.forEach((n) => n.classList.remove("bg-purple-700"));
      link.classList.add("bg-purple-700");
      pageTitle.textContent = link.textContent.trim();

      if (pageId === "kriteria") loadKriteria();
      if (pageId === "alternatif") loadAlternatif();
      if (pageId === "nilai") renderInputNilai();
      if (pageId === "hasil") loadHasilWP();
      if (pageId === "laporan") renderLaporan();
    });
  });

  // Tombol hitung ulang
  const hitungBtn = document.getElementById("hitung-ulang");
  if (hitungBtn) hitungBtn.addEventListener("click", loadHasilWP);
});

// ============================================================
// 🔹 Modal & CRUD Handler (GLOBAL)
// ============================================================
window.openModal = (type, id = null) => {
  const modalBackdrop = document.getElementById("modal-backdrop");
  const crudModal = document.getElementById("crud-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  let title = "";
  let formHtml = "";

  if (type === "kriteria") {
    title = id ? "Edit Kriteria" : "Tambah Kriteria";
    formHtml = `
      <form id="form-kriteria" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Kriteria</label>
          <input type="text" name="nama" class="w-full border rounded-lg px-3 py-2" required>
        </div>
        <div>
          <label class="block text-sm font-medium">Bobot</label>
          <input type="number" name="bobot" step="0.01" class="w-full border rounded-lg px-3 py-2" required>
        </div>
        <div>
          <label class="block text-sm font-medium">Tipe</label>
          <select name="tipe" class="w-full border rounded-lg px-3 py-2" required>
            <option value="benefit">Benefit</option>
            <option value="cost">Cost</option>
          </select>
        </div>
      </form>`;
  } else if (type === "alternatif") {
    title = id ? "Edit Obat" : "Tambah Obat";
    formHtml = `
      <form id="form-alternatif" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Obat</label>
          <input type="text" name="nama_obat" class="w-full border rounded-lg px-3 py-2" required>
        </div>
      </form>`;
  }

  modalTitle.textContent = title;
  modalBody.innerHTML = formHtml;
  modalBackdrop.classList.remove("hidden");
  crudModal.classList.remove("hidden");
};

window.closeModal = () => {
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.getElementById("crud-modal").classList.add("hidden");
};

// ============================================================
// 🔹 CRUD Kriteria
// ============================================================
window.loadKriteria = async () => {
  const tbody = document.getElementById("tbody-kriteria");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;

  try {
    const res = await authFetch("/api/spk/kriteria");
    const data = await res.json();
    tbody.innerHTML = data
      .map(
        (k) => `
        <tr>
          <td class="px-4 py-2">C${k.id_kriteria}</td>
          <td class="px-4 py-2">${k.nama_kriteria}</td>
          <td class="px-4 py-2">${k.bobot}</td>
          <td class="px-4 py-2">${k.tipe}</td>
          <td class="px-4 py-2 text-right space-x-2">
            <button onclick="openModal('kriteria', ${k.id_kriteria})" class="text-purple-600 hover:underline">Edit</button>
            <button onclick="hapusKriteria(${k.id_kriteria})" class="text-red-600 hover:underline">Hapus</button>
          </td>
        </tr>`
      )
      .join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
  }
};

window.handleFormSubmit = async () => {
  const form = document.querySelector("#crud-modal form");
  if (!form) return;

  const formData = new FormData(form);
  const id = formData.get("id");
  const body = Object.fromEntries(formData.entries());
  const isKriteria = form.id === "form-kriteria";

  try {
    const endpoint = isKriteria ? "/api/spk/kriteria" : "/api/spk/alternatif";
    const res = await authFetch(`${endpoint}${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    alert(data.message || "Berhasil disimpan!");
    closeModal();
    if (isKriteria) loadKriteria(); else loadAlternatif();
  } catch {
    alert("❌ Gagal menyimpan data!");
  }
};

window.hapusKriteria = async (id) => {
  if (!confirm("Yakin ingin menghapus kriteria ini?")) return;
  await authFetch(`/api/spk/kriteria/${id}`, { method: "DELETE" });
  loadKriteria();
};

window.loadAlternatif = async () => {
  const tbody = document.getElementById("tbody-alternatif");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;
  try {
    const res = await authFetch("/api/spk/alternatif");
    const data = await res.json();
    tbody.innerHTML = data
      .map(
        (a) => `
        <tr>
          <td class="px-4 py-2">A${a.id_alternatif}</td>
          <td class="px-4 py-2">${a.nama_obat}</td>
          <td class="px-4 py-2 text-right space-x-2">
            <button onclick="openModal('alternatif', ${a.id_alternatif})" class="text-purple-600 hover:underline">Edit</button>
            <button onclick="hapusAlternatif(${a.id_alternatif})" class="text-red-600 hover:underline">Hapus</button>
          </td>
        </tr>`
      )
      .join("");
  } catch {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
  }
};

window.hapusAlternatif = async (id) => {
  if (!confirm("Yakin ingin menghapus alternatif ini?")) return;
  await authFetch(`/api/spk/alternatif/${id}`, { method: "DELETE" });
  loadAlternatif();
};

window.renderInputNilai = async () => {
  const container = document.getElementById("nilai-container");
  container.innerHTML = `
    <p class="text-gray-500 text-center py-4">
      Modul input nilai belum diaktifkan pada versi ini.
    </p>`;
};


// ============================================================
// 🔹 HASIL WP & LAPORAN
// ============================================================
window.loadHasilWP = async () => {
  const tbody = document.getElementById("tbody-hasil");
  tbody.innerHTML = "<tr><td colspan='2' class='text-center py-6 text-gray-500'>Menghitung...</td></tr>";

  try {
    const res = await authFetch("/api/spk/calculate");
    const data = await res.json();

    tbody.innerHTML = data
      .map(
        (h, i) => `
      <tr class="${i === 0 ? "bg-purple-50 font-semibold" : ""}">
        <td class="px-4 py-2">${h.nama_alternatif}</td>
        <td class="px-4 py-2">${h.nilai_preferensi.toFixed(4)}</td>
      </tr>`
      )
      .join("");

    const saranEl = document.getElementById("saran-obat");
    saranEl.textContent = data.length ? `💊 Saran Obat Terbaik: ${data[0].nama_alternatif}` : "";
  } catch {
    tbody.innerHTML = "<tr><td colspan='2' class='text-center text-red-500 py-6'>Gagal menghitung WP.</td></tr>";
  }
};

window.renderLaporan = async () => {
  const container = document.getElementById("laporan-container");
  container.innerHTML = `
    <div class="mb-4 flex space-x-2 items-center">
      <input type="date" id="start-date" class="border px-3 py-2 rounded">
      <span>s.d.</span>
      <input type="date" id="end-date" class="border px-3 py-2 rounded">
      <button id="filter-btn" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Filter</button>
    </div>
    <div class="flex space-x-2 mb-4">
      <button id="btn-excel" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Unduh Excel</button>
      <button id="btn-pdf" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Unduh PDF</button>
    </div>
    <div id="laporan-table"></div>
  `;

  const tableContainer = document.getElementById("laporan-table");

  async function loadLaporan(start, end) {
    tableContainer.innerHTML = "<p class='text-gray-500'>Memuat laporan...</p>";
    try {
      const url = start && end ? `/api/spk/laporan?start=${start}&end=${end}` : `/api/spk/laporan`;
      const res = await authFetch(url);
      const data = await res.json();

      if (data.length === 0) {
        tableContainer.innerHTML = "<p class='text-gray-500'>Tidak ada data untuk periode ini.</p>";
        return;
      }

      tableContainer.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2">Tanggal</th>
              <th class="px-4 py-2">Nama Obat</th>
              <th class="px-4 py-2">Nilai Preferensi</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (r) => `
              <tr>
                <td class="px-4 py-2">${r.tanggal}</td>
                <td class="px-4 py-2">${r.nama_alternatif}</td>
                <td class="px-4 py-2">${r.nilai_preferensi.toFixed(4)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>`;
    } catch {
      tableContainer.innerHTML = "<p class='text-red-500'>Gagal memuat laporan.</p>";
    }
  }

  loadLaporan();

  document.getElementById("filter-btn").addEventListener("click", () => {
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    if (!start || !end) return alert("Pilih rentang tanggal terlebih dahulu!");
    loadLaporan(start, end);
  });

  document.getElementById("btn-excel").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  window.open(`/api/spk/laporan/excel?token=${token}`, "_blank");
});
document.getElementById("btn-pdf").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  window.open(`/api/spk/laporan/pdf?token=${token}`, "_blank");
});
}
