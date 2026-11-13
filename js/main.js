let currentCategory = '';
let currentSubCategory = '';
let currentStoryKey = '';
let currentReaderMode = '';
let activeSaveId = '';
let currentFontSize = 16;
let pendingResumeData = null;
let currentLang = 'en';
let clickItInterval = null;

const STORAGE_KEY = 'petewrites_reading_progress';
const LANG_STORAGE_KEY = 'petewrites_language';

// --- TRANSLATIONS DICTIONARY ---
const translations = {
    en: {
        homeTitle: "Welcome to the website of petewrites' stories!",
        homeSubtitle: "ENJOY READING AND HAPPY READING!",
        storiesButton: "Written by Pete Writes",
        aboutBtn: "About Pete",
        linksBtn: "Account Links",
        backHome: "← Back to Home",
        selectCategory: "📚 Select Category",
        cat1Desc: "By Parts & One-Shots (Mature)",
        cat2Desc: "By Parts & One-Shots",
        cat3Desc: "By Parts & One-Shots",
        cat4Desc: "Wattpad Link Only",
        welcomeHeader: "Welcome! 👋",
        welcomeDesc: "Select a category from the menu to browse stories.",
        backBtn: "← Back",
        aboutTitle: "✍️ About Pete",
        aboutText: "I am an independent random fiction writer and a BSIT graduate. I started writing on Wattpad back in 2017 and created my official Facebook writing page in 2021. I write stories simply because it brings me joy, and I want people to explore my thoughts and imagination. Above all, I hope my stories can impart meaningful life lessons that can help and inspire readers in their own journeys.",
        linksTitle: "🔗 Account Links",
        warningTitle: "Mature Content Warning (R-18)",
        warningText: "This section (petesarap's random stories) contains mature themes intended strictly for readers aged 18 and above.",
        cancel: "Cancel",
        proceed: "I am 18+ (Proceed)",
        resumeTitle: "Continue Reading?",
        resumeText: "We found your last read story. Do you want to continue where you left off?",
        yes: "Yes",
        no: "No",
        chooseFormat: "Choose Format:",
        byPartsTitle: "By Parts (Series)",
        byPartsDesc: "Multi-chapter stories split into custom parts.",
        byOneshotTitle: "By One-Shot",
        byOneshotDesc: "Complete standalone stories.",
        backFormats: "← Back to Formats",
        backTitles: "← Back to Titles",
        selectTitle: "Select Story Title:",
        selectOneshot: "Select One-Shot Title:",
        selectChapter: "Select Chapter / Part",
        novelNotice: "You can read all my novel stories directly on my official Wattpad account!",
        openWattpad: "Open Wattpad Account",
        reachedEnd: "✨ You've reached the end! Thank you so much for reading! ✨",
        reachedEndSeries: "✨ You've reached the end of this story! Thank you so much for reading! ✨",
        lastRead: "Last read:",
        lastReadBadge: "Last Read",
        darkMode: "Dark Mode",
        lightMode: "Light Mode"
    },
    ph: {
        homeTitle: "Welcome to the website of petewrites' stories!",
        homeSubtitle: "ENJOY READING AND HAPPY READING!",
        storiesButton: "Mga Kwento ni Pete Writes",
        aboutBtn: "Tungkol kay Pete",
        linksBtn: "Mga Account Link",
        backHome: "← Bumalik sa Home",
        selectCategory: "📚 Piliin ang Kategorya",
        cat1Desc: "By Parts at One-Shot (Mature)",
        cat2Desc: "By Parts at One-Shots",
        cat3Desc: "By Parts at One-Shots",
        cat4Desc: "Wattpad Link Lamang",
        welcomeHeader: "Mabuhay! 👋",
        welcomeDesc: "Pumili ng kategorya mula sa menu upang mag-browse ng mga kwento.",
        backBtn: "← Bumalik",
        aboutTitle: "✍️ Tungkol kay Pete",
        aboutText: "I am an independent random fiction writer and a BSIT graduate. I started writing on Wattpad back in 2017 and created my official Facebook writing page in 2021. I write stories simply because it brings me joy, and I want people to explore my thoughts and imagination. Above all, I hope my stories can impart meaningful life lessons that can help and inspire readers in their own journeys.",
        linksTitle: "🔗 Mga Account Link",
        warningTitle: "Babala sa Sensitibong Nilalaman (R-18)",
        warningText: "Ang seksyong ito (petesarap's random stories) ay naglalaman ng mga temang pang-mature na para lamang sa mga edad 18 pataas.",
        cancel: "Kanselahin",
        proceed: "18+ Na Ako (Ipagpatuloy)",
        resumeTitle: "Ituloy ang Pagbabasa?",
        resumeText: "May nakita kaming huli mong binasa. Gusto mo bang ituloy kung saan ka tumigil?",
        yes: "Oo",
        no: "Hindi",
        chooseFormat: "Piliin ang Uri:",
        byPartsTitle: "By Parts (Series)",
        byPartsDesc: "Maraming kabanata na hinati sa iba't ibang bahagi.",
        byOneshotTitle: "By One-Shot",
        byOneshotDesc: "Kumpletong kwento sa isang basahan lamang.",
        backFormats: "← Bumalik sa Uri",
        backTitles: "← Bumalik sa Pamagat",
        selectTitle: "Piliin ang Pamagat ng Kwento:",
        selectOneshot: "Piliin ang Pamagat ng One-Shot:",
        selectChapter: "Piliin ang Kabanata / Bahagi",
        novelNotice: "Maaari mong basahin ang lahat ng aking serye ng nobela nang direkta sa aking opisyal na Wattpad account!",
        openWattpad: "Buksan ang Wattpad Account",
        reachedEnd: "✨ Narating mo na ang dulo! Maraming salamat sa pagbabasa! ✨",
        reachedEndSeries: "✨ Narating mo na ang dulo ng seryeng ito! Maraming salamat sa pagbabasa! ✨",
        lastRead: "Huling binasa:",
        lastReadBadge: "Huling Binasa",
        darkMode: "Dark Mode",
        lightMode: "Light Mode"
    }
};

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname);
    }
    
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }

    updateStaticLanguageUI();
    navigateTo('homePage');
    checkForSavedProgressOnLoad();
});

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    updateStaticLanguageUI();

    const categoryDisplayPage = document.getElementById('categoryDisplayPage');
    const readerPage = document.getElementById('readerPage');

    if (!categoryDisplayPage.classList.contains('page-hidden')) {
        if (currentSubCategory) {
            renderSubCategoryDirect();
        } else if (currentCategory) {
            renderFormatSelectionDirect();
        }
    } else if (!readerPage.classList.contains('page-hidden')) {
        if (currentReaderMode === 'part') {
            openPartReaderDirect(document.getElementById('readerBreadcrumb').innerText, window.scrollY);
        }
    }

    const progress = getSavedProgress();
    const entries = Object.entries(progress).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
    if (entries.length && !document.getElementById('resumeModal').classList.contains('hidden')) {
        const [id, data] = entries[0];
        const t = translations[currentLang];
        const titleName = data.type === 'part' ? `${data.title} — ${data.partName}` : data.title;
        document.getElementById('resumeModalText').innerText = `${t.resumeText} ("${titleName}")`;
    }
}

function updateStaticLanguageUI() {
    const t = translations[currentLang];
    
    const enBtn = document.getElementById('langEnBtn');
    const phBtn = document.getElementById('langPhBtn');
    if (currentLang === 'en') {
        enBtn.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white transition-all cursor-pointer shadow-sm";
        phBtn.className = "text-xs font-bold px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer";
    } else {
        phBtn.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white transition-all cursor-pointer shadow-sm";
        enBtn.className = "text-xs font-bold px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer";
    }

    if (document.getElementById('homeTitle')) document.getElementById('homeTitle').innerText = t.homeTitle;
    if (document.getElementById('homeSubtitle')) document.getElementById('homeSubtitle').innerText = t.homeSubtitle;
    if (document.getElementById('storiesButtonText')) document.getElementById('storiesButtonText').innerText = t.storiesButton;
    if (document.getElementById('aboutBtnText')) document.getElementById('aboutBtnText').innerText = t.aboutBtn;
    if (document.getElementById('linksBtnText')) document.getElementById('linksBtnText').innerText = t.linksBtn;
    if (document.getElementById('backHome')) document.getElementById('backHome').innerHTML = t.backHome;
    if (document.getElementById('selectCategoryHeader')) document.getElementById('selectCategoryHeader').innerText = t.selectCategory;
    if (document.getElementById('cat1Desc')) document.getElementById('cat1Desc').innerText = t.cat1Desc;
    if (document.getElementById('cat2Desc')) document.getElementById('cat2Desc').innerText = t.cat2Desc;
    if (document.getElementById('cat3Desc')) document.getElementById('cat3Desc').innerText = t.cat3Desc;
    if (document.getElementById('cat4Desc')) document.getElementById('cat4Desc').innerText = t.cat4Desc;
    if (document.getElementById('welcomeHeader')) document.getElementById('welcomeHeader').innerText = t.welcomeHeader;
    if (document.getElementById('welcomeDesc')) document.getElementById('welcomeDesc').innerText = t.welcomeDesc;
    if (document.getElementById('readerBackBtn')) document.getElementById('readerBackBtn').innerHTML = t.backBtn;
    if (document.getElementById('aboutModalTitle')) document.getElementById('aboutModalTitle').innerHTML = t.aboutTitle;
    if (document.getElementById('aboutModalText')) document.getElementById('aboutModalText').innerText = t.aboutText;
    if (document.getElementById('aboutBackBtn')) document.getElementById('aboutBackBtn').innerText = t.cancel;
    if (document.getElementById('linksModalTitle')) document.getElementById('linksModalTitle').innerHTML = t.linksTitle;
    if (document.getElementById('warningTitle')) document.getElementById('warningTitle').innerText = t.warningTitle;
    if (document.getElementById('warningText')) document.getElementById('warningText').innerText = t.warningText;
    if (document.getElementById('warningCancelBtn')) document.getElementById('warningCancelBtn').innerText = t.cancel;
    if (document.getElementById('warningProceedBtn')) document.getElementById('warningProceedBtn').innerText = t.proceed;
    if (document.getElementById('resumeTitle')) document.getElementById('resumeTitle').innerText = t.resumeTitle;
    if (document.getElementById('resumeCancelBtn')) document.getElementById('resumeCancelBtn').innerText = t.cancel;
    if (document.getElementById('resumeYesBtn')) document.getElementById('resumeYesBtn').innerText = t.yes;
}

// Auto-save scroll position
window.addEventListener('scroll', () => {
    const readerPage = document.getElementById('readerPage');
    if (readerPage && !readerPage.classList.contains('page-hidden') && activeSaveId) {
        const progress = getSavedProgress();
        if (progress[activeSaveId]) {
            progress[activeSaveId].scrollY = window.scrollY;
            progress[activeSaveId].updatedAt = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }
    }
});

function getSavedProgress() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveProgressBookmark(id, data) {
    const progress = getSavedProgress();
    progress[id] = {
        ...data,
        updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// --- CLICK IT BADGE TIMER ---
function triggerBadgeShow() {
    const badge = document.getElementById('clickItBadge');
    if (badge) {
        badge.classList.remove('opacity-0', 'scale-75');
        badge.classList.add('opacity-100', 'scale-100');
        
        setTimeout(() => {
            badge.classList.remove('opacity-100', 'scale-100');
            badge.classList.add('opacity-0', 'scale-75');
        }, 3000);
    }
}

function startClickItTimer() {
    stopClickItTimer();
    triggerBadgeShow();
    clickItInterval = setInterval(() => {
        triggerBadgeShow();
    }, 10000);
}

function stopClickItTimer() {
    if (clickItInterval) {
        clearInterval(clickItInterval);
        clickItInterval = null;
    }
}

// --- RESUME POPUP ---
function checkForSavedProgressOnLoad() {
    const progress = getSavedProgress();
    const entries = Object.entries(progress).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
    
    if (entries.length > 0) {
        const [id, data] = entries[0];
        pendingResumeData = { id, data };
        const t = translations[currentLang];
        
        const titleName = data.type === 'part' ? `${data.title} — ${data.partName}` : data.title;
        document.getElementById('resumeModalText').innerText = `${t.resumeText} ("${titleName}")`;
        document.getElementById('resumeModal').classList.remove('hidden');
    }
}

function confirmResumeReading() {
    document.getElementById('resumeModal').classList.add('hidden');
    if (!pendingResumeData) return;

    const { data } = pendingResumeData;
    currentCategory = data.category || '';

    if (data.type === 'part') {
        currentSubCategory = 'by_parts';
        currentStoryKey = data.storyKey;
        openPartReader(data.partName, data.scrollY || 0);
    } else {
        currentSubCategory = 'by_oneshot';
        openOneShotReader(data.title, data.content, data.scrollY || 0);
    }
    pendingResumeData = null;
}

function dismissResumeModal() {
    document.getElementById('resumeModal').classList.add('hidden');
    pendingResumeData = null;
}

// --- NAVIGATION ---
function navigateTo(pageId) {
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.add('page-hidden');
        page.style.display = 'none';
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('page-hidden');
        targetPage.style.display = 'flex';
    }
    if (pageId === 'homePage') {
        activeSaveId = '';
        startClickItTimer();
    } else {
        stopClickItTimer();
    }
    updateStaticLanguageUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setThemeColor(colorName) {
    document.documentElement.setAttribute('data-theme', colorName);
}

function adjustFontSize(amount) {
    const readerContent = document.getElementById('readerContent');
    if (!readerContent) return;

    currentFontSize += amount;
    if (currentFontSize < 12) currentFontSize = 12;
    if (currentFontSize > 32) currentFontSize = 32;

    readerContent.style.fontSize = currentFontSize + 'px';
}

// --- CATEGORY SELECTION ---
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
    pushHistory({ view: 'categoryDisplayPage', step: 'format', category: currentCategory });
    renderFormatSelectionDirect();
}

function getCategoryLabel(catId) {
    if (catId === 'petesarap') return "🍷 petesarap's random stories (18+)";
    if (catId === 'petewrites_bl') return "💙 petewrites' random bl stories";
    if (catId === 'petewrites_random') return "✍️ petewrites' random stories";
    if (catId === 'petewrites_novel') return "📖 petewrites' novel stories";
    return "Stories";
}

function renderFormatSelectionDirect() {
    renderPageDirect('categoryDisplayPage');
    const area = document.getElementById('categoryContentArea');
    const t = translations[currentLang];

    if (currentCategory === 'petewrites_novel') {
        area.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="navigateTo('storiesPage')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-sm">
                    ${t.backBtn}
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">${getCategoryLabel(currentCategory)}</span>
            </div>
            <div class="flex flex-col justify-center items-center py-8 text-center space-y-3">
                <div class="text-3xl">📖</div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">petewrites' novel stories</h3>
                <p class="text-xs text-slate-600 dark:text-slate-400 max-w-sm">${t.novelNotice}</p>
                <a href="https://www.wattpad.com/user/wterpe" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer">
                    <span>${t.openWattpad}</span><span>↗</span>
                </a>
            </div>
        `;
        return;
    }

    area.innerHTML = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <button onclick="navigateTo('storiesPage')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-sm">
                ${t.backBtn}
            </button>
            <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">${getCategoryLabel(currentCategory)}</span>
        </div>
        <div class="space-y-4">
            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white pb-1">${t.chooseFormat}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onclick="showSubCategory('by_parts')" class="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-orange-500 bg-orange-50/20 dark:bg-slate-950 transition-all cursor-pointer text-left">
                    <h4 class="font-bold text-sm text-orange-600">📖 ❤️ ${t.byPartsTitle}</h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${t.byPartsDesc}</p>
                </button>
                <button onclick="showSubCategory('by_oneshot')" class="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-indigo-50/20 dark:bg-slate-950 transition-all cursor-pointer text-left">
                    <h4 class="font-bold text-sm text-indigo-600 dark:text-indigo-400">📄 ❤️ ${t.byOneshotTitle}</h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${t.byOneshotDesc}</p>
                </button>
            </div>
        </div>
    `;
}

// --- SUB-CATEGORY ---
function showSubCategory(subCat) {
    currentSubCategory = subCat;
    pushHistory({ view: 'categoryDisplayPage', step: 'subCat', category: currentCategory, subCategory: subCat });
    renderSubCategoryDirect();
}

function renderSubCategoryDirect() {
    renderPageDirect('categoryDisplayPage');
    const area = document.getElementById('categoryContentArea');
    const progress = getSavedProgress();
    const t = translations[currentLang];

    if (currentSubCategory === 'by_parts') {
        let html = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="proceedToCategory()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-sm">
                    ${t.backFormats}
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">${getCategoryLabel(currentCategory)} • Series</span>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">${t.selectTitle}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        `;

        let foundStories = 0;
        if (window.storyDatabase) {
            Object.keys(window.storyDatabase).forEach((sKey) => {
                const sData = window.storyDatabase[sKey];
                const storyCat = sData.category || 'petesarap';
                
                if (storyCat === currentCategory) {
                    foundStories++;
                    const storyTitle = sData.title || "Untitled Series";
                    const savedEntry = progress['series_' + sKey];
                    const lastReadText = savedEntry ? (savedEntry.partTitle || savedEntry.chapter || savedEntry) : '';

                    const badgeHtml = savedEntry
                        ? `<div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">🔖 ${t.lastRead} ${lastReadText}</div>`
                        : '';

                    html += `<button onclick="showPartsList('${sKey}')" class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-orange-500 transition w-full">
                        <div class="font-bold text-sm text-orange-600">📖 ${storyTitle}</div>
                        ${badgeHtml}
                    </button>`;
                }
            });
        }

        if (foundStories === 0) {
            html += `<p class="text-xs text-slate-500 col-span-full py-4">Wala pang naka-upload na series sa category na ito.</p>`;
        }

        html += `</div>`;
        area.innerHTML = html;
    } else {
        let html = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button onclick="proceedToCategory()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-sm">
                    ${t.backFormats}
                </button>
                <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-left sm:text-right">${getCategoryLabel(currentCategory)} • One-Shots</span>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">${t.selectOneshot}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        `;

        let oneshotsList = [];
        if (window.oneShotDatabase && window.oneShotDatabase[currentCategory]) {
            oneshotsList = window.oneShotDatabase[currentCategory];
        }

        if (oneshotsList.length > 0) {
            oneshotsList.forEach((os, index) => {
                const title = os.title || "Untitled One-Shot";
                const isSaved = progress[`oneshot_${currentCategory}_${title}`];
                const mark = isSaved ? `<span class="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded ml-2">${t.lastReadBadge}</span>` : '';

                html += `<button onclick="openOneShotByIndex('${currentCategory}', ${index})" class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-orange-600 hover:text-white transition-all font-bold text-xs text-left cursor-pointer shadow-sm flex items-center justify-between w-full">
                    <span>${title}</span>
                    ${mark}
                </button>`;
            });
        } else {
            html += `<p class="text-xs text-slate-500 col-span-full py-4">Wala pang naka-upload na one-shot stories sa category na ito.</p>`;
        }

        html += `</div>`;
        area.innerHTML = html;
    }
}

// --- CUSTOM PARTS LIST ---
function showPartsList(storyKey) {
    currentStoryKey = storyKey;
    pushHistory({ view: 'categoryDisplayPage', step: 'partsList', category: currentCategory, subCategory: currentSubCategory, storyKey: storyKey });
    renderPartsListDirect();
}

function renderPartsListDirect() {
    renderPageDirect('categoryDisplayPage');
    const area = document.getElementById('categoryContentArea');
    const t = translations[currentLang];

    const storyData = window.storyDatabase && window.storyDatabase[currentStoryKey];
    const titleName = storyData ? storyData.title : "Story Series";
    const storyGenre = (storyData && storyData.genre) ? storyData.genre : "";
    
    const rawDesc = (storyData && storyData.description) ? storyData.description : "";
    const storyDesc = rawDesc ? rawDesc.replace(/\n/g, '<br><br>') : "";

    const storyDate = (storyData && storyData.date) ? storyData.date : "";
    const storyStatus = (storyData && storyData.status) ? storyData.status : "";

    const partNames = (storyData && storyData.parts) ? Object.keys(storyData.parts) : [];

    const progress = getSavedProgress();
    const savedEntry = progress['series_' + currentStoryKey];
    const lastPartName = savedEntry ? savedEntry.partName : '';

    let html = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <button onclick="showSubCategory('by_parts')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-sm">
                ${t.backTitles}
            </button>
            <div class="flex flex-col items-start sm:items-end text-left sm:text-right">
                <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-normal break-words max-w-[280px]">${titleName}</span>
                <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ${storyDate ? `<span>📅 ${storyDate}</span>` : ''}
                    ${storyStatus ? `<span class="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">${storyStatus}</span>` : ''}
                </div>
            </div>
        </div>
    `;

    if (storyGenre || storyDesc) {
        html += `
            <div class="mb-5 p-4 rounded-xl bg-orange-50/50 dark:bg-slate-950/50 border border-orange-200 dark:border-orange-950/40 space-y-2 text-left">
                ${storyGenre ? `<div class="inline-block px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold tracking-wide">${storyGenre}</div>` : ''}
                ${storyDesc ? `<div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${storyDesc}</div>` : ''}
            </div>
        `;
    }

    html += `
        <h3 class="text-xs sm:text-sm font-bold text-orange-600 mb-3">${t.selectChapter} (${partNames.length} available):</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
    `;

    partNames.forEach((pName) => {
        const safePartName = pName.replace(/'/g, "\\'");
        const isLastRead = (pName === lastPartName);
        const badge = isLastRead ? `<span class="ml-2 text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded">${t.lastReadBadge}</span>` : '';

        html += `<button onclick="openPartReader('${safePartName}')" class="p-3.5 rounded-xl ${isLastRead ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'} border hover:bg-orange-600 hover:text-white transition-all font-bold text-xs text-left cursor-pointer shadow-sm flex items-center justify-between">
            <span>${pName}</span>
            ${badge}
        </button>`;
    });

    html += `</div>`;
    area.innerHTML = html;
}

// --- STORY READERS ---
function openOneShotByIndex(category, index) {
    let targetOs = null;
    
    if (window.oneShotDatabase) {
        if (window.oneShotDatabase[category] && window.oneShotDatabase[category][index]) {
            targetOs = window.oneShotDatabase[category][index];
        } else {
            for (let catKey in window.oneShotDatabase) {
                if (window.oneShotDatabase[catKey][index]) {
                    targetOs = window.oneShotDatabase[catKey][index];
                    currentCategory = catKey;
                    break;
                }
            }
        }
    }

    if (targetOs) {
        openOneShotReader(targetOs.title, targetOs.content);
    }
}

function openOneShotReader(title, content, savedScrollY = 0) {
    currentReaderMode = 'oneshot';
    activeSaveId = `oneshot_${currentCategory}_${title}`;

    if (savedScrollY === 0) {
        const progress = getSavedProgress();
        savedScrollY = progress[activeSaveId] ? progress[activeSaveId].scrollY || 0 : 0;
    }

    saveProgressBookmark(activeSaveId, {
        type: 'oneshot',
        category: currentCategory,
        title: title,
        content: content,
        scrollY: savedScrollY
    });

    pushHistory({ view: 'readerPage', type: 'oneshot', title: title, content: content, scrollY: savedScrollY });
    openOneShotReaderDirect(title, content, savedScrollY);
}

function openOneShotReaderDirect(title, content, savedScrollY) {
    currentReaderMode = 'oneshot';
    activeSaveId = `oneshot_${currentCategory}_${title}`;
    const t = translations[currentLang];

    let currentOsDate = "";
    let currentOsStatus = "";
    if (window.oneShotDatabase && window.oneShotDatabase[currentCategory]) {
        const foundOs = window.oneShotDatabase[currentCategory].find(os => os.title === title);
        if (foundOs) {
            currentOsDate = foundOs.date || "";
            currentOsStatus = foundOs.status || "";
        }
    }

    document.getElementById('readerTitle').innerText = title;
    
    let breadcrumbHtml = `<span class="whitespace-normal break-words">${title}</span>`;
    if (currentOsDate || currentOsStatus) {
        breadcrumbHtml += `
            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                ${currentOsDate ? `<span>📅 ${currentOsDate}</span>` : ''}
                ${currentOsStatus ? `<span class="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">${currentOsStatus}</span>` : ''}
            </div>
        `;
    }
    document.getElementById('readerBreadcrumb').innerHTML = breadcrumbHtml;

    const readerContent = document.getElementById('readerContent');
    readerContent.style.fontSize = currentFontSize + 'px';

    readerContent.innerHTML = `
        ${content}
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6 mt-8 text-center space-y-4">
            <p class="text-sm font-bold text-orange-600">${t.reachedEnd}</p>
            <div>
                <button onclick="goBackFromReader()" class="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md">
                    ${t.backBtn}
                </button>
            </div>
        </div>
    `;
    renderPageDirect('readerPage');

    if (savedScrollY > 0) {
        setTimeout(() => window.scrollTo({ top: savedScrollY, behavior: 'smooth' }), 50);
    }
}

function openPartReader(partName, savedScrollY = 0) {
    currentReaderMode = 'part';
    activeSaveId = `series_${currentStoryKey}`;

    const storyData = window.storyDatabase && window.storyDatabase[currentStoryKey];
    const titleName = storyData ? storyData.title : "Story";

    if (savedScrollY === 0) {
        const progress = getSavedProgress();
        savedScrollY = (progress[activeSaveId] && progress[activeSaveId].partName === partName) 
            ? progress[activeSaveId].scrollY || 0 
            : 0;
    }

    saveProgressBookmark(activeSaveId, {
        type: 'part',
        category: currentCategory,
        storyKey: currentStoryKey,
        title: titleName,
        partName: partName,
        scrollY: savedScrollY
    });

    pushHistory({ view: 'readerPage', type: 'part', category: currentCategory, storyKey: currentStoryKey, partName: partName, scrollY: savedScrollY });
    openPartReaderDirect(partName, savedScrollY);
}

function openPartReaderDirect(partName, savedScrollY) {
    currentReaderMode = 'part';
    activeSaveId = `series_${currentStoryKey}`;
    const t = translations[currentLang];

    const storyData = window.storyDatabase && window.storyDatabase[currentStoryKey];
    const titleName = storyData ? storyData.title : "Story";
    const partNames = (storyData && storyData.parts) ? Object.keys(storyData.parts) : [];
    const currentIndex = partNames.indexOf(partName);

    let content = (storyData && storyData.parts && storyData.parts[partName])
        ? storyData.parts[partName]
        : `Story text for ${partName}...`;

    document.getElementById('readerTitle').innerText = `${titleName} — ${partName}`;
    document.getElementById('readerBreadcrumb').innerHTML = `<span class="whitespace-normal break-words">${partName}</span>`;

    const readerContent = document.getElementById('readerContent');
    readerContent.style.fontSize = currentFontSize + 'px';

    let navigationHtml = '';
    if (currentIndex !== -1 && currentIndex < partNames.length - 1) {
        const nextPartName = partNames[currentIndex + 1];
        const safeNextPartName = nextPartName.replace(/'/g, "\\'");
        navigationHtml = `
            <div class="flex justify-end pt-6 sm:pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
                <button onclick="openPartReader('${safeNextPartName}')" class="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md">
                    Next: ${nextPartName} →
                </button>
            </div>
        `;
    } else {
        navigationHtml = `
            <div class="border-t border-slate-200 dark:border-slate-800 pt-6 mt-8 text-center space-y-4">
                <p class="text-sm font-bold text-orange-600">${t.reachedEndSeries}</p>
                <div>
                    <button onclick="showPartsList('${currentStoryKey}')" class="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md">
                        ${t.backTitles}
                    </button>
                </div>
            </div>
        `;
    }

    readerContent.innerHTML = `
        ${content}
        ${navigationHtml}
    `;
    renderPageDirect('readerPage');

    if (savedScrollY > 0) {
        setTimeout(() => window.scrollTo({ top: savedScrollY, behavior: 'smooth' }), 50);
    }
}

function goBackFromReader() {
    activeSaveId = '';
    window.history.back();
}

// --- PUSH HISTORY HELPER ---
function pushHistory(stateObj) {
    history.pushState(stateObj, '', window.location.pathname);
}

function renderPageDirect(pageId) {
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.add('page-hidden');
        page.style.display = 'none';
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('page-hidden');
        targetPage.style.display = 'flex';
    }
    if (pageId === 'homePage') {
        activeSaveId = '';
        startClickItTimer();
    } else {
        stopClickItTimer();
    }
    updateStaticLanguageUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (event) => {
    document.getElementById('resumeModal').classList.add('hidden');
    
    if (event.state && event.state.view) {
        const state = event.state;
        if (state.view === 'homePage') {
            renderPageDirect('homePage');
        } else if (state.view === 'storiesPage') {
            renderPageDirect('storiesPage');
        } else if (state.view === 'categoryDisplayPage') {
            currentCategory = state.category || currentCategory;
            currentSubCategory = state.subCategory || currentSubCategory;
            
            if (state.step === 'format') {
                renderFormatSelectionDirect();
            } else if (state.step === 'subCat') {
                renderSubCategoryDirect();
            } else if (state.step === 'partsList') {
                currentStoryKey = state.storyKey || currentStoryKey;
                renderPartsListDirect();
            } else {
                renderFormatSelectionDirect();
            }
        } else if (state.view === 'readerPage') {
            if (state.type === 'oneshot') {
                openOneShotReaderDirect(state.title, state.content, state.scrollY || 0);
            } else if (state.type === 'part') {
                currentCategory = state.category || currentCategory;
                currentStoryKey = state.storyKey || currentStoryKey;
                openPartReaderDirect(state.partName, state.scrollY || 0);
            }
        }
    } else {
        renderPageDirect('homePage');
    }
});

// --- MODALS & THEME ---
function openAboutModal() { document.getElementById('aboutModal').classList.remove('hidden'); }
function openLinksModal() { document.getElementById('linksModal').classList.remove('hidden'); }
function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    const t = translations[currentLang];

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.innerText = '🌙';
        text.innerText = t.darkMode;
    } else {
        html.classList.add('dark');
        icon.innerText = '☀️';
        text.innerText = t.lightMode;
    }
}

// Anti-copy shortcut blocker
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) {
        e.preventDefault();
        alert("Protected Content: Copying is disabled.");
    }
});

// Automated Copyright & Year Update for Pete Writes
window.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const copyYearEl = document.getElementById("copyright-year");
    const currYearEl = document.getElementById("current-year");
    if (copyYearEl) copyYearEl.textContent = currentYear;
    if (currYearEl) currYearEl.textContent = currentYear;
});