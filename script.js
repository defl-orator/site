function checkSubscription() {
    // Проверяем, есть ли пометка в кэше, что пользователь уже подписан
    if (localStorage.getItem('visutype_joined')) {
        const modal = document.getElementById('wishlist-modal');
        if (!modal) return;

        // 1. Находим элементы
        const toggle = modal.querySelector('.wishlist-toggle-wrapper');
        const inputs = modal.querySelector('.wishlist-input-group');
        const submitBtn = modal.querySelector('.wishlist-btn'); // Кнопка "Присоединиться" внутри модалки

        // 2. Скрываем ТОЛЬКО элементы ввода и переключатель
        if (toggle) toggle.style.display = 'none';
        if (inputs) inputs.style.display = 'none';

        // 3. Кнопку НЕ скрываем, а просто делаем визуально заблокированной
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'default';
            submitBtn.style.display = 'inline-flex'; // На случай, если она была скрыта
        }

        // 4. Показываем сообщение об успехе и ставим его на место инпутов
        const msg = document.getElementById('wishlist-msg');
        if (msg) {
            msg.style.display = 'block';
            msg.style.color = '#34C759';
            msg.style.fontSize = '1.2rem';
            msg.style.textAlign = 'center';
            msg.style.marginTop = '10px';
            msg.style.marginBottom = '25px'; // Добавляем отступ до кнопки
            msg.style.fontWeight = '600';
            msg.innerText = window.translations[window.userLang].wishlist_success;
            
            // Перемещаем сообщение прямо перед кнопкой (туда, где были инпуты)
            if (submitBtn && submitBtn.parentNode) {
                submitBtn.parentNode.insertBefore(msg, submitBtn);
            }
        }
    }
}
window.checkSubscription = checkSubscription;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

const savedLang = localStorage.getItem('visutype_lang');
const systemLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
let userLang = savedLang || systemLang; 
window.userLang = userLang;

let easterEggIndex = 0;
let easterEggTimer = null;
let easterEggActive = true;
let isFirstEasterEgg = true; 
let initialGreetingText = "";

const footerAssistants = ['images/vizy_assistant.png', 'images/alex_assistant.png', 'images/zhenya_assistant.png', 'images/valya_assistant.png'];
let currentFooterAsst = 0;

let ticking = false;

