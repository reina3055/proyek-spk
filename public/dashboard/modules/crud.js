/// ============================================================
// crud.js
// 🔹 Modal & CRUD handler untuk kriteria & alternatif
// ============================================================
import { authFetch } from "./utils.js";

// ---------- Modal ----------
export async function openModal(type, id = null) {
  const modalBackdrop = document.getElementById("modal-backdrop");
  const crudModal = document.getElementById("crud-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  let title = "";
  let formHtml = "";

  if (type === "kriteria") {
    title = id ? "Edit Kriteria" : "Tambah Kriteria";
    formHtml = `
      <form id="form-kriteria" data-type="kriteria" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Kriteria</label>
          <input type="text" name="nama_kriteria" class="w-full border rounded-lg px-3 py-2" required>
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
      <form id="form-alternatif" data-type="alternatif" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Obat</label>
          <input type="text" name="nama_obat" class="w-full border rounded-lg px-3 py-2" required>
        </div>
      </form>`;
  } else if (type === "stok") {
    title = id ? "Edit Stok Obat" : "Tambah Stok Obat";
    formHtml = `
      <form id="form-stok" data-type="stok" class="space-y-3">
        <input type="hidden" name="id" value="${id || ""}">
        <div>
          <label class="block text-sm font-medium">Nama Obat</label>
          <input type="text" name="nama_obat" class="w-full border rounded-lg px-3 py-2" required>
        </div>
        <div>
          <label class="block text-sm font-medium">Golongan</label>
          <input type="text" name="golongan" class="w-full border rounded-lg px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium">Nama Dagang</label>
          <input type="text" name="nama_dagang" class="w-full border rounded-lg px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium">Produsen</label>
          <input type="text" name="produsen" class="w-full border rounded-lg px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium">Jumlah Stok</label>
          <input type="number" name="jumlah_stok" class="w-full border rounded-lg px-3 py-2" required>
        </div>
      </form>`;
  } else if (type === "pengguna") {
  title = id ? "Edit Pengguna" : "Tambah Pengguna";
  formHtml = `
    <form id="form-pengguna" data-type="pengguna" class="space-y-3">
      <input type="hidden" name="id" value="${id || ""}">
      <div>
        <label class="block text-sm font-medium">Nama</label>
        <input type="text" name="nama" class="w-full border rounded-lg px-3 py-2" required>
      </div>
      <div>
        <label class="block text-sm font-medium">Email</label>
        <input type="email" name="email" class="w-full border rounded-lg px-3 py-2" required>
      </div>
      <div>
        <label class="block text-sm font-medium">Password</label>
        <input type="password" name="password" class="w-full border rounded-lg px-3 py-2" ${id ? "" : "required"}>
      </div>
      <div>
        <label class="block text-sm font-medium">Role</label>
        <select name="role" class="w-full border rounded-lg px-3 py-2" required>
          <option value="admin">admin</option>
          <option value="super-admin">Super-user</option>
        </select>
      </div>
    </form>`;
}


  modalTitle.textContent = title;
  modalBody.innerHTML = formHtml;
  modalBackdrop.classList.remove("hidden");
  crudModal.classList.remove("hidden");

// 🔹 isi data lama kalau edit
  if (id) {
    try {
      const baseUrl = type === "pengguna" ? "/api/auth/users" : `/api/spk/${type}`;
      const res = await authFetch(`${baseUrl}/${id}`);
      if (res.ok) {
        const data = await res.json();
        const form = document.querySelector("#crud-modal form");
        Object.keys(data).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) field.value = data[key];
        });
      }
    } catch (err) {
      console.error(`Gagal memuat data ${type} ID ${id}:`, err);
    }
  }
}

export function closeModal() {
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.getElementById("crud-modal").classList.add("hidden");
}

