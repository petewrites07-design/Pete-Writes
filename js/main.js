let currentCategory = '';
let currentSubCategory = '';
let currentStoryTitle = '';

function getStoryKey(titleName) {
    if (window.storyDatabase) {
        for (let key in window.storyDatabase) {
            if (window.storyDatabase[key].title === titleName) {
                return key;
            }
        }
    }
    if (titleName.includes("Title 1")) return "petesarapstories_byparts1";
    if (titleName.includes("Title 2")) return "petesarapstories_byparts2";
    if (titleName.includes("Title 3")) return "petesarapstories_byparts3";
    return "petesarapstories_byparts1";
}

function navigateTo(pageId) {
    document.querySelectorAll('.page-view').forEach(page => page.classList.add('page-hidden'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.remove('page-hidden');
}

function setThemeColor(colorName) {
    document.documentElement.setAttribute('data-theme', colorName);
}

function selectCategory(catId) {
    currentCategory = catId;
    if (catId === 'petesarap') {
        document.getElementById('warningModal').classList.remove('hidden');
    } else {
        proceedToCategory();
    }
}

function proceedToCategory() {
    closeModal('warningModal');
    navigateTo('categoryDisplayPage');

    const area = document.getElementById('categoryContentArea');

    if (currentCategory === 'petesarap') {
        area.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="navigateTo('storiesPage')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-theme hover:text-white transition-all text-xs font-bold text-theme-text cursor-pointer shadow-sm">
                    ← Back to Categories
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">🍷 petesarap's random stories (18+)</span>
            </div>
            <div class="space-y-4">
                <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white pb-1">Choose Format:</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onclick="showSubCategory('by_parts')" class="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-theme bg-orange-50/20 dark:bg-slate-950 transition-all cursor-pointer text-left">
                        <div class="text-xl mb-1">📚</div>
                        <h4 class="font-bold text-sm text-theme-text">By Parts (Series)</h4>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Multi-chapter stories split into parts.</p>
                    </button>
                    <button onclick="showSubCategory('by_oneshot')" class="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-theme bg-indigo-50/20 dark:bg-slate-950 transition-all cursor-pointer text-left">
                        <div class="text-xl mb-1">⚡</div>
                        <h4 class="font-bold text-sm text-indigo-600 dark:text-indigo-400">By One-Shot</h4>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Complete standalone stories.</p>
                    </button>
                </div>
            </div>
        `;
    } else if (currentCategory === 'petewrites_random') {
        let html = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="navigateTo('storiesPage')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-theme hover:text-white transition-all text-xs font-bold text-theme-text cursor-pointer shadow-sm">
                    ← Back to Categories
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">✍️ petewrites' random stories</span>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Select Story (50 One-Shots Available):</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto p-1">
        `;
        for (let i = 1; i <= 50; i++) {
            html += `<button onclick="openOneShotReader('Random Story ${i}', 'Buong kwento at ending ng Random Story ${i} na natapos na basahin ng reader...')" class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-theme hover:text-white transition-all text-center font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm">Story ${i}</button>`;
        }
        html += `</div>`;
        area.innerHTML = html;
    } else if (currentCategory === 'petewrites_novel') {
        area.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="navigateTo('storiesPage')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-theme hover:text-white transition-all text-xs font-bold text-theme-text cursor-pointer shadow-sm">
                    ← Back to Categories
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">📖 petewrites' novel stories</span>
            </div>
            <div class="flex flex-col justify-center items-center py-8 text-center space-y-3">
                <div class="text-3xl">📖</div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">petewrites' novel stories</h3>
                <p class="text-xs text-slate-600 dark:text-slate-400 max-w-sm">You can read all my novel series directly on my official Wattpad account!</p>
                <a href="https://wattpad.com" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer">
                    <span>Open Wattpad Account</span><span>↗</span>
                </a>
            </div>
        `;
    }
}

function showSubCategory(subCat) {
    currentSubCategory = subCat;
    const area = document.getElementById('categoryContentArea');

    if (subCat === 'by_parts') {
        let html = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="proceedToCategory()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-theme hover:text-white transition-all text-xs font-bold text-theme-text cursor-pointer shadow-sm">
                    ← Back to Formats
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">🍷 petesarap's series</span>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Select Story Title:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        `;
        
        // Awtomatikong kukunin lahat ng nakarehistro sa window.storyDatabase
        let seriesKeys = [];
        if (window.storyDatabase) {
            seriesKeys = Object.keys(window.storyDatabase);
        } else {
            seriesKeys = ["petesarapstories_byparts1", "petesarapstories_byparts2", "petesarapstories_byparts3"];
        }

        seriesKeys.forEach((sKey) => {
            const sData = window.storyDatabase[sKey];
            const storyTitle = sData ? sData.title : "Series";

            html += `<button onclick="showPartsList(\`${storyTitle}\`)" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-theme bg-white dark:bg-slate-900 transition-all text-left cursor-pointer shadow-sm">
                <div class="font-bold text-sm text-theme-text">📖 ${storyTitle}</div>
            </button>`;
        });

        html += `</div>`;
        area.innerHTML = html;
    } else {
        let html = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="proceedToCategory()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-theme hover:text-white transition-all text-xs font-bold text-theme-text cursor-pointer shadow-sm">
                    ← Back to Formats
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">petesarap's one-shots</span>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Select One-Shot Title:</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto p-1">
        `;
        for (let i = 1; i <= 20; i++) {
            html += `<button onclick="openOneShotReader('Petesarap One-Shot ${i}', 'Buong kwento at ending ng Petesarap One-Shot ${i} na natapos na basahin ng reader...')" class="p-2.5 rounded-lg bg-red-50 dark:bg-slate-800 hover:bg-red-800 hover:text-white transition-all text-center font-bold text-xs border border-red-200 dark:border-slate-700 cursor-pointer">One-Shot ${i}</button>`;
        }
        html += `</div>`;
        area.innerHTML = html;
    }
}

function showPartsList(titleName) {
    currentStoryTitle = titleName;
    navigateTo('categoryDisplayPage');
    const area = document.getElementById('categoryContentArea');

    const sKey = getStoryKey(titleName);
    const storyData = window.storyDatabase && window.storyDatabase[sKey];
    const totalParts = (storyData && storyData.parts) ? Object.keys(storyData.parts).length : 3;

    let html = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <button onclick="showSubCategory('by_parts')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-theme hover:text-white transition-all text-xs font-bold text-theme-text cursor-pointer shadow-sm">
                ← Back to Titles
            </button>
            <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right truncate max-w-[220px]">${titleName}</span>
        </div>
        <h3 class="text-xs sm:text-sm font-bold text-theme-text mb-3">Select Part (1 to ${totalParts}):</h3>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
    `;
    
    for (let part = 1; part <= totalParts; part++) {
        html += `<button onclick="openPartReader(${part}, \`${titleName}\`)" class="py-3 px-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-theme hover:text-white transition-all font-bold text-xs flex flex-col justify-center items-center cursor-pointer shadow-sm">Part ${part}</button>`;
    }
    html += `</div>`;
    area.innerHTML = html;
}

function openOneShotReader(title, content) {
    currentStoryTitle = title;
    document.getElementById('readerTitle').innerText = title;
    document.getElementById('readerBreadcrumb').innerText = currentCategory + ' > ' + title;
    
    const readerHtml = `
        <div class="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-sans select-none mb-8">
            ${content}
        </div>
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6 text-center space-y-4">
            <p class="text-sm font-bold text-theme">✨ You've reached the end ✨</p>
            <div>
                <button onclick="navigateTo('categoryDisplayPage')" class="px-5 py-2.5 rounded-xl bg-theme text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md">
                    ← Back to List
                </button>
            </div>
        </div>
    `;
    document.getElementById('readerContent').innerHTML = readerHtml;
    navigateTo('readerPage');
}

function openPartReader(partNum, titleName) {
    currentStoryTitle = titleName;
    const sKey = getStoryKey(titleName);
    const storyData = window.storyDatabase && window.storyDatabase[sKey];
    const totalParts = (storyData && storyData.parts) ? Object.keys(storyData.parts).length : 3;

    let content = (storyData && storyData.parts && storyData.parts[partNum]) ? storyData.parts[partNum] : `Story text for ${titleName}, Part ${partNum}...`;

    document.getElementById('readerTitle').innerText = `${titleName} - Part ${partNum}`;
    document.getElementById('readerBreadcrumb').innerText = `${currentCategory} > Part ${partNum}`;

    let navigationHtml = '';
    if (partNum < totalParts) {
        navigationHtml = `
            <div class="flex justify-end pt-6">
                <button onclick="openPartReader(${partNum + 1}, \`${titleName}\`)" class="px-5 py-2.5 rounded-xl bg-theme text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md">
                    Next Part →
                </button>
            </div>
        `;
    } else {
        navigationHtml = `
            <div class="border-t border-slate-200 dark:border-slate-800 pt-6 text-center space-y-4">
                <p class="text-sm font-bold text-theme">✨ You've reached the end of this series ✨</p>
                <div>
                    <button onclick="showPartsList(\`${titleName}\`)" class="px-5 py-2.5 rounded-xl bg-theme text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md">
                        ← Back to Parts List
                    </button>
                </div>
            </div>
        `;
    }

    const readerHtml = `
        <div class="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-sans select-none mb-6">
            ${content}
        </div>
        ${navigationHtml}
    `;
    document.getElementById('readerContent').innerHTML = readerHtml;
    navigateTo('readerPage');
}

function goBackFromReader() {
    navigateTo('categoryDisplayPage');
}

function setDeviceView(mode) {
    const wrapper = document.getElementById('deviceWrapper');
    const container = document.getElementById('screenContainer');
    const statusBar = document.getElementById('phoneStatusBar');
    const btnDesktop = document.getElementById('btnDesktop');
    const btnMobile = document.getElementById('btnMobile');

    if (mode === 'mobile') {
        wrapper.className = "w-full flex-grow flex flex-col items-center justify-center p-3";
        container.className = "w-full max-w-[380px] h-[750px] flex flex-col relative transition-all duration-300 rounded-[32px] border-[8px] border-slate-900 shadow-2xl overflow-y-auto bg-white dark:bg-slate-900";
        if(statusBar) statusBar.classList.remove('hidden');
        if(btnMobile) btnMobile.className = "px-3 py-1.5 rounded-full bg-theme text-white transition-all cursor-pointer";
        if(btnDesktop) btnDesktop.className = "px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 transition-all cursor-pointer";
    } else {
        wrapper.className = "w-full flex-grow flex flex-col items-center justify-start transition-all duration-300 py-0 md:py-4";
        container.className = "w-full flex-grow flex flex-col relative transition-all duration-300";
        if(statusBar) statusBar.classList.add('hidden');
        if(btnDesktop) btnDesktop.className = "px-3 py-1.5 rounded-full bg-theme text-white transition-all cursor-pointer";
        if(btnMobile) btnMobile.className = "px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 transition-all cursor-pointer";
    }
}

function openAboutModal() { document.getElementById('aboutModal').classList.remove('hidden'); }
function openLinksModal() { document.getElementById('linksModal').classList.remove('hidden'); }
function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.innerText = '🌙';
        text.innerText = 'Dark Mode';
    } else {
        html.classList.add('dark');
        icon.innerText = '☀️';
        text.innerText = 'Light Mode';
    }
}

// Anti-copy shortcut blocker
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) {
        e.preventDefault();
        alert("Protected Content: Copying is disabled.");
    }
});