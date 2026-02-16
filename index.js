// State สำหรับเก็บ selected hashtags
const selectedTags = {};

// ฟังก์ชันนับจำนวน hashtags ที่เลือก
function countSelected(catIndex) {
    return Object.keys(selectedTags[catIndex] || {}).filter(idx => selectedTags[catIndex][idx]).length;
}

// ฟังก์ชันอัปเดต button text
function updateButtonText(catIndex) {
    const count = countSelected(catIndex);
    const button = document.querySelector(`button[data-cat="${catIndex}"]`);
    if (button) {
        button.textContent = `Copy Selected (${count})`;
    }
}

// 1. ฟังก์ชัน Render หน้าเว็บ
function renderApp(data) {
    document.getElementById('last-updated').textContent = data.last_updated;
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear loading

    data.categories.forEach((cat, catIndex) => {
        // สร้าง Card สำหรับแต่ละหมวดหมู่
        const card = document.createElement('div');
        card.className = 'category-card';

        // สร้าง HTML ภายใน Card
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${cat.name}</span>
                <button class="btn-copy-all" data-cat="${catIndex}" onclick="copySelected(${catIndex})">
                    Copy Selected (0)
                </button>
            </div>
            <div class="tags-container">
                ${cat.hashtags.map((tag, tagIndex) => `
                    <label class="tag-chip-label">
                        <input type="checkbox" class="tag-checkbox" data-cat="${catIndex}" data-tag="${tagIndex}" onchange="toggleSelect(${catIndex}, ${tagIndex}, this.checked)">
                        <span class="tag-chip">${tag}</span>
                    </label>
                `).join('')}
            </div>
        `;
        app.appendChild(card);

        // Initialize selected tags for this category
        if (!selectedTags[catIndex]) {
            selectedTags[catIndex] = {};
        }
    });
}

// 2. ฟังก์ชัน Toggle Select
function toggleSelect(catIndex, tagIndex, isChecked) {
    if (!selectedTags[catIndex]) {
        selectedTags[catIndex] = {};
    }
    selectedTags[catIndex][tagIndex] = isChecked;
    updateButtonText(catIndex);
}

// 3. ฟังก์ชัน Copy Selected
function copySelected(catIndex) {
    const selected = Object.keys(selectedTags[catIndex] || {})
        .filter(idx => selectedTags[catIndex][idx]);
    
    if (selected.length === 0) {
        showToast('Please select hashtags first');
        return;
    }

    // หา data ของ hashtags ที่เลือก
    fetch('hashtag.json')
        .then(res => res.json())
        .then(data => {
            const selectedHashtags = selected.map(idx => data.categories[catIndex].hashtags[idx]).join(' ');
            navigator.clipboard.writeText(selectedHashtags).then(() => {
                showToast(`Copied ${selected.length} copies`);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
}

// ฟังก์ชันแสดง Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// 4. Initialize (โหลดจาก hashtag.json)
document.addEventListener('DOMContentLoaded', () => {
    fetch('hashtag.json')
        .then(res => res.json())
        .then(data => renderApp(data))
        .catch(err => {
            console.error('Failed to load hashtag.json:', err);
            document.getElementById('app').innerHTML = '<p>Error loading hashtags</p>';
        });
});