let currentContactType = 'email';

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
        
        comment_features: "Смотри, что ты сможешь делать! Здесь всё, чтобы твои идеи чувствовали себя как дома.",
        comment_custom: "Как насчёт того, чтобы переодеть приложение под своё настроение? Смотри какое оно бывает",
        comment_home_atmosphere: "Чувствуй себя как дома! Я буду на главном меню, чтобы создать уют и помочь тебе во всем.",
        comment_assistants: "А вот это мои друзья (и я). Возможно тебе приглянётся кто-то больше, чем я... 😪(😅)",
        comment_comparison: "А чем мы лучше других? Я тут табличку составил, старался по-честному оценить",
        comment_pricing: "Можешь пользоваться бесплатно, но если станешь Pro, то получишь всё наше добро 😊",
        comment_roadmap: "Мы только начинаем, поэтому смотри какой у нас есть план дальнейшего развития.",
        footer_news_head: 'Понравилось?',
        footer_news_desc: "Если зашло, то оставь свою почту. Я обязательно сообщу тебе, когда приложение станет доступным всем.",
        asst_bottom_disclaimer: "Мы все очень разные, поэтому советую подумать перед выбором своего помощника, чтобы опыт в приложении был на высшем уровне.",
        
        feat_1_title_suffix: " заметки", feat_1_desc: "Заметки, к которым ты привык — только удобнее и мощнее.",
        feat_2_plain_text: "Наглядные", feat_2_cap_1: "карты", feat_2_cap_2: "мыслей", feat_2_desc: "Строй идеи визуально: связи, ветки, персонализация — всё под рукой.",
        feat_3_rainbow: "Творческий", feat_3_suffix: " холст", feat_3_desc: "Для схем, формул, эскизов и идей, которые легче изобразить, чем описать.",
        wavy_title: "Гибкие",
        
        theme_head_1: "Выберите", theme_head_2: "свой стиль",
        comp_col_1: "Карты мыслей", comp_col_2: "Холсты", comp_col_3: "Кастомизация", comp_col_4: "Скорость", comp_col_5: "Минимализм", comp_col_6: "Ассистент",
        
        asst_alex_name: "Алекс", asst_alex_desc: "Это у нас самый скромняга и интеллигент. Если нужен минимум эмоций и краткость - то лучше, не найти.",
        asst_vizy_name: "Визя", asst_vizy_desc: "Ну ты меня уже знаешь. Меня тут за главного считают вроде. Так что если нужен дружественный совет или позитивный настрой, то я всегда к твоим услугам.",
        asst_zhenya_name: "Женя", asst_zhenya_desc: "Ох, ну что про него сказать... Кому-то он нравится, кому-то нет. Если ты любишь комедии про плохишей, то этот индивид удовлетворит твои потребности на 110%.",
        asst_valya_name: "Валя", asst_valya_desc: "Милее ассистента ты уже никогда не встретишь. Готовься к обилию теплоты, комплиментов и всего ми-ми-ми 🥰 (вызывает сильную привязанность).",
        
        theme_normal: "Стандартная", theme_normal_dark: "Стандартная тёмная",
        theme_soft: "Нежная", theme_soft_dark: "Нежная тёмная",
        theme_emerald: "Изумрудная", theme_emerald_dark: "Изумрудная тёмная",
        theme_space: "Космическая", theme_space_dark: "Космическая тёмная",
        theme_noir: "Нуарная", theme_noir_dark: "Нуарная тёмная",
        
        price_free_1: "Лучший удобный редактор заметок", price_free_2: "iCloud синхронизация заметок", price_free_3: "Базовые темы/палитры", price_free_4: "Импорт заметок из других приложений", price_free_5: "Базовый экспорт заметок / карт мыслей / холстов",
        price_pro_cost: "199 ₽ / мес",
        price_pro_1: "Всё, что в бесплатном", 
        price_pro_2: "Безлимитная кастомизация: карт мыслей / обложек / эмодзи / тем / иконок", 
        price_pro_3: "Ранний доступ к новым функциям", 
        price_pro_4: "Уникальные диалоги с ассистентами",
        price_pro_5: "Продвинутый экспорт заметок / холстов / карт мыслей",
        price_pro_6: "Создание сайта на основе заметки",
        
        road_head_1: "План развития",
        road_step_1: "Этап 1: MVP", road_item_1_date: "Сейчас", road_item_1_title: "macOS, iOS и iPadOS", road_item_1_desc: "Сначала — стабильность. Базовый редактор и хранение.", status_done: "Готово",
        road_step_2: "Этап 2: Экосистема", road_item_2_date: "Сейчас", road_item_2_title: "Облачная синхронизация", road_item_2_desc: "Потом — синхронизация. Бесшовная работа между устройствами.", status_dev: "В разработке",
        road_item_localization_date: "до 1 Июня 2026", road_item_localization_title: "Локализация", road_item_localization_desc: "Испанский, китайский, немецкий, японский и корейский языки.",
        road_item_3_date: "до 1 Июня 2026", road_item_3_title: "Релиз в App Store", road_item_3_desc: "Официальный выход приложения для широкой аудитории.", status_plan: "В планах",
        road_step_3: "Этап 3: Расширение", road_item_4_date: "до 1 Сент 2026", road_item_4_title: "Windows & Android", road_item_4_desc: "Затем — выход на все популярные платформы.",
        road_item_collab_date: "до конца 2026", road_item_collab_title: "Совместный режим", road_item_collab_desc: "Возможность работать над одной заметкой нескольким людям одновременно.",
        road_item_5_date: "до конца 2026", road_item_5_title: "Интеграции ИИ", road_item_5_desc: "И напоследок — ИИ-инструменты и локальная генерация.",
        
        comment_faq: "Остались вопросы? Я собрал самые частые из них и подготовил ответы!",
        
        faq_q1: "Где хранятся мои данные и есть ли синхронизация?",
        faq_a1: "Все твои заметки, карты мыслей и холсты хранятся на устройстве и автоматически синхронизируются через iCloud. Данные остаются исключительно в пределах твоего аккаунта Apple ID для максимальной конфиденциальности.",
        
        faq_q2: "Как работают карты мыслей и холсты внутри текста?",
        faq_a2: "Ты можешь вставлять их прямо в текстовую заметку как интерактивные блоки (нажав кнопку «Добавить»). Нажатие на такой блок открывает полноэкранный редактор. Карты мыслей поддерживают авто-расстановку и темы, а холсты — Apple Pencil.",
        
        faq_q3: "В чем особенность ИИ-Ассистента? Это просто чат-бот?",
        faq_a3: "Нет, я не обычный ИИ-бот. Я виртуальный компаньон, который живет в приложении. Я реагирую на твою активность (например, если ты долго пишешь что-то), слежу как часто ты ко мне заходишь, выдаю достижения и комментирую процесс. Почти как Большой брат 😅",
        
        faq_q4: "Могу ли я поделиться своей заметкой с друзьями?",
        faq_a4: "Да! Любую заметку (включая вложенные карты и холсты) можно экспортировать в красивый PDF. А если хочешь поделиться ссылкой, доступна функция «Опубликовать в Web», которая за пару секунд превратит заметку в веб-страницу.",
        
        faq_q5: "Нужен ли интернет для работы приложения?",
        faq_a5: "Приложение работает абсолютно автономно. Ты можешь создавать заметки, рисовать и строить карты мыслей без сети. Интернет потребуется только для синхронизации по iCloud и публикации заметок в Web.",
        legend_full: "полная реализация", legend_part: "частичная реализация", legend_none: "не реализовано",
        
        hero_return: "С возвращением! Продолжим?",
        hero_return_en: "Welcome back! Shall we continue?",

        nav_feat: "Возможности", nav_style: "Стиль", nav_price: "Цены", nav_roadmap: "План",

        footer_rights: "Все права защищены.",

        btn_wishlist: "Стань первооткрывателем",
        wishlist_title: "Стань первооткрывателем",
        wishlist_desc: "Напиши свой контакт, чтобы первым узнать о релизе и получить бонусы.",
        wishlist_placeholder: "Твоя почта...",
        wishlist_submit: "Присоединиться",
        wishlist_counter_text: "Уже ждут релиза: ",
        wishlist_success: "Готово! Мы сообщим тебе о релизе.",
        wishlist_error: "Ошибка. Проверь почту и попробуй снова.",
        why_title: "Почему мы?",
        why_lead: "Думаю, ты согласишься с тем, что приложения для продуктивности крайне сложные и запутанные. Наша цель это исправить, чтобы ты получал исключительно удовольствие и удобство от процесса обучения или работы.",
        toggle_email: "Почта",
        toggle_social: "Соцсеть",
        wishlist_social_placeholder: "@юзернейм...",
        why_problem: "Думаю, ты согласишься с тем, что приложения для продуктивности крайне сложные и запутанные.",
        why_solution: "Наша цель это исправить, чтобы ты получал исключительно удовольствие и удобство от процесса обучения или работы.",
        footer_tg_text: "Наш Telegram канал",
        price_pro_old: "399 ₽",
        price_pro_cost: "199 ₽ / мес",
        price_pro_pioneer: "Для первооткрывателей",
        wishlist_exists: "Этот контакт уже в списке первооткрывателей!"
    },
    en: {
            hero_home: "Your home for",
        word_1: "convenient", word_2: "cozy", word_3: "beautiful", word_4: "functional", word_5: "visual", hero_suffix: "notes",
        btn_telegram: "Try it out", btn_news: "Project News in Telegram", btn_open: "🔍 Open",
        
        comment_features: "Look what I can do! Everything to make your ideas feel at home.",
        comment_custom: "How about changing the app to suit your mood? See what it looks like.",
        comment_home_atmosphere: "Make yourself at home! I'll be on the main menu to make you feel welcome and help you with everything.",
        comment_assistants: "And these are my friends (and me). Maybe you'll like someone more than me... 😪(😅)",
        comment_comparison: "What makes us better than others? I made a table here, trying to give an honest assessment.",
        comment_pricing: "You can use it for free, but if you become Pro, you'll get all our goodies 😊",
        comment_roadmap: "We're just getting started, so take a look at our plan for further development.",
        footer_news_head: 'Liked what you saw?',
        footer_news_desc: "If you enjoyed it, please leave your email. I'll be sure to let you know when the app is available to everyone.",
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

        price_free_1: "The best user-friendly note editor", price_free_2: "iCloud note sync", price_free_3: "Basic themes/palettes", price_free_4: "Import notes from other apps", price_free_5: "Basic export for notes / mind maps / canvases",
        price_pro_cost: "$4.99 / month",
        price_pro_1: "Everything in Free", 
        price_pro_2: "Unlimited customization: mind maps / covers / emojis / themes / icons", 
        price_pro_3: "Early access to new features", 
        price_pro_4: "Unique assistant dialogues",
        price_pro_5: "Advanced export: notes / canvases / mind maps",
        price_pro_6: "Publish notes as websites",
        
        road_head_1: "Development Roadmap",
        road_step_1: "Stage 1: MVP", road_item_1_date: "Now", road_item_1_title: "macOS, iOS & iPadOS", road_item_1_desc: "First — stability. Basic editor and local storage.", status_done: "Done",
        road_step_2: "Stage 2: Ecosystem", road_item_2_date: "Now", road_item_2_title: "Cloud Sync", road_item_2_desc: "Then — sync. Seamless work between devices.", status_dev: "In progress",
        road_item_localization_date: "by June 1, 2026", road_item_localization_title: "Localization", road_item_localization_desc: "Spanish, Chinese, German, Japanese, and Korean languages.",
        road_item_3_date: "by June 1, 2026", road_item_3_title: "App Store Release", road_item_3_desc: "Official release for a wide audience.", status_plan: "Planned",
        road_step_3: "Stage 3: Expansion", road_item_4_date: "by Sept 1, 2026", road_item_4_title: "Windows & Android", road_item_4_desc: "Then — expansion to all popular platforms.",
        road_item_collab_date: "by end of 2026", road_item_collab_title: "Collaboration Mode", road_item_collab_desc: "Ability for multiple people to work on one note simultaneously.",
        road_item_5_date: "by end of 2026", road_item_5_title: "AI Integrations", road_item_5_desc: "Finally — AI tools and local generation.",
        
        comment_faq: "Any questions left? I've collected the most common ones and prepared the answers!",
        
        faq_q1: "Where is my data stored and is there cloud sync?",
        faq_a1: "All your notes, mind maps, and canvases are stored on your device and automatically synced via iCloud. Data remains exclusively within your Apple ID account for maximum privacy.",
        
        faq_q2: "How do mind maps and canvases work inside notes?",
        faq_a2: "You can insert them directly into a text note as interactive blocks (by clicking the «Add» button). Clicking on such a block opens a full-screen editor. Mind maps support auto-arrangement and themes, and canvases support the Apple Pencil.",
        
        faq_q3: "What makes the AI Assistant special? Is it just a chatbot?",
        faq_a3: "No, I'm not a regular AI bot. I'm a virtual companion that lives in the app. I react to your activity (for example, if you're writing for a long time), track how often you visit, give you achievements, and comment on your progress. Almost like Big Brother 😅",
        
        faq_q4: "Can I share my notes with friends or colleagues?",
        faq_a4: "Yes! Any note (including nested maps and canvases) can be exported as a beautiful PDF document. If you want to share a link, the 'Publish to Web' feature turns your note into a live webpage in seconds.",
        
        faq_q5: "Do I need an internet connection to use the app?",
        faq_a5: "The app works completely offline. You can create notes, draw, and build mind maps without a network connection. Internet is only required for iCloud sync and publishing notes to the Web.",
        legend_full: "fully implemented", legend_part: "partially implemented", legend_none: "not implemented",
        
        hero_return: "Welcome back! Shall we continue?",
        hero_return_en: "Welcome back! Shall we continue?",
        nav_feat: "Features", nav_style: "Style", nav_price: "Pricing", nav_roadmap: "Roadmap",
        footer_rights: "All rights reserved.",

        btn_wishlist: "Become a Pioneer",
        wishlist_title: "Become a Pioneer",
        wishlist_desc: "Leave your email to be the first to know about the release and get bonuses.",
        wishlist_placeholder: "Your email...",
        wishlist_submit: "Join now",
        wishlist_counter_text: "Already waiting: ",
        wishlist_success: "Success! We will notify you about the release.",
        wishlist_error: "Error. Please check your email and try again.",
        why_title: "Why us?",
        why_lead: "I think you'll agree that productivity apps are often complex and confusing. Our goal is to fix this so that you can get exceptional pleasure and convenience from the learning or work process.",
        toggle_email: "Email",
        toggle_social: "Social",
        wishlist_social_placeholder: "@username...",
        why_problem: "I think you'll agree that productivity apps are often complex and confusing.",
        why_solution: "Our goal is to fix this so that you can get exceptional pleasure and convenience from the learning or work process.",
        footer_tg_text: "Our Telegram channel",
        price_pro_old: "$7.99",
        price_pro_cost: "$4.99 / mo",
        price_pro_pioneer: "For Pioneers",
        wishlist_exists: "This contact is already on the pioneers list!"
    }
};

