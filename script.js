const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw1sfUrVGpKrkv17bMzcMpq_0xxU9RsKrEsq23ciXFFtEwiNEfcNHJvh-13VbbuqVQt/exec";

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    if (pageId === 'titipan' || pageId === 'kehilangan') {
        document.getElementById('data-section').style.display = 'block';
        fetchData(pageId === 'titipan' ? 'Titipan' : 'Kehilangan');
    } else {
        document.getElementById(pageId).style.display = 'block';
    }
}

async function fetchData(type) {
    const tbody = document.getElementById('tableBody');
    const thead = document.getElementById('tableHeader');
    tbody.innerHTML = "<tr><td colspan='5'>Memuat data...</td></tr>";
    
    try {
        const response = await fetch(`${WEB_APP_URL}?page=${type}`);
        const data = await response.json();
        
        // Setup Header
        thead.innerHTML = Object.keys(data[0]).map(key => `<th>${key}</th>`).join('');
        
        // Setup Body
        tbody.innerHTML = data.map(row => `
            <tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = "Gagal memuat data.";
    }
}

document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const payload = {
        target: document.getElementById('kategori').value,
        data: [
            document.getElementById('namaBarang').value,
            document.getElementById('detail').value,
            new Date().toLocaleDateString('id-ID'),
            document.getElementById('namaUser').value,
            document.getElementById('lokasi').value
        ]
    };

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        alert("Data berhasil dikirim!");
        e.target.reset();
        showPage('beranda');
    } catch (err) {
        alert("Terjadi kesalahan.");
    } finally {
        btn.innerText = "Kirim Laporan";
        btn.disabled = false;
    }
});
