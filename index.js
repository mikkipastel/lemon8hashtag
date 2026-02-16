// 1. ฟังก์ชัน Render หน้าเว็บ
function renderApp(data) {
    document.getElementById('last-updated').textContent = data.last_updated;
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear loading

    data.categories.forEach(cat => {
        // สร้าง Card สำหรับแต่ละหมวดหมู่
        const card = document.createElement('div');
        card.className = 'category-card';

        // เตรียม String ของ Hashtag ทั้งหมดในหมวดนี้
        const allTags = cat.hashtags.join(' ');

        // สร้าง HTML ภายใน Card
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${cat.name}</span>
                <button class="btn-copy-all" onclick="copyText('${allTags}')">
                    Copy All (${cat.hashtags.length})
                </button>
            </div>
            <div class="tags-container">
                ${cat.hashtags.map(tag => `
                    <span class="tag-chip" onclick="copyText('${tag}')">
                        ${tag}
                    </span>
                `).join('')}
            </div>
        `;
        app.appendChild(card);
    });
}

// 2. ฟังก์ชัน Copy
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: "${text}"`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// ฟังก์ชันแสดง Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// 3. Initialize (โหลดจาก hashtag.json)
document.addEventListener('DOMContentLoaded', () => {
    fetch('hashtag.json')
        .then(res => res.json())
        .then(data => renderApp(data))
        .catch(err => {
            console.error('Failed to load hashtag.json:', err);
            document.getElementById('app').innerHTML = '<p>Error loading hashtags</p>';
        });
});