window.translations = translations;

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
    if (translations[lang]) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translations[lang][key];
            
            if (translation) {
                // Если это инпут (почта), меняем плейсхолдер
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    // Для всех остальных элементов меняем текст внутри
                    el.innerHTML = translation;
                }
            }
        });
        
        // Обновляем специфические вещи
        const wavyTitle = translations[lang].wavy_title || "Flexible";
        setupWavyText(wavyTitle);
        updateHeroBubbleText(lang); 
    }
}

function updateHeroBubbleText(lang) {
    const bubble = document.getElementById('hero-random-greeting');
    if (!bubble) return;

    const isReturningUser = localStorage.getItem('visutype_visited');
    
    // Если сейчас отображается пасхалка (easter egg), переводим её по индексу
    if (easterEggIndex > 0) {
        const phrases = lang === 'ru' ? easterEggPhrasesRu : easterEggPhrasesEn;
        // Берем последнюю сказанную фразу (индекс - 1)
        bubble.textContent = phrases[easterEggIndex - 1];
    } else {
        // Иначе переводим обычное приветствие
        if (isReturningUser) {
            bubble.textContent = translations[lang].hero_return;
        } else {
            bubble.textContent = randomGreetings[lang][0]; 
        }
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
    
    // === Очищаем контейнер от старых img перед созданием новых ===
    container.innerHTML = ''; 

    footerAssistants.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = `footer-asst-img ${i === 0 ? 'active' : ''}`;
        container.appendChild(img);
    });

    // Очищаем предыдущий интервал, если функция вызывается повторно
    if (window.footerInterval) clearInterval(window.footerInterval);

    window.footerInterval = setInterval(() => {
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

    const isReturningUser = localStorage.getItem('visutype_visited');
    localStorage.setItem('visutype_visited', 'true');

    const flightStartTime = isReturningUser ? 100 : 1200;

    // === ЭТАП 1: ПРИВЕТСТВИЕ ===
    requestAnimationFrame(() => {
        introVizy.style.opacity = '1';
        introVizy.style.transform = 'scale(1)';
        introVizy.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease';
    });

    if (!isReturningUser) {
        setTimeout(() => {
            if(introBubble) introBubble.classList.add('visible');
        }, 100);
    } else {
        if(introBubble) introBubble.style.display = 'none';
    }

    setTimeout(() => {
        if(introBubble && !isReturningUser) introBubble.classList.remove('visible');
        introVizy.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        introVizy.style.transform = 'scale(0.9)';
    }, Math.max(0, flightStartTime - 300));

    // === ЭТАП 2: ПОЛЕТ (Плавная дуга Безье) ===
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
        const targetScale = targetWidth / startWidth;

        // Перебиваем CSS, скрывая конечную цель до самого момента посадки
        targetVizy.style.transition = 'none';
        targetVizy.style.opacity = '0';

        introOverlay.style.background = 'transparent';
        document.body.classList.add('animation-done');
        updateImages(); 
        renderCarousels();
        preloadThemeImages();
        loadStaticImages();

        introVizy.style.transition = 'none';

        // Делаем полет быстрее (850 мс вместо 1200)
        const flightDuration = 850; 
        let startTime = null;

        // Точки кривой:
        const p0 = { x: 0, y: 0 }; 
        const p3 = { x: deltaX, y: deltaY };
        const p1 = { x: deltaX * 0.15, y: 150 };  // Резко ныряет вниз на старте
        const p2 = { x: deltaX * 0.75, y: deltaY - 120 }; // Плавно заходит на дугу выше цели

        function getBezierPoint(t, p0, p1, p2, p3) {
            const u = 1 - t;
            const tt = t * t, uu = u * u;
            const uuu = uu * u, ttt = tt * t;
            return (uuu * p0) + (3 * uu * t * p1) + (3 * u * tt * p2) + (ttt * p3);
        }

        // Максимальная скорость в начале, очень плавное торможение в конце
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animateFlight(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = (timestamp - startTime) / flightDuration;
            if (progress > 1) progress = 1;

            const t = easeOutCubic(progress);

            const currentX = getBezierPoint(t, p0.x, p1.x, p2.x, p3.x);
            const currentY = getBezierPoint(t, p0.y, p1.y, p2.y, p3.y);
            const currentScale = 0.9 + (targetScale - 0.9) * t;

            introVizy.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

            if (progress < 1) {
                // Если полет еще идет - рисуем следующий кадр
                requestAnimationFrame(animateFlight);
            } else {
                // === ЭТАП 3: ИДЕАЛЬНАЯ ПОСАДКА ===
                // Вызывается ровно в тот кадр, когда летящая картинка достигла цели
                targetVizy.style.opacity = '1';
                
                introVizy.style.opacity = '0';
                introVizy.style.display = 'none';
                
                document.body.classList.add('logo-landed');
                introOverlay.style.display = 'none';
            }
        }

        requestAnimationFrame(animateFlight);

    }, flightStartTime);
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    updateImages(document.querySelector('.navbar-wrapper'));
    updateImages(document.querySelector('.hero'));

    document.querySelector('.current-lang').textContent = userLang.toUpperCase();
    
    // Фразы и прочее
    const phrases = introPhrases[userLang] || introPhrases['en'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const bubbleTextEl = document.getElementById('intro-bubble-text');
    if (bubbleTextEl) bubbleTextEl.textContent = randomPhrase;

    setHeroGreeting();
    
    // Запускаем анимацию Визни
    runVizyAnimation();
    
    initFAQ();
    initFooterAnimation();
    initMarquee();
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
    userLang = lang; 
    window.userLang = lang; // Обновляем глобальную переменную для Firebase
    
    document.querySelector('.current-lang').textContent = lang.toUpperCase();
    applyLanguage(lang); // Мгновенный перевод
    renderCarousels(); // Обновление текста в каруселях
    initMarquee();
}

function updateImages(container = document) {
    const bodyIsDark = document.body.classList.contains('dark-theme');
    const bodyIsLight = document.body.classList.contains('light-theme');
    let isDarkTheme = bodyIsDark || (!bodyIsLight && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const isMobile = window.innerWidth < 768; 
    
    // Ищем картинки только внутри переданного контейнера
    container.querySelectorAll('img[data-base]').forEach(img => {
        const baseName = img.getAttribute('data-base'); 
        const ext = img.getAttribute('data-ext') || 'png';
        const noMobile = img.getAttribute('data-no-mobile') === 'true';
        let newSrc = 'images/' + baseName; 
        if (isMobile && !noMobile) newSrc += '_mobile';
        
        const mode = img.getAttribute('data-mode');
        newSrc += mode ? `_${mode}` : (isDarkTheme ? '_dark' : '_light');
        newSrc += '.' + ext;
        
        // Загружаем картинку
        if (img.src !== newSrc && !img.src.endsWith(newSrc)) {
            img.src = newSrc;
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

window.addEventListener('load', function() {
    const p = document.getElementById('preloader');
    if(p) {
        p.style.opacity = '0';
        setTimeout(() => p.style.visibility = 'hidden', 500);
    }
});

window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    
    // Объявляем переменные для стрелки глобально или в начале скрипта
    let arrowScrollTriggered = false;
    const scrollArrow = document.getElementById('scroll-arrow');
    let arrowHidePending = false; // Флаг: "нужно скрыть, когда анимация доиграет"

    if (scrollArrow) {
        // 1. Слушаем скролл
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                // Если прокрутили вниз — ставим флаг "скрыть позже"
                arrowHidePending = true;
            } else {
                // Если вернулись наверх — ОТМЕНЯЕМ флаг и ПОКАЗЫВАЕМ СРАЗУ
                arrowHidePending = false;
                scrollArrow.classList.remove('hidden');
            }
        });

        // 2. Слушаем каждый "круг" анимации (раз в 2 секунды)
        scrollArrow.addEventListener('animationiteration', () => {
            // Если флаг стоит — плавно скрываем стрелку
            if (arrowHidePending) {
                scrollArrow.classList.add('hidden');
            }
        });
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
    const isDarkCurrently = document.body.classList.contains('dark-theme');
    const icon = document.getElementById('theme-icon');
    
    if (isDarkCurrently) {
        localStorage.setItem('visutype_theme', 'light');
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        if(icon) icon.src = 'images/dark_theme.png';
    } else {
        localStorage.setItem('visutype_theme', 'dark');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        if(icon) icon.src = 'images/light_theme.png';
    }
    updateImages();
    preloadThemeImages();
}

// --- Функции для открытия/закрытия модалки Wishlist ---
function openWishlistModal() {
    document.getElementById('wishlist-modal').classList.add('active');
    checkSubscription(); 
}
function closeWishlistModal() {
    document.getElementById('wishlist-modal').classList.remove('active');
    document.getElementById('wishlist-msg').style.display = 'none'; // сброс сообщения
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

function loadStaticImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src'); // Убираем атрибут, чтобы не грузить повторно
    });
}

window.currentContactType = 'email'; // Глобальная переменная для Firebase

window.switchContactType = function(type) {
    window.currentContactType = type;
    const emailInput = document.getElementById('wishlist-email');
    const socialInput = document.getElementById('wishlist-social');
    const btns = document.querySelectorAll('.toggle-btn');
    
    btns.forEach(btn => {
        const isTarget = btn.getAttribute('onclick').includes(type);
        btn.classList.toggle('active', isTarget);
    });

    if (type === 'email') {
        emailInput.style.display = 'block';
        socialInput.style.display = 'none';
    } else {
        emailInput.style.display = 'none';
        socialInput.style.display = 'block';
    }
}

let marqueePos = 0;
let marqueeSpeed = 1; 
let targetSpeed = 1;
const acceleration = 0.05;

// Переменные для перетаскивания
let isDragging = false;
let startX = 0;
let scrollLeftAtStart = 0;

function initMarquee() {
    const track = document.getElementById('marquee-track');
    const viewport = document.getElementById('marquee-viewport');
    if (!track || !viewport) return;

    // 1. Рендерим контент (удваиваем для бесконечности)
    const items = [...themesData, ...themesData]; 
    track.innerHTML = items.map(item => `
        <div class="theme-marquee-item">
            <div class="img-wrapper" onclick="if(!isDragging) openLightbox(this)">
                <img src="images/${item.base}${window.innerWidth < 768 ? '_mobile' : ''}_${item.mode}.png" alt="${item.id}">
                <div class="img-overlay"><div class="open-btn" data-i18n="btn_open">🔍 Open</div></div>
            </div>
            <h3>${translations[userLang][item.nameKey]}</h3>
        </div>
    `).join('');

    function animate() {
        if (!isDragging) {
            // Плавное изменение скорости
            if (marqueeSpeed < targetSpeed) marqueeSpeed += acceleration;
            if (marqueeSpeed > targetSpeed) marqueeSpeed -= acceleration;

            marqueePos -= marqueeSpeed;

            // Бесшовный цикл (в обе стороны)
            const halfWidth = track.scrollWidth / 2;
            if (marqueePos <= -halfWidth) marqueePos = 0;
            if (marqueePos > 0) marqueePos = -halfWidth;
        }

        track.style.transform = `translateX(${marqueePos}px)`;
        requestAnimationFrame(animate);
    }

    // --- ОБРАБОТКА СОБЫТИЙ ---

    // Остановка при наведении
    viewport.addEventListener('mouseenter', () => targetSpeed = 0);
    viewport.addEventListener('mouseleave', () => {
        if (!isDragging) targetSpeed = 1;
    });

    // НАЧАЛО перетаскивания
    const startDrag = (e) => {
        isDragging = true;
        targetSpeed = 0;
        marqueeSpeed = 0;
        startX = (e.pageX || e.touches[0].pageX);
        scrollLeftAtStart = marqueePos;
    };

    // ПРОЦЕСС перетаскивания
    const moveDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX);
        const walk = (x - startX); // Дистанция сдвига
        marqueePos = scrollLeftAtStart + walk;
    };

    // КОНЕЦ перетаскивания
    const endDrag = () => {
        isDragging = false;
        targetSpeed = 1; // Возвращаем движение
    };

    // Мышь
    viewport.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    // Тач (мобилки)
    viewport.addEventListener('touchstart', startDrag);
    viewport.addEventListener('touchmove', moveDrag, { passive: false });
    viewport.addEventListener('touchend', endDrag);

    animate();
}