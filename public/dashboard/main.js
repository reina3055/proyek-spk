document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const pageContents = document.querySelectorAll('.page-content');
  const pageTitle = document.getElementById('page-title');
  
  const modalBackdrop = document.getElementById('modal-backdrop');
  const crudModal = document.getElementById('crud-modal');
  const modalContent = document.getElementById('modal-content');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  const loadingOverlay = document.getElementById('loading-overlay');
  
  const hitungUlangBtn = document.getElementById('hitung-ulang');
  const cetakLaporanBtn = document.getElementById('cetak-laporan');
  const tanggalCetakEl = document.getElementById('tanggal-cetak');

  // --- Sidebar Toggle (Mobile) ---
  sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
  });

  // --- Navigasi Halaman (SPA-like) ---
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const pageId = link.getAttribute('data-page');
          
          // Sembunyikan semua halaman
          pageContents.forEach(page => {
              page.classList.add('hidden');
          });
          
          // Tampilkan halaman target
          document.getElementById(`page-${pageId}`).classList.remove('hidden');
          
          // Update judul halaman
          pageTitle.textContent = link.textContent.trim();
          
          // Update link aktif
          navLinks.forEach(nav => nav.classList.remove('active'));
          link.classList.add('active');
          
          // Tutup sidebar di mobile setelah klik
          if (window.innerWidth < 768) {
              sidebar.classList.add('-translate-x-full');
          }
      });
  });

  // --- Logika Loading Spinner ---
  const showLoader = () => loadingOverlay.classList.remove('hidden');
  const hideLoader = () => loadingOverlay.classList.add('hidden');

  // --- Logika Modal (Global) ---
  window.openModal = (type, id = null) => {
      let title = '';
      let formHtml = '';

      if (type === 'kriteria') {
          title = id ? 'Edit Kriteria' : 'Tambah Kriteria';
          // // fetch(`/api/spk/kriteria/${id}`) untuk pre-fill data
          formHtml = `
              <form id="form-kriteria" class="space-y-4">
                  <input type="hidden" name="id" value="${id || ''}">
                  <div>
                      <label for="kode" class="block text-sm font-medium text-gray-700">Kode Kriteria</label>
                      <input type="text" name="kode" id="kode" value="${id ? `C${id}` : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
                  <div>
                      <label for="nama" class="block text-sm font-medium text-gray-700">Nama Kriteria</label>
                      <input type="text" name="nama" id="nama" value="${id ? (id === 1 ? 'Efektivitas' : 'Efek Samping') : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
                  <div>
                      <label for="bobot" class="block text-sm font-medium text-gray-700">Bobot</label>
                      <input type="number" step="0.01" name="bobot" id="bobot" value="${id ? '0.25' : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
                  <div>
                      <label for="tipe" class="block text-sm font-medium text-gray-700">Tipe</label>
                      <select name="tipe" id="tipe" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                          <option value="benefit" ${id === 1 ? 'selected' : ''}>Benefit</option>
                          <option value="cost" ${id === 2 ? 'selected' : ''}>Cost</option>
                      </select>
                  </div>
              </form>
          `;
      } else if (type === 'alternatif') {
          title = id ? 'Edit Obat' : 'Tambah Obat';
          formHtml = `
              <form id="form-alternatif" class="space-y-4">
                  <div>
                      <label for="nama_obat" class="block text-sm font-medium text-gray-700">Nama Obat</label>
                      <input type="text" name="nama_obat" id="nama_obat" value="${id ? 'Amlodipine' : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
                  <div>
                      <label for="produsen" class="block text-sm font-medium text-gray-700">Produsen</label>
                      <input type="text" name="produsen" id="produsen" value="${id ? 'Pfizer' : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
              </form>
          `;
      } else if (type === 'admin') {
           title = id ? 'Edit Admin' : 'Tambah Admin';
          formHtml = `
              <form id="form-admin" class="space-y-4">
                  <div>
                      <label for="nama_admin" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <input type="text" name="nama_admin" id="nama_admin" value="${id ? 'Admin Utama' : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
                  <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="email" id="email" value="${id ? 'admin.utama@spk.com' : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
                  <div>
                      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                      <input type="password" name="password" id="password" placeholder="${id ? 'Kosongkan jika tidak diubah' : ''}" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                  </div>
              </form>
          `;
      }
      
      modalTitle.textContent = title;
      modalBody.innerHTML = formHtml;
      
      modalBackdrop.classList.remove('hidden');
      crudModal.classList.remove('hidden');
      setTimeout(() => {
          modalContent.classList.remove('opacity-0', 'translate-y-4');
          modalContent.classList.add('opacity-100', 'translate-y-0');
      }, 50);
  };

  window.closeModal = () => {
      modalContent.classList.add('opacity-0', 'translate-y-4');
      modalContent.classList.remove('opacity-100', 'translate-y-0');
      setTimeout(() => {
          modalBackdrop.classList.add('hidden');
          crudModal.classList.add('hidden');
      }, 200);
  };
  
  // --- Dummy Form Submit ---
  window.handleFormSubmit = () => {
      // const formData = new FormData(document.querySelector('#crud-modal form'));
      // for(let [key, value] of formData.entries()) {
      //     console.log(key, value);
      // }
      // // fetch('/api/spk/save', { method: 'POST', body: formData })
      
      console.log('Form disubmit (dummy)');
      showLoader();
      setTimeout(() => {
          hideLoader();
          closeModal();
      }, 1000);
  };
  
  // --- Logika Tombol Aksi ---
  
  // Hitung Ulang
  hitungUlangBtn.addEventListener('click', () => {
      showLoader();
      // // fetch('/api/spk/hitung', { method: 'POST' })
      // .then(res => res.json())
      // .then(data => {
      //     // Update tabel dan chart di sini
      //     hideLoader();
      // });
      
      // Simulasi
      setTimeout(() => {
          hideLoader();
          alert('Perhitungan SPK Weighted Product Selesai!');
      }, 2000);
  });
  
  // Cetak Laporan
  if (tanggalCetakEl) {
      tanggalCetakEl.textContent = new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
      });
  }
  cetakLaporanBtn.addEventListener('click', () => {
      window.print();
  });

  // --- Inisialisasi Chart.js (Bonus) ---
  const ctx = document.getElementById('hasilChart').getContext('2d');
  const hasilChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Captopril', 'Amlodipine'],
          datasets: [{
              label: 'Nilai Vektor (V)',
              data: [0.5120, 0.4880], // Data dummy
              backgroundColor: [
                  '#9333ea', // purple-600
                  '#c084fc', // purple-400
              ],
              borderColor: [
                  '#7e22ce', // purple-700
                  '#a855f7', // purple-500
              ],
              borderWidth: 1,
              borderRadius: 6,
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y', // Membuat chart batang horizontal
          plugins: {
              legend: {
                  display: false
              }
          },
          scales: {
              x: {
                  beginAtZero: true
              }
          }
      }
  });

});