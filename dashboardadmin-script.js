document.addEventListener('DOMContentLoaded', () => {

    // 1. SIMULASI DATA JSON (DUMMY DATA ADMIN)
    const adminDummyData = {
        totalToko: 124,
        totalUser: 1450,
        pendingVerifikasi: 8,
        pendingList: [
            { id: 1, name: 'Toko Cat Sejahtera', owner: 'Budi Santoso', location: 'Solo' },
            { id: 'id-2', name: 'Depo Warna Abadi', owner: 'Siti Rahma', location: 'Semarang' }
        ]
    };

    // Binding Data ke Elemen HTML Dashboard
    document.getElementById('val-total-toko').textContent = adminDummyData.totalToko;
    document.getElementById('val-total-user').textContent = adminDummyData.totalUser;
    document.getElementById('val-pending-verif').textContent = adminDummyData.pendingVerifikasi;

    // 2. NAVIGASI HALAMAN ADMIN (Dashboard, Verifikasi, Kelola)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');

            // Atur status active menu
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            // Atur status active section
            sections.forEach(sec => sec.classList.remove('active'));
            const targetSection = document.getElementById(`section-${targetPage}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // 3. RENDER DATA PENDING VERIFIKASI
    const verifListContainer = document.getElementById('verif-list');
    if (verifListContainer) {
        adminDummyData.pendingList.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = "background:white; padding:12px 16px; margin-bottom:10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0;";
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong> (${item.location})<br>
                    <small style="color:#64748b;">Pemilik: ${item.owner}</small>
                </div>
                <button style="background:#51abf6; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600; font-size:12px;">Review</button>
            `;
            verifListContainer.appendChild(div);
        });
    }

});