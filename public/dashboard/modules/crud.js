import { authFetch } from "./utils.js"

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
