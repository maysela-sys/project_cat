document.addEventListener('DOMContentLoaded', () => {

    // 1. DUMMY DATA JSON (STORES)
    const storesData = [
        {
            id: 'TOKO-001',
            name: 'Toko Rico Jaya',
            email: 'ricojaya@gmail.com',
            phone: '081234567890',
            address: 'Jl. Slamet Riyadi No. 45, Surakarta',
            status: 'Active',
            proofFile: 'Bukti_Transfer_Rico.png',
            type: 'data'
        },
        {
            id: 'TOKO-002',
            name: 'Toko Ahmad Jaya',
            email: 'ahmadjaya@gmail.com',
            phone: '089876543210',
            address: 'Jl. Veteran No. 88, Sukoharjo',
            status: 'Pending',
            proofFile: 'Bukti_Transfer_Ahmad.png',
            type: 'data'
        },
        {
            id: 'TOKO-003',
            name: 'Toko Sumber Warna',
            email: 'sumberwarna@gmail.com',
            phone: '081322334455',
            address: 'Jl. Ir. Juanda No. 12, Jebres',
            status: 'Pending',
            proofFile: 'Bukti_Transfer_Sumber.png',
            type: 'pembayaran'
        }
    ];

    let currentTab = 'data'; // 'data' atau 'pembayaran'

    // DOM Elements
    const verifTableBody = document.getElementById('verif-table-body');
    const tabButtons = document.querySelectorAll('.verif-tab-btn');
    const verifModal = document.getElementById('verif-modal');

    // Modal Form Elements
    const modalStoreId = document.getElementById('modal-store-id');
    const modalStoreName = document.getElementById('modal-store-name');
    const modalEmail = document.getElementById('modal-email');
    const modalPhone = document.getElementById('modal-phone');
    const modalAddress = document.getElementById('modal-address');
    const modalFileName = document.getElementById('modal-file-name');

    const btnCekBukti = document.getElementById('btn-cek-bukti');
    const btnTolak = document.getElementById('btn-tolak');
    const btnVerifikasi = document.getElementById('btn-verifikasi');

    // 2. RENDER TABEL STORES
    function renderTable() {
        verifTableBody.innerHTML = '';

        const filteredStores = storesData.filter(s => currentTab === 'data' ? true : s.type === 'pembayaran' || s.status === 'Pending');

        filteredStores.forEach(store => {
            const tr = document.createElement('tr');

            const isPending = store.status.toLowerCase() === 'pending';
            const statusBadge = `<span class="status-badge ${isPending ? 'pending' : 'active'}">${store.status}</span>`;
            const actionButton = isPending 
                ? `<button class="btn-action-verif" onclick="openVerifModal('${store.id}')">Verifikasi</button>` 
                : '';

            tr.innerHTML = `
                <td>${store.id}</td>
                <td>${store.name}</td>
                <td>${statusBadge}</td>
                <td>${actionButton}</td>
            `;

            verifTableBody.appendChild(tr);
        });
    }

    // 3. TAB SWITCHER (Verifikasi Data / Verifikasi Pembayaran)
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.getAttribute('data-tab');
            renderTable();
        });
    });

    // 4. BUKA POPUP MODAL VERIFIKASI
    window.openVerifModal = function(storeId) {
        const store = storesData.find(s => s.id === storeId);
        if (!store) return;

        modalStoreId.value = store.id;
        modalStoreName.value = store.name;
        modalEmail.value = store.email;
        modalPhone.value = store.phone;
        modalAddress.value = store.address;
        modalFileName.value = store.proofFile;

        verifModal.classList.remove('hidden');
    };

    // 5. TOMBOL CEK BUKTI TRANSFER
    btnCekBukti.addEventListener('click', () => {
        alert(`Membuka gambar bukti transfer: ${modalFileName.value}`);
    });

    // 6. AKSI VERIFIKASI / TOLAK
    btnVerifikasi.addEventListener('click', () => {
        const storeId = modalStoreId.value;
        const store = storesData.find(s => s.id === storeId);
        if (store) {
            store.status = 'Active';
            alert(`Toko "${store.name}" berhasil diverifikasi dan diaktifkan!`);
            verifModal.classList.add('hidden');
            renderTable();
        }
    });

    btnTolak.addEventListener('click', () => {
        const storeId = modalStoreId.value;
        const store = storesData.find(s => s.id === storeId);
        if (store) {
            alert(`Permohonan verifikasi toko "${store.name}" ditolak.`);
            verifModal.classList.add('hidden');
        }
    });

    // Tutup Modal jika diklik di luar area kartu modal
    verifModal.addEventListener('click', (e) => {
        if (e.target === verifModal) {
            verifModal.classList.add('hidden');
        }
    });

    // Initial Render
    renderTable();
});