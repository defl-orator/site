if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

const savedLang = localStorage.getItem('visutype_lang');
const systemLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
const userLang = savedLang || systemLang;

let easterEggIndex = 0;
let easterEggTimer = null;
let easterEggActive = true;
let isFirstEasterEgg = true; 
let initialGreetingText = "";

const footerAssistants = ['images/vizy_assistant.png', 'images/alex_assistant.png', 'images/zhenya_assistant.png', 'images/valya_assistant.png'];
let currentFooterAsst = 0;

let ticking = false;

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const tableArea = document.getElementById('comparison-scroll-area');
const hintLeft = document.getElementById('table-hint-left');
const hintRight = document.getElementById('table-hint-right');

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const assistantsData = [
    { id: 'alex', img: 'images/alex_assistant.png', nameKey: 'asst_alex_name', descKey: 'asst_alex_desc', color: 'linear-gradient(145deg, #4b5563, #1f2937)' },
    { id: 'vizy', img: 'images/vizy_assistant.png', nameKey: 'asst_vizy_name', descKey: 'asst_vizy_desc', color: 'linear-gradient(145deg, #007AFF, #00C7BE)' },
    { id: 'zhenya', img: 'images/zhenya_assistant.png', nameKey: 'asst_zhenya_name', descKey: 'asst_zhenya_desc', color: 'linear-gradient(145deg, #D4145A, #FBB03B)' },
    { id: 'valya', img: 'images/valya_assistant.png', nameKey: 'asst_valya_name', descKey: 'asst_valya_desc', color: 'linear-gradient(145deg, #ff758c, #ff7eb3)' }
];

const themesData = [
    { id: 'normal', base: 'theme_normal', nameKey: 'theme_normal', mode: 'light' },
    { id: 'normal_d', base: 'theme_normal', nameKey: 'theme_normal_dark', mode: 'dark' },
    { id: 'soft', base: 'theme_soft', nameKey: 'theme_soft', mode: 'light' },
    { id: 'soft_d', base: 'theme_soft', nameKey: 'theme_soft_dark', mode: 'dark' },
    { id: 'emerald', base: 'theme_emerald', nameKey: 'theme_emerald', mode: 'light' },
    { id: 'emerald_d', base: 'theme_emerald', nameKey: 'theme_emerald_dark', mode: 'dark' },
    { id: 'space', base: 'theme_space', nameKey: 'theme_space', mode: 'light' },
    { id: 'space_d', base: 'theme_space', nameKey: 'theme_space_dark', mode: 'dark' },
    { id: 'noir', base: 'theme_noir', nameKey: 'theme_noir', mode: 'light' },
    { id: 'noir_d', base: 'theme_noir', nameKey: 'theme_noir_dark', mode: 'dark' }
];

let carousels = {
    asst: { index: 0, data: assistantsData, el: 'asst-track' }
};

const translations = {
    ru: {
        hero_home: "Твой дом для",
        word_1: "удобных", word_2: "уютных", word_3: "красивых", word_4: "функциональных", word_5: "визуальных", hero_suffix: "заметок",
        btn_telegram: "Попробовать", btn_news: "Читать в Telegram", btn_open: "🔍 Открыть",
        
        comment_features: "Смотри, что я умею! Здесь всё, чтобы твои идеи чувствовали себя как дома.",
        comment_custom: "Ого! Ты можешь переодеть всё приложение под своё настроение? Смотри, какие наряды я нашел!",
        comment_home_atmosphere: "Чувствуй себя как дома! Я здесь, чтобы создать уют и помочь во всем.",
        comment_assistants: "А вот это мои друзья (и я). Возможно тебе приглянётся кто-то больше, чем я... 😪(😅)",
        comment_comparison: "Хм, давай подумаем... Почему мы? Я тут табличку составил, всё честно!",
        comment_pricing: "Бесплатно — круто. Но с Pro ты становишься просто космос. Зацени условия.",
        comment_roadmap: "Я жду не дождусь этих обновлений! Вот наш план захвата мира (ну или просто разработки).",
        footer_news_head: 'Понравилось?',
        footer_news_desc: "Если зашло, то переходи в наш телеграм канал. Там все новости и анонсы нашего приложения.",
        asst_bottom_disclaimer: "Мы все очень разные, поэтому советую подумать перед выбором своего помощника, чтобы опыт в приложении был на высшем уровне.",
        
        feat_1_title_suffix: " заметки", feat_1_desc: "Заметки, к которым вы привыкли — только удобнее и мощнее.",
        feat_2_plain_text: "Наглядные", feat_2_cap_1: "карты", feat_2_cap_2: "мыслей", feat_2_desc: "Стройте идеи визуально: связи, ветки, персонализация — всё под рукой.",
        feat_3_rainbow: "Творческий", feat_3_suffix: " холст", feat_3_desc: "Для схем, формул, эскизов и идей, которые легче изобразить, чем описать.",
        wavy_title: "Гибкие",
        
        theme_head_1: "Выберите", theme_head_2: "свой стиль",
        comp_col_1: "Карты мыслей", comp_col_2: "Холсты", comp_col_3: "Кастомизация", comp_col_4: "Скорость", comp_col_5: "Минимализм", comp_col_6: "Ассистент",
        
        asst_alex_name: "Алекс", asst_alex_desc: "Это у нас самый скромняга и интеллигент. Если нужен минимум эмоций и краткость - то лучше, не найти.",
        asst_vizy_name: "Визя", asst_vizy_desc: "Ну ты меня уже знаешь. Меня тут за главного считают вроде. Так что если нужен дружественный совет или позитивный настрой, то я всегда к твоим услугам.",
        asst_zhenya_name: "Женя", asst_zhenya_desc: "Ох, ну что про него сказать... Кому-то он нравится, кому-то нет. Если ты любишь комедии про плохишей, то этот индивид удовлетворит твои потребности на 110%.",
        asst_valya_name: "Валя", asst_valya_desc: "Милее ассистента ты уже никогда не встретишь. Готовься к обилию теплоты, комплиментов и всего ми-ми-ми 🥰 (вызывает сильную привязанность).",
        
        theme_normal: "Обычная", theme_normal_dark: "Обычная тёмная",
        theme_soft: "Нежная", theme_soft_dark: "Нежная тёмная",
        theme_emerald: "Изумрудная", theme_emerald_dark: "Изумрудная тёмная",
        theme_space: "Космическая", theme_space_dark: "Космическая тёмная",
        theme_noir: "Нуарная", theme_noir_dark: "Нуарная тёмная",
        
        price_free_1: "Лучший редактор заметок по удобству", price_free_2: "iCloud синхронизация заметок", price_free_3: "Базовые темы/палитры", price_free_4: "Импорт заметок из других приложений", price_free_5: "Базовый экспорт заметок / карт мыслей / холстов",
        price_pro_cost: "199 ₽ / мес",
        price_pro_1: "Всё, что в бесплатном", 
        price_pro_2: "Безлимитная кастомизация: карт мыслей / обложек / эмодзи / тем / иконок", 
        price_pro_3: "Ранний доступ к новым функциям", 
        price_pro_4: "Уникальные диалоги с ассистентами",
        price_pro_5: "Продвинутый экспорт заметок / холстов / карт мыслей",
        price_pro_6: "Создание сайта на основе заметки",
        
        road_head_1: "План развития",
        road_step_1: "Этап 1: MVP", road_item_1_date: "Сейчас", road_item_1_title: "macOS, iOS и iPadOS", road_item_1_desc: "Сначала — стабильность. Базовый редактор и хранение.", status_done: "Готово",
        road_step_2: "Этап 2: Экосистема", road_item_2_date: "до 1 Янв 2026", road_item_2_title: "Облачная синхронизация", road_item_2_desc: "Потом — синхронизация. Бесшовная работа между устройствами.", status_dev: "В разработке",
        road_item_localization_date: "до 1 Июня 2026", road_item_localization_title: "Локализация", road_item_localization_desc: "Испанский, китайский, немецкий, японский и корейский языки.",
        road_item_3_date: "до 1 Июня 2026", road_item_3_title: "Релиз в App Store", road_item_3_desc: "Официальный выход приложения для широкой аудитории.", status_plan: "В планах",
        road_step_3: "Этап 3: Расширение", road_item_4_date: "до 1 Сент 2026", road_item_4_title: "Windows & Android", road_item_4_desc: "Затем — выход на все популярные платформы.",
        road_item_collab_date: "до конца 2026", road_item_collab_title: "Совместный режим", road_item_collab_desc: "Возможность работать над одной заметкой нескольким людям одновременно.",
        road_item_5_date: "до конца 2026", road_item_5_title: "Интеграции ИИ", road_item_5_desc: "И напоследок — ИИ-инструменты и локальная генерация.",
        
        comment_faq: "Остались вопросы? Я собрал самые частые из них и подготовил ответы!",
        
        faq_q1: "Где хранятся мои данные и есть ли синхронизация?",
        faq_a1: "Все твои заметки, карты мыслей и холсты хранятся на устройстве и автоматически синхронизируются через iCloud. Данные остаются исключительно в пределах твоего аккаунта Apple ID для максимальной конфиденциальности.",
        
        faq_q2: "Как работают карты мыслей и холсты внутри текста?",
        faq_a2: "Ты можешь вставлять их прямо в текстовую заметку как интерактивные блоки (нажав меню «Вставить блок»). Нажатие на такой блок открывает полноэкранный редактор. Карты мыслей поддерживают авто-расстановку и темы, а холсты — свободное рисование.",
        
        faq_q3: "В чем особенность ИИ-Ассистента? Это просто чат-бот?",
        faq_a3: "Нет, это не обычный ИИ-бот. Это виртуальный компаньон, который живет в приложении. Он реагирует на твою активность (например, долгую сессию письма), следит за ежедневными заходами (стриками), выдает достижения и комментирует процесс.",
        
        faq_q4: "Могу ли я поделиться своей заметкой с друзьями?",
        faq_a4: "Да! Любую заметку (включая вложенные карты и холсты) можно экспортировать в красивый PDF. А если хочешь поделиться ссылкой, доступна функция «Опубликовать в Web», которая за пару секунд превратит заметку в веб-страницу.",
        
        faq_q5: "Нужен ли интернет для работы приложения?",
        faq_a5: "Приложение работает абсолютно автономно. Ты можешь создавать заметки, рисовать и строить карты мыслей без сети. Интернет потребуется только для синхронизации по iCloud и публикации заметок в Web.",
        legend_full: "полная реализация", legend_part: "частичная реализация", legend_none: "не реализовано",
        
        hero_return: "С возвращением! Продолжим?",
        hero_return_en: "Welcome back! Shall we continue?",

        nav_feat: "Возможности", nav_style: "Стиль", nav_price: "Цены", nav_roadmap: "План",

        footer_rights: "Все права защищены."
    },
    en: {
            hero_home: "Your home for",
        word_1: "convenient", word_2: "cozy", word_3: "beautiful", word_4: "functional", word_5: "visual", hero_suffix: "notes",
        btn_telegram: "Try it out", btn_news: "Project News in Telegram", btn_open: "🔍 Open",
        
        comment_features: "Look what I can do! Everything to make your ideas feel at home.",
        comment_custom: "Wow! You can dress up the app to fit your mood? Look at the outfits I found!",
        comment_home_atmosphere: "Make yourself at home! I'm here to create comfort and help with everything.",
        comment_assistants: "And these are my friends (and me). Maybe you'll like someone more than me... 😪(😅)",
        comment_comparison: "Hmm, let's think... Why us? I made a chart, totally honest!",
        comment_pricing: "Free is cool. But Pro sends you to space. Check the terms.",
        comment_roadmap: "I can't wait for these updates! Here is our plan for world domination (or just development).",
        footer_news_head: 'Liked what you saw?',
        footer_news_desc: "If so, join our Telegram channel. All news and announcements of our application are there.",
        asst_bottom_disclaimer: "We are all very different, so I advise you to think before choosing your assistant so that the experience in the application is at the highest level.",

        feat_1_title_suffix: " notes", feat_1_desc: "Notes you are used to — just more convenient and powerful.",
        feat_2_plain_text: "Visual", feat_2_cap_1: "mind", feat_2_cap_2: "maps", feat_2_desc: "Build ideas visually: connections, branches, personalization — everything at hand.",
        feat_3_rainbow: "Creative", feat_3_suffix: " canvas", feat_3_desc: "For diagrams, formulas, sketches, and ideas that are easier to depict than describe.",
        wavy_title: "Flexible",

        theme_head_1: "Choose", theme_head_2: "your style",
        comp_col_1: "Mind Maps", comp_col_2: "Canvases", comp_col_3: "Customization", comp_col_4: "Speed", comp_col_5: "Minimalism", comp_col_6: "Assistant",
        
        asst_alex_name: "Riley", asst_alex_desc: "The most modest intellectual here. If you need minimum emotions and brevity - you won't find anyone better.",
        asst_vizy_name: "Vizy", asst_vizy_desc: "You know me already. They think I'm the boss here. So if you need friendly advice or positive vibes, I'm at your service.",
        asst_zhenya_name: "Jax", asst_zhenya_desc: "Oh, what to say... Some like him, some don't. If you love comedies about bad guys, this individual will satisfy your needs 110%.",
        asst_valya_name: "River", asst_valya_desc: "You will never meet a cuter assistant. Prepare for abundance of warmth, compliments and all things cute 🥰 (causes strong attachment).",
        
        theme_normal: "Standard", theme_normal_dark: "Standard Dark",
        theme_soft: "Soft", theme_soft_dark: "Soft Dark",
        theme_emerald: "Emerald", theme_emerald_dark: "Emerald Dark",
        theme_space: "Space", theme_space_dark: "Space Dark",
        theme_noir: "Noir", theme_noir_dark: "Noir Dark",

        price_free_1: "Best note editor experience", price_free_2: "iCloud note sync", price_free_3: "Basic themes/palettes", price_free_4: "Import notes from other apps", price_free_5: "Basic export for notes / mind maps / canvases",
        price_pro_cost: "$4.99 / month",
        price_pro_1: "Everything in Free", 
        price_pro_2: "Unlimited customization: mind maps / covers / emojis / themes / icons", 
        price_pro_3: "Early access to new features", 
        price_pro_4: "Unique assistant dialogues",
        price_pro_5: "Advanced export: notes / canvases / mind maps",
        price_pro_6: "Publish notes as websites",
        
        road_head_1: "Development Roadmap",
        road_step_1: "Stage 1: MVP", road_item_1_date: "Now", road_item_1_title: "macOS, iOS & iPadOS", road_item_1_desc: "First — stability. Basic editor and local storage.", status_done: "Done",
        road_step_2: "Stage 2: Ecosystem", road_item_2_date: "by Jan 1, 2026", road_item_2_title: "Cloud Sync", road_item_2_desc: "Then — sync. Seamless work between devices.", status_dev: "In progress",
        road_item_localization_date: "by June 1, 2026", road_item_localization_title: "Localization", road_item_localization_desc: "Spanish, Chinese, German, Japanese, and Korean languages.",
        road_item_3_date: "by June 1, 2026", road_item_3_title: "App Store Release", road_item_3_desc: "Official release for a wide audience.", status_plan: "Planned",
        road_step_3: "Stage 3: Expansion", road_item_4_date: "by Sept 1, 2026", road_item_4_title: "Windows & Android", road_item_4_desc: "Then — expansion to all popular platforms.",
        road_item_collab_date: "by end of 2026", road_item_collab_title: "Collaboration Mode", road_item_collab_desc: "Ability for multiple people to work on one note simultaneously.",
        road_item_5_date: "by end of 2026", road_item_5_title: "AI Integrations", road_item_5_desc: "Finally — AI tools and local generation.",
        
        comment_faq: "Any questions left? I've collected the most common ones and prepared the answers!",
        
        faq_q1: "Where is my data stored and is there cloud sync?",
        faq_a1: "All your notes, mind maps, and canvases are stored on your device and automatically synced via iCloud. Data remains exclusively within your Apple ID account for maximum privacy.",
        
        faq_q2: "How do mind maps and canvases work inside notes?",
        faq_a2: "You can insert them directly into your text notes as interactive blocks. Clicking on such a block opens a full-screen editor. Mind maps support auto-layout and themes, while canvases offer freehand drawing tools.",
        
        faq_q3: "What makes the AI Assistant special? Is it just a chatbot?",
        faq_a3: "No, it's not a standard AI chatbot. It's a virtual companion living in the app. It reacts to your activity (like a long writing session), tracks your daily streaks, awards achievements, and has customizable personalities ranging from strict to romantic.",
        
        faq_q4: "Can I share my notes with friends or colleagues?",
        faq_a4: "Yes! Any note (including nested maps and canvases) can be exported as a beautiful PDF document. If you want to share a link, the 'Publish to Web' feature turns your note into a live webpage in seconds.",
        
        faq_q5: "Do I need an internet connection to use the app?",
        faq_a5: "The app works completely offline. You can create notes, draw, and build mind maps without a network connection. Internet is only required for iCloud sync and publishing notes to the Web.",
        legend_full: "fully implemented", legend_part: "partially implemented", legend_none: "not implemented",
        
        hero_return: "Welcome back! Shall we continue?",
        hero_return_en: "Welcome back! Shall we continue?",
        nav_feat: "Features", nav_style: "Style", nav_price: "Pricing", nav_roadmap: "Roadmap",
        footer_rights: "All rights reserved."
    }
};

const introPhrases = {
    ru: ["Привет!", "Полетели!"],
    en: ["Hello!", "Let's go!"]
};

const randomGreetings = {
    ru: ["Ого, привет. Это ты удачно зашёл. Листай вниз, я всё подробнее рассказу про приложение.", "Привет! Рад тебя видеть. Давай покажу, как тут всё устроено.", "Здравствуй! Ты как раз вовремя, у меня есть что тебе показать.", "Хей! Проходи, чувствуй себя как дома. Тут очень уютно.", "Салют! Готов увидеть лучший инструмент для своих мыслей?"],
    en: ["Oh, hi! You came at the right time. Scroll down, I'll tell you everything.", "Hello! Glad to see you. Let me show you around.", "Greetings! Just in time, I have something cool to show you.", "Hey! Come in, make yourself at home. It's cozy here.", "Hi there! Ready to see the best tool for your thoughts?"]
};

const easterEggPhrasesRu = [
    "А ты чего всё ещё здесь? На анимацию залип?",
    "Ну ладно, подожду тебя пока ты там налюбуешься чем-то",
    "Я смотрю тебе терпения не занимать. Ты правда думаешь, что я что-то интересное ещё скажу?",
    "Видимо наивности тоже. Ну жди-жди",
    "🤨. Какой-то ты странный всё-таки, уже большинство успели всё прочитать тут, а ты тут трёшься.",
    "Ладно, больше нет сил мне с тобой тут общаться, смотри сколько хочешь, я тоже на тебя посмотрю, меня ты не переиграешь"
];
const easterEggPhrasesEn = [
    "Why are you still here? Staring at the animation?",
    "Alright, I'll wait while you admire... whatever it is.",
    "You have patience, I see. Do you really think I'll say something interesting?",
    "And naivety too. Well, keep waiting.",
    "🤨. You're weird. Most people have scrolled down by now.",
    "Okay, I'm done talking. Stare all you want, I'll stare back. You won't outplay me."
];

function applyLanguage(lang) {
    if (lang === 'en') {
            setupWavyText("Flexible"); // Запускаем анимацию волны для EN
            return; 
    }

    // Если язык русский - заменяем текст
    if (translations[lang]) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(translations[lang][key]) el.innerHTML = translations[lang][key];
        });
        // Обновляем волнистый текст для русского
        setupWavyText(translations[lang].wavy_title); 
    }
}

function setupWavyText(text) {
    const wavyContainer = document.getElementById('wavy-title');
    if (wavyContainer) {
        wavyContainer.innerHTML = ''; 
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char; span.className = 'wavy-char'; span.style.animationDelay = `${i * 0.1}s`;
            if(char === ' ') span.style.width = '0.3em';
            wavyContainer.appendChild(span);
        });
    }
}

function renderCarousels() {
    const asstTrack = document.getElementById('asst-track');
    asstTrack.innerHTML = '';
    assistantsData.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.id = `asst-card-${i}`;
        card.style.background = item.color;
        card.style.color = 'white';
        card.innerHTML = `<img src="${item.img}" alt="${item.id}" class="c-img"><h3 class="c-title">${translations[userLang][item.nameKey]}</h3><p class="c-desc">${translations[userLang][item.descKey]}</p>`;
        asstTrack.appendChild(card);
    });
    updateCarouselVisuals('asst');

    // 2. Render Themes 
    const themesTrack = document.getElementById('themes-track');
    if(themesTrack) {
        themesTrack.innerHTML = '';
        
        themesData.forEach(item => {
            const themeDiv = document.createElement('div');
            themeDiv.className = 'theme-item';
            
            themeDiv.innerHTML = `
                <div class="theme-image-wrapper" onclick="openLightbox(this)">
                    <img src="" 
                        data-base="${item.base}" 
                        data-mode="${item.mode}" 
                        data-ext="png" 
                        alt="${item.id}"
                        class="theme-img-asset"> 
                </div>
                <h3>${translations[userLang][item.nameKey]}</h3>
            `;
            
            themesTrack.appendChild(themeDiv);
        });
    }

    updateImages();
}

function scrollThemes(direction) {
    const track = document.getElementById('themes-track');
    if(!track) return;
    
    // Ширина одной карточки + отступ (примерно 430px для десктопа)
    const scrollAmount = 430; 
    
    if(direction === 'left') {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function moveCarousel(type, direction) {
    const c = carousels[type];
    c.index = (c.index + direction + c.data.length) % c.data.length;
    updateCarouselVisuals(type);
}

function updateCarouselVisuals(type) {
    const c = carousels[type];
    const len = c.data.length;
    for(let i=0; i<len; i++) {
        const card = document.getElementById(`${type}-card-${i}`);
        card.className = 'carousel-card';
        const prevIndex = (c.index - 1 + len) % len;
        const nextIndex = (c.index + 1) % len;
        if (i === c.index) card.classList.add('active');
        else if (i === prevIndex) card.classList.add('prev');
        else if (i === nextIndex) card.classList.add('next');
    }
}

function setHeroGreeting() {
    const isReturningUser = localStorage.getItem('visutype_visited');
    const bubble = document.getElementById('hero-random-greeting');
    
    if (isReturningUser) {
        initialGreetingText = translations[userLang].hero_return;
    } else {
        const list = randomGreetings[userLang];
        initialGreetingText = list[Math.floor(Math.random() * list.length)];
    }
    
    bubble.textContent = initialGreetingText;
    
    setTimeout(() => {
        if (bubble && !bubble.classList.contains('hide-me')) {
            bubble.classList.add('hide-me');
            easterEggActive = false; 
        }
    }, 5000); 

    startEasterEggTimer();
}

function startEasterEggTimer() {
    if (!easterEggActive) return;
    const delay = isFirstEasterEgg ? 30000 : 10000;
    
    easterEggTimer = setTimeout(() => {
        if (!easterEggActive) return;
        isFirstEasterEgg = false; 
        
        // Выбор массива фраз
        const phrases = userLang === 'ru' ? easterEggPhrasesRu : easterEggPhrasesEn;
        
        if (easterEggIndex < phrases.length) {
            changeGreetingWithAnimation(phrases[easterEggIndex]);
            easterEggIndex++;
            startEasterEggTimer();
        }
    }, delay);
}

function changeGreetingWithAnimation(text) {
    const bubble = document.getElementById('hero-random-greeting');
    // Fade out
    bubble.style.opacity = '0';
    
    // Change text after fade out complete (0.5s matches css transition)
    setTimeout(() => {
        bubble.textContent = text;
        // Fade in
        bubble.style.opacity = '1';
    }, 500);
}

function initFooterAnimation() {
    const container = document.getElementById('footer-asst-container');
    if(!container) return; 
    footerAssistants.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = `footer-asst-img ${i === 0 ? 'active' : ''}`;
        container.appendChild(img);
    });

    setInterval(() => {
        const images = document.querySelectorAll('.footer-asst-img');
        if(images.length > 0) {
            images[currentFooterAsst].classList.remove('active');
            currentFooterAsst = (currentFooterAsst + 1) % footerAssistants.length;
            images[currentFooterAsst].classList.add('active');
        }
    }, 3000); 
}

function waitForImage(imgElement) {
    return new Promise((resolve) => {
        if (imgElement.complete && imgElement.naturalHeight !== 0) {
            resolve();
        } else {
            imgElement.onload = () => resolve();
            imgElement.onerror = () => resolve(); 
        }
    });
}

async function runVizyAnimation() {
    const introOverlay = document.getElementById('intro-overlay');
    const introVizy = document.getElementById('intro-vizy');
    const introBubble = document.getElementById('intro-bubble');
    const targetVizy = document.querySelector('.hero-vizy-main-img');
    
    await waitForImage(introVizy);
    document.getElementById('intro-loader').style.display = 'none';
    introVizy.style.display = 'block';

    const startWidth = 200; 

    // ПРОВЕРКА: Был ли пользователь здесь раньше?
    const isReturningUser = localStorage.getItem('visutype_visited');
    // Сразу записываем, что он тут был
    localStorage.setItem('visutype_visited', 'true');

    // Тайминг начала полета: 1200мс для новых, 100мс для старых (сразу летит)
    const flightStartTime = isReturningUser ? 100 : 1200;

    // === ЭТАП 1: ПРИВЕТСТВИЕ ===
    requestAnimationFrame(() => {
        introVizy.style.opacity = '1';
        introVizy.style.transform = 'scale(1)';
        introVizy.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease';
    });

    if (!isReturningUser) {
        // Показываем баббл "Привет!" только новым пользователям
        setTimeout(() => {
            if(introBubble) introBubble.classList.add('visible');
        }, 100);
    } else {
        // Прячем баббл для старых, чтобы не мелькал
        if(introBubble) introBubble.style.display = 'none';
    }

    // Подготовка к прыжку (сжатие перед прыжком)
    setTimeout(() => {
        if(introBubble && !isReturningUser) introBubble.classList.remove('visible');
        introVizy.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        introVizy.style.transform = 'scale(0.9)';
    }, Math.max(0, flightStartTime - 300)); // Если flightStartTime 100, сработает сразу (0)

    // === ЭТАП 2: ПОЛЕТ ===
    setTimeout(() => {
        const targetRect = targetVizy.getBoundingClientRect();
        const startCenterX = window.innerWidth / 2;
        const startCenterY = window.innerHeight / 2;
        const targetCenterX = targetRect.left + (targetRect.width / 2);
        const targetCenterY = targetRect.top + (targetRect.height / 2);

        const deltaX = targetCenterX - startCenterX;
        const deltaY = targetCenterY - startCenterY;
        
        let targetWidth = targetRect.width;
        if (targetWidth === 0) targetWidth = 300; 
        const scale = targetWidth / startWidth;

        // 1. Убираем белый фон
        introOverlay.style.background = 'transparent';

        // 2. ЗАПУСКАЕМ АНИМАЦИЮ (Показываем интерфейс сайта)
        document.body.classList.add('animation-done');

        preloadThemeImages();

        // 3. Запускаем физический полет (длительность 1 сек)
        introVizy.style.transition = 'transform 1.0s cubic-bezier(0.19, 1, 0.22, 1)'; 
        introVizy.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

    }, flightStartTime);

    // === ЭТАП 3: ПРИЗЕМЛЕНИЕ ===
    setTimeout(() => {
        document.body.classList.add('logo-landed');
        
        // Плавное исчезновение летящего ассистента
        introVizy.style.transition = 'opacity 0.4s ease';
        introVizy.style.opacity = '0'; 
        
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 400);

    }, flightStartTime + 1000); 
}

window.addEventListener('load', function() {
    // 1. Сначала определяем тему 
    initTheme();

    // 2. Убираем прелоадер
    const p = document.getElementById('preloader');
    if(p) p.style.display = 'none';

    // 3. Язык
    document.querySelector('.current-lang').textContent = userLang.toUpperCase();
    
    // 4. Обновляем картинки 
    updateImages();

    // 5. Запуск анимаций
    // Установка фразы
    const phrases = introPhrases[userLang] || introPhrases['en'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const bubbleTextEl = document.getElementById('intro-bubble-text');
    if (bubbleTextEl) bubbleTextEl.textContent = randomPhrase;

    // Hero фраза
    setHeroGreeting();
    
    // Визя
    runVizyAnimation();
    
    // Карусели
    renderCarousels();

    initFAQ();
});

function toggleLangMenu(event) {
    event.stopPropagation();
    const list = document.getElementById('lang-list');
    list.classList.toggle('show');
}

window.addEventListener('click', () => {
    const list = document.getElementById('lang-list');
    if (list.classList.contains('show')) list.classList.remove('show');
});

function setLang(lang) {
    localStorage.setItem('visutype_lang', lang);
    // ПЕРЕЗАГРУЗКА
    location.reload();
}

function updateImages() {
    const bodyIsDark = document.body.classList.contains('dark-theme');
    const bodyIsLight = document.body.classList.contains('light-theme');
    let isDarkTheme = bodyIsDark || (!bodyIsLight && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const isMobile = window.innerWidth < 768; 
    
    document.querySelectorAll('img[data-base]').forEach(img => {
        const baseName = img.getAttribute('data-base'); 
        const ext = img.getAttribute('data-ext') || 'png';
        const noMobile = img.getAttribute('data-no-mobile') === 'true';
        let newSrc = 'images/' + baseName; 
        if (isMobile && !noMobile) newSrc += '_mobile';
        
        const mode = img.getAttribute('data-mode');
        newSrc += mode ? `_${mode}` : (isDarkTheme ? '_dark' : '_light');
        newSrc += '.' + ext;
        
        if (img.src !== newSrc) {
            img.src = newSrc;
            // Если картинка уже в кеше (например, после предзагрузки), показываем сразу
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.onload = () => img.classList.add('loaded');
            }
        }
    });
}

function preloadThemeImages() {
    const isDark = document.body.classList.contains('dark-theme') || 
                (!document.body.classList.contains('light-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const isMobile = window.innerWidth < 768;

    themesData.forEach(item => {
        const img = new Image();
        let src = `images/${item.base}`;
        if (isMobile) src += '_mobile';
        src += `_${item.mode}.png`; // Для тем используем их встроенный mode
        img.src = src;
        
        // Когда картинка физически загрузилась в кеш, находим её в DOM и показываем
        img.onload = () => {
            const domImg = document.querySelector(`img[alt="${item.id}"]`);
            if (domImg) domImg.classList.add('loaded');
        };
    });
}

window.addEventListener('load', function() {
    document.getElementById('preloader').style.opacity = '0';
    setTimeout(() => document.getElementById('preloader').style.visibility = 'hidden', 500);
});

window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    
    // Scroll Arrow (Стрелка)
    const arrow = document.getElementById('scroll-arrow');
    if (arrow) {
        if (scrolled > 50) arrow.classList.add('hidden'); 
        else arrow.classList.remove('hidden');
    }

    // Easter Egg (Пасхалка)
    if (scrolled > 100 && typeof easterEggActive !== 'undefined' && easterEggActive) {
        easterEggActive = false;
        if (typeof easterEggTimer !== 'undefined') clearTimeout(easterEggTimer);
        const greeting = document.getElementById('hero-random-greeting');
        if (greeting && typeof initialGreetingText !== 'undefined') {
            greeting.textContent = initialGreetingText;
            greeting.style.opacity = '1';
        }
    }
    
});

function openLightbox(wrapper) {
    if (window.innerWidth < 992) return;
    const img = wrapper.querySelector('img');
    if (img) { lightboxImg.src = img.currentSrc || img.src; lightbox.classList.add('active'); }
}
function closeLightbox() { lightbox.classList.remove('active'); }
lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

applyLanguage(userLang);
setHeroGreeting();
renderCarousels();
updateImages();
initFooterAnimation(); 

darkModeQuery.addEventListener('change', updateImages);
window.addEventListener('resize', updateImages);

function checkTableScroll() {
    if (!tableArea) return;
    
    // Погрешность в 1px для точности на разных экранах
    const maxScrollLeft = tableArea.scrollWidth - tableArea.clientWidth - 1;
    
    // Если скроллить некуда (на ПК), скрываем всё
    if (maxScrollLeft <= 0) {
        hintLeft.classList.add('hidden');
        hintRight.classList.add('hidden');
        return;
    }

    // Логика левой стрелки
    if (tableArea.scrollLeft > 5) {
        hintLeft.classList.remove('hidden');
    } else {
        hintLeft.classList.add('hidden');
    }

    // Логика правой стрелки
    if (tableArea.scrollLeft < maxScrollLeft) {
        hintRight.classList.remove('hidden');
    } else {
        hintRight.classList.add('hidden');
    }
}

function scrollTable(direction) {
    if (!tableArea) return;
    const scrollAmount = 200; // На сколько пикселей скроллить при клике
    if (direction === 'left') {
        tableArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        tableArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

if (tableArea) {
    tableArea.addEventListener('scroll', checkTableScroll);
    window.addEventListener('resize', checkTableScroll);
    window.addEventListener('load', checkTableScroll);
}

function initTheme() {
    const savedTheme = localStorage.getItem('visutype_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const icon = document.getElementById('theme-icon');
    
    // Логика: если сохранено 'dark' ИЛИ (ничего не сохранено, но система темная) -> Темная
    let isDark = false;
    if (savedTheme === 'dark') isDark = true;
    else if (savedTheme === 'light') isDark = false;
    else if (systemDark) isDark = true;

    // Применяем классы
    if (isDark) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        if(icon) icon.src = 'images/light_theme.png'; // Иконка Солнца (переключить на светлую)
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        if(icon) icon.src = 'images/dark_theme.png'; // Иконка Луны (переключить на темную)
    }
}

function toggleTheme() {
    // Проверяем текущий активный класс
    const isDarkCurrently = document.body.classList.contains('dark-theme');
    
    if (isDarkCurrently) {
        // Была темная -> Сохраняем светлую
        localStorage.setItem('visutype_theme', 'light');
    } else {
        // Была светлая -> Сохраняем темную
        localStorage.setItem('visutype_theme', 'dark');
    }
    
    // ПЕРЕЗАГРУЗКА ДЛЯ ПРИМЕНЕНИЯ ВСЕХ КАРТИНОК
    location.reload();
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}