// ---------- Kriteria CRUD ----------
export async function loadKriteria() {
  const tbody = document.getElementById("tbody-kriteria");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;

  try {
    const res = await authFetch("/api/spk/kriteria");
    const data = await res.json();
    data.sort((a, b) => a.id_kriteria - b.id_kriteria);
    console.log("Data kriteria (urut):", data.map((k) => k.id_kriteria));
    // data.forEach((k, i) => {
    //   console.log(`No.${i + 1} =>`, k.nama_kriteria);
    // });
    tbody.innerHTML = data
      .map(
        (k, i) => `
        <tr>
          <td class="px-4 py-2">${i + 1}</td>
          <td class="px-4 py-2">${k.nama_kriteria}</td>
          <td class="px-4 py-2">${k.bobot}</td>
          <td class="px-4 py-2">${k.tipe}</td>
          <td class="px-4 py-2 text-right space-x-2">
            <button onclick="openModal('kriteria', ${k.id_kriteria})"
            class="bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200 transition text-sm">
            <i class="fa-solid fa-pen mr-1"></i>Edit
            </button>
            <button onclick="kriteria(${k.id_kriteria})"
            class="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition text-sm">
            <i class="fa-solid fa-trash mr-1"></i>Hapus
            </button>
          </td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error("loadKriteria error:", err);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
  }
}

async function handleFormSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const form = e?.target || document.querySelector("#crud-modal form");
  const type = form.dataset.type;
  if (!type) {
  console.error("⚠️ Form belum punya data-type!");
  alert("Tipe form tidak diketahui, periksa atribut data-type di HTML.");
  return;
}
  const id = form.dataset.id || form.querySelector("[name='id']")?.value || null;
  const formData = Object.fromEntries(new FormData(form));




  try {
    let endpoint;

    // 💡 tentukan endpoint sesuai form/type
    if (type === "pengguna") {
      endpoint = "/api/auth/users";
    } else {
      endpoint = `/api/spk/${type}`;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${endpoint}/${id}` : endpoint;

    console.log(`${method} → ${url}`, formData);

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error(`status ${res.status}`);

    const result = await res.json();
    console.log(`✅ Data ${type} berhasil disimpan:`, result);

    alert(result.message || "Data berhasil disimpan!");
    closeModal(); // kalau kamu punya fungsi tutup modal
    loadTable(type); // reload tabel setelah simpan
  } catch (err) {
    console.error(`❌ handleFormSubmit error:`, err);
    alert(`Gagal menyimpan data ${type}. (${err.message})`);
  }
}


// export async function handleFormSubmit() {
//   const form = document.querySelector("#crud-modal form");
//   if (!form) return;

//   const formData = new FormData(form);
//   const id = formData.get("id");
//   const body = Object.fromEntries(formData.entries());

//   let endpoint = "";
//   if (form.id === "form-stok") endpoint = "/api/spk/stok";
//   else if (form.id === "form-kriteria") endpoint = "/api/spk/kriteria";
//   else if (form.id === "form-alternatif") endpoint = "/api/spk/alternatif";
//   else if (form.id === "form-pengguna") endpoint = "/api/auth/users";

//   try {
//     const res = await authFetch(`${endpoint}${id ? `/${id}` : ""}`, {
//       method: id ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     alert(data.message || "Data berhasil disimpan!");
//     closeModal();

//     if (form.id === "form-pengguna") loadPengguna();
//     else if (form.id === "form-stok") loadStok();
//     else if (form.id === "form-kriteria") loadKriteria();
//     else loadAlternatif();
//   } catch (err) {
//     console.error("handleFormSubmit error:", err);
//     alert("❌ Gagal menyimpan data!");
//   }
// }

export async function hapusKriteria(id) {
  if (!confirm("Yakin ingin menghapus kriteria ini?")) return;
  try {
    await authFetch(`/api/spk/kriteria/${id}`, { method: "DELETE" });
    loadKriteria();
  } catch (err) {
    console.error("hapusKriteria error:", err);
    alert("Gagal menghapus kriteria.");
  }
}

// ---------- Alternatif CRUD ----------
export async function loadAlternatif() {
  const tbody = document.getElementById("tbody-alternatif");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;
  try {
    const res = await authFetch("/api/spk/alternatif");
    const data = await res.json();
    tbody.innerHTML = data
    .sort((a, b) => a.id_alternatif - b.id_alternatif)
      .map(
        (a, i) => `
        <tr>
          <td class="px-4 py-2">${i + 1}</td>
          <td class="px-4 py-2">${a.nama_obat}</td>
          <td class="px-4 py-2 text-right space-x-2">
            <button onclick="openModal('alternatif', ${a.id_alternatif})"
            class="bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200 transition text-sm">
            <i class="fa-solid fa-pen mr-1"></i>Edit
            </button>
            <button onclick="hapusAlternatif(${a.id_alternatif})"
            class="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition text-sm">
            <i class="fa-solid fa-trash mr-1"></i>Hapus
            </button>
          </td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error("loadAlternatif error:", err);
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
  }
}

export async function hapusAlternatif(id) {
  if (!confirm("Yakin ingin menghapus alternatif ini?")) return;
  try {
    await authFetch(`/api/spk/alternatif/${id}`, { method: "DELETE" });
    loadAlternatif();
  } catch (err) {
    console.error("hapusAlternatif error:", err);
    alert("Gagal menghapus alternatif.");
  }
}

// ---------- Stok Obat CRUD ----------
export async function loadStok() {
  const tbody = document.getElementById("tbody-stok");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-gray-500">Memuat data stok obat...</td></tr>`;

  try {
    const res = await authFetch("/api/spk/stok");
    const data = await res.json();

    tbody.innerHTML = data
      .map(
        (s, i) => `
        <tr>
          <td class="px-4 py-2">${i + 1}</td>
          <td class="px-4 py-2">${s.nama_obat || "-"}</td>
          <td class="px-4 py-2">${s.golongan || "-"}</td>
          <td class="px-4 py-2">${s.nama_dagang || "-"}</td>
          <td class="px-4 py-2">${s.produsen || "-"}</td>
          <td class="px-4 py-2">${s.jumlah_stok ?? 0}</td>
          <td class="px-4 py-2">${new Date(s.tanggal_update).toLocaleString()}</td>
          <td class="px-4 py-2 text-right space-x-2">
            <button onclick="openModal('stok', ${s.id})"
            class="bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200 transition text-sm">
             <i class="fa-solid fa-pen mr-1"></i>Edit
             </button>
             <button onclick="hapusStok(${s.id})"
             class="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition text-sm">
             <i class="fa-solid fa-trash mr-1"></i>Hapus
             </button>
          </td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error("loadStok error:", err);
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-red-500 py-6">Gagal memuat data stok obat.</td></tr>`;
  }
}
export async function hapusStok(id) {
  if (!confirm("Yakin ingin menghapus stok obat ini?")) return;
  try {
    await authFetch(`/api/spk/stok/${id}`, { method: "DELETE" });
    loadStok();
  } catch (err) {
    console.error("hapusStok error:", err);
    alert("Gagal menghapus stok obat.");
  }
}

// attach ke window supaya bisa dipanggil global
window.loadStok = window.loadStok || loadStok;
window.hapusStok = window.hapusStok || hapusStok;


export async function loadPengguna() {
  const tbody = document.getElementById("tbody-pengguna");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Memuat data pengguna...</td></tr>`;

  try {
    const res = await authFetch("/api/auth/users");
    const data = await res.json();

    tbody.innerHTML = data.map(
      (u, i) => `
        <tr>
          <td class="px-4 py-2">${i + 1}</td>
          <td class="px-4 py-2">${u.username}</td>
          <td class="px-4 py-2">${u.email}</td>
          <td class="px-4 py-2 capitalize">${u.role}</td>
          <td class="px-4 py-2 text-right space-x-2">
            <button onclick="openModal('pengguna', ${u.id})"
              class="bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200 transition text-sm">
              <i class="fa-solid fa-pen mr-1"></i>Edit
            </button>
            <button onclick="hapusPengguna(${u.id})"
              class="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition text-sm">
              <i class="fa-solid fa-trash mr-1"></i>Hapus
            </button>
          </td>
        </tr>`
    ).join("");
  } catch (err) {
    console.error("loadPengguna error:", err);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-6">Gagal memuat data pengguna.</td></tr>`;
  }
}

export async function hapusPengguna(id) {
  if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
  try {
    await authFetch(`/api/auth/users/${id}`, { method: "DELETE" });
    loadPengguna();
  } catch (err) {
    console.error("hapusPengguna error:", err);
    alert("Gagal menghapus pengguna.");
  }
}



// ---------- Input nilai (placeholder) ----------
//import { authFetch } from "./utils.js";

export async function renderInputNilai() {
  const container = document.getElementById("nilai-container");
  if (!container) return;

  container.innerHTML = `<p class="text-gray-500 text-center py-4">Memuat tabel nilai...</p>`;

  try {
    // Ambil data alternatif dan kriteria
    const [altRes, kriRes] = await Promise.all([
      authFetch("/api/spk/alternatif"),
      authFetch("/api/spk/kriteria")
    ]);
    const [alternatif, kriteria] = await Promise.all([
      altRes.json(),
      kriRes.json()
    ]);

    if (!alternatif.length || !kriteria.length) {
      container.innerHTML = `<p class="text-red-500 text-center py-4">Data alternatif atau kriteria kosong!</p>`;
      return;
    }

    // Ambil data nilai
    const nilaiRes = await authFetch("/api/spk/nilai");
    const nilaiList = await nilaiRes.json();

    // Buat peta nilai {id_alternatif: {id_kriteria: nilai}}
    const nilaiMap = {};
    nilaiList.forEach(n => {
      if (!nilaiMap[n.id_alternatif]) nilaiMap[n.id_alternatif] = {};
      nilaiMap[n.id_alternatif][n.id_kriteria] = n.nilai;
    });

    // Buat tabel interaktif
    const headerRow = kriteria.map(k => `<th class="px-3 py-2 border">${k.nama_kriteria}</th>`).join("");
    const bodyRows = alternatif.map(a => {
      const nilaiCells = kriteria.map(k => {
        const v = nilaiMap[a.id_alternatif]?.[k.id_kriteria] ?? "";
        return `<td class="px-3 py-2 border">
          <select class="w-full border rounded px-2 py-1 nilai-input" data-alt="${a.id_alternatif}" data-kri="${k.id_kriteria}">
          <option value="">-</option>
          <option value="1" ${v == 1 ? "selected" : ""}>1 - Sangat Buruk</option>
          <option value="2" ${v == 2 ? "selected" : ""}>2 - Buruk</option>
          <option value="3" ${v == 3 ? "selected" : ""}>3 - Cukup</option>
          <option value="4" ${v == 4 ? "selected" : ""}>4 - Baik</option>
          <option value="5" ${v == 5 ? "selected" : ""}>5 - Sangat Baik</option>
          </select>
        </td>`;
      }).join("");

      return `<tr>
        <td class="px-3 py-2 border font-medium">${a.nama_obat}</td>
        ${nilaiCells}
      </tr>`;
    }).join("");

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 text-sm">
          <thead class="bg-purple-100">
            <tr>
              <th class="px-3 py-2 border">Alternatif</th>
              ${headerRow}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <div class="text-right mt-4">
        <button id="simpan-nilai" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Simpan Nilai
        </button>
      </div>
    `;

    // Simpan data ke server
    document.getElementById("simpan-nilai").addEventListener("click", async () => {
      const inputs = document.querySelectorAll(".nilai-input");
      const payload = [];

      inputs.forEach(inp => {
        const nilai = parseFloat(inp.value);
        if (isNaN(nilai)) return;
        payload.push({
          id_alternatif: inp.dataset.alt,
          id_kriteria: inp.dataset.kri,
          nilai
        });
      });

      if (payload.length === 0) {
        alert("Tidak ada nilai yang diisi!");
        return;
      }

      try {
        const res = await authFetch("/api/spk/nilai/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        alert(data.message || "✅ Nilai berhasil disimpan!");
      } catch (err) {
        console.error("Simpan nilai gagal:", err);
        alert("❌ Gagal menyimpan nilai!");
      }
    });

  } catch (err) {
    console.error("renderInputNilai error:", err);
    container.innerHTML = `<p class="text-red-500 text-center py-4">Gagal memuat form nilai.</p>`;
  }
}

// backward compatibility (attach ke window)
window.loadPengguna = window.loadPengguna || loadPengguna;
window.hapusPengguna = window.hapusPengguna || hapusPengguna;
window.openModal = window.openModal || openModal;
window.closeModal = window.closeModal || closeModal;
window.loadKriteria = window.loadKriteria || loadKriteria;
window.loadAlternatif = window.loadAlternatif || loadAlternatif;
window.renderInputNilai = window.renderInputNilai || renderInputNilai;
window.handleFormSubmit = window.handleFormSubmit || handleFormSubmit;
window.hapusKriteria = window.hapusKriteria || hapusKriteria;
window.hapusAlternatif = window.hapusAlternatif || hapusAlternatif;
