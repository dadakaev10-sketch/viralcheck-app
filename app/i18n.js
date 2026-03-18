export const translations = {
  de: {
    // Header
    newImage: '← Neues Bild',
    badgeLabel: '',

    // Hero
    heroBadge: '',
    heroLine1: 'Geht dein Post',
    heroLine2: 'viral?',
    heroSub: 'KI analysiert Viral-Potenzial, Caption & Hashtags.',

    // Categories
    categories: [
      { label: '☕ Food',       value: 'Food' },
      { label: '👗 Fashion',    value: 'Fashion' },
      { label: '🌿 Lifestyle',  value: 'Lifestyle' },
      { label: '💪 Fitness',    value: 'Fitness' },
      { label: '✈️ Travel',     value: 'Travel' },
      { label: '💼 Business',   value: 'Business' },
      { label: '✨ Luxury',     value: 'Luxury' },
    ],

    // Upload zone
    uploadTitle: 'Bild auswählen',
    uploadDrag:  'oder hierher ziehen',
    uploadBtn:   'Datei auswählen',
    uploadHint:  'JPG, PNG, WEBP · max. 10 MB',

    // Analyze
    analyzeBtn: '✨ Jetzt analysieren →',

    // Loading
    loadingTitle: 'Analyse läuft…',
    loadingSub:   'KI analysiert dein Bild',
    loadingSteps: [
      'Bild erkannt & verarbeitet',
      'Komposition & Bildqualität analysieren…',
      'Trend-Abgleich mit aktuellen Daten…',
      'Caption & Hashtags generieren…',
    ],

    // Image card labels
    file:      'Datei',
    platform:  'Plattform',
    category:  'Kategorie',
    reanalyze: '↺ Neu analysieren',

    // Viral score
    viralScore: 'Viral-Score',
    avgReach:   'Ø Reichweite:',
    top:        '🚀 Top-Potenzial!',
    good:       '⚡ Gutes Potenzial',
    weak:       '⚠️ Verbesserung nötig',

    // Score bars
    categoryAnalysis:    'Kategorie-Auswertung',
    imageQuality:        'Bildqualität',
    hookFactor:          'Hook-Faktor',
    trendRelevance:      'Trend-Relevanz',
    engagementPotential: 'Engagement-Potenzial',

    // Feedback
    whatIsGood:   '✅ Was gut ist',
    whatToImprove:'⚠️ Was verbessern',

    // Timing
    bestTime:    'Beste Posting-Zeit',
    trendWindow: 'Trend-Fenster',

    // Quick flags
    quickRating:   'Schnellbewertung',
    imageContent:  'Bildinhalt',
    personVisible: 'Person sichtbar',
    textOverlay:   'Text-Overlay',
    yes:     'Ja ✓',
    no:      'Nein ⚠️',
    present: 'Vorhanden ✓',
    missing: 'Fehlt ⚠️',

    // Tabs
    tabAnalysis: '📊 Analyse',
    tabCaption:  '✍️ Caption',
    tabHashtags: '#️⃣ Hashtags',

    // Captions
    captionCasual: 'Locker 😊',
    captionStory:  'Storytelling 📖',
    captionCTA:    'Call-to-Action 🎯',
    characters:    'Zeichen',

    // Hashtags
    hashtagTipBold: 'Mix empfohlen:',
    hashtagTipText: '3 Trending + 5 Nische + 5 Micro',
    hTrending:      '🔥 Trending',
    hNiche:         '🎯 Nische',
    hMicro:         '💎 Micro',
    hTrendingReach: '1M–50M Posts',
    hNicheReach:    '100K–1M Posts',
    hMicroReach:    '10K–100K Posts',
    copyAllTags:    (n) => `⎘ Alle ${n} Hashtags kopieren`,
    allCopied:      '✓ Alle kopiert!',

    // Copy button
    copy:   '⎘ Kopieren',
    copied: '✓ Kopiert!',

    // PWA banner
    pwaTitle:   'App installieren',
    pwaSub:     'Zum Homescreen hinzufügen',
    pwaBtn:     'Installieren',
    pwaDismiss: 'Nicht jetzt',
  },

  // ─────────────────────────────────────────────────────
  en: {
    newImage:   '← New Image',
    badgeLabel: 'X.AI',

    heroBadge: '✨ X.AI Vision',
    heroLine1: 'Will your post',
    heroLine2: 'go viral?',
    heroSub:   'AI analyzes viral potential, captions & hashtags.',

    categories: [
      { label: '☕ Food',       value: 'Food' },
      { label: '👗 Fashion',    value: 'Fashion' },
      { label: '🌿 Lifestyle',  value: 'Lifestyle' },
      { label: '💪 Fitness',    value: 'Fitness' },
      { label: '✈️ Travel',     value: 'Travel' },
      { label: '💼 Business',   value: 'Business' },
      { label: '✨ Luxury',     value: 'Luxury' },
    ],

    uploadTitle: 'Select image',
    uploadDrag:  'or drag here',
    uploadBtn:   'Choose file',
    uploadHint:  'JPG, PNG, WEBP · max. 10 MB',

    analyzeBtn: '✨ Analyze now →',

    loadingTitle: 'Analyzing…',
    loadingSub:   'AI is analyzing your image',
    loadingSteps: [
      'Image detected & processed',
      'Analyzing composition & quality…',
      'Matching current trends…',
      'Generating captions & hashtags…',
    ],

    file:      'File',
    platform:  'Platform',
    category:  'Category',
    reanalyze: '↺ Re-analyze',

    viralScore: 'Viral Score',
    avgReach:   'Avg. Reach:',
    top:        '🚀 Top Potential!',
    good:       '⚡ Good Potential',
    weak:       '⚠️ Needs Improvement',

    categoryAnalysis:    'Category Analysis',
    imageQuality:        'Image Quality',
    hookFactor:          'Hook Factor',
    trendRelevance:      'Trend Relevance',
    engagementPotential: 'Engagement Potential',

    whatIsGood:    "✅ What's good",
    whatToImprove: '⚠️ What to improve',

    bestTime:    'Best Posting Time',
    trendWindow: 'Trend Window',

    quickRating:   'Quick Rating',
    imageContent:  'Image Content',
    personVisible: 'Person visible',
    textOverlay:   'Text Overlay',
    yes:     'Yes ✓',
    no:      'No ⚠️',
    present: 'Present ✓',
    missing: 'Missing ⚠️',

    tabAnalysis: '📊 Analysis',
    tabCaption:  '✍️ Caption',
    tabHashtags: '#️⃣ Hashtags',

    captionCasual: 'Casual 😊',
    captionStory:  'Storytelling 📖',
    captionCTA:    'Call-to-Action 🎯',
    characters:    'chars',

    hashtagTipBold: 'Mix recommended:',
    hashtagTipText: '3 Trending + 5 Niche + 5 Micro',
    hTrending:      '🔥 Trending',
    hNiche:         '🎯 Niche',
    hMicro:         '💎 Micro',
    hTrendingReach: '1M–50M Posts',
    hNicheReach:    '100K–1M Posts',
    hMicroReach:    '10K–100K Posts',
    copyAllTags:    (n) => `⎘ Copy all ${n} hashtags`,
    allCopied:      '✓ All copied!',

    copy:   '⎘ Copy',
    copied: '✓ Copied!',

    pwaTitle:   'Install App',
    pwaSub:     'Add to home screen',
    pwaBtn:     'Install',
    pwaDismiss: 'Not now',
  },

  // ─────────────────────────────────────────────────────
  ru: {
    newImage:   '← Новое фото',
    badgeLabel: 'X.AI',

    heroBadge: '✨ X.AI Vision',
    heroLine1: 'Станет ли твой пост',
    heroLine2: 'вирусным?',
    heroSub:   'ИИ анализирует вирусный потенциал, подписи и хэштеги.',

    categories: [
      { label: '☕ Еда',          value: 'Food' },
      { label: '👗 Мода',         value: 'Fashion' },
      { label: '🌿 Лайфстайл',    value: 'Lifestyle' },
      { label: '💪 Фитнес',       value: 'Fitness' },
      { label: '✈️ Путешествия',  value: 'Travel' },
      { label: '💼 Бизнес',       value: 'Business' },
    ],

    uploadTitle: 'Выберите изображение',
    uploadDrag:  'или перетащите сюда',
    uploadBtn:   'Выбрать файл',
    uploadHint:  'JPG, PNG, WEBP · макс. 10 МБ',

    analyzeBtn: '✨ Анализировать →',

    loadingTitle: 'Анализ…',
    loadingSub:   'ИИ анализирует изображение',
    loadingSteps: [
      'Изображение получено и обработано',
      'Анализ композиции и качества…',
      'Сравнение с актуальными трендами…',
      'Генерация подписей и хэштегов…',
    ],

    file:      'Файл',
    platform:  'Платформа',
    category:  'Категория',
    reanalyze: '↺ Новый анализ',

    viralScore: 'Вирусный балл',
    avgReach:   'Ср. охват:',
    top:        '🚀 Топ-потенциал!',
    good:       '⚡ Хороший потенциал',
    weak:       '⚠️ Нужно улучшение',

    categoryAnalysis:    'Анализ по категориям',
    imageQuality:        'Качество фото',
    hookFactor:          'Хук-фактор',
    trendRelevance:      'Трендовость',
    engagementPotential: 'Вовлечённость',

    whatIsGood:    '✅ Что хорошо',
    whatToImprove: '⚠️ Что улучшить',

    bestTime:    'Лучшее время публикации',
    trendWindow: 'Трендовое окно',

    quickRating:   'Быстрая оценка',
    imageContent:  'Содержание фото',
    personVisible: 'Человек виден',
    textOverlay:   'Текст на фото',
    yes:     'Да ✓',
    no:      'Нет ⚠️',
    present: 'Есть ✓',
    missing: 'Нет ⚠️',

    tabAnalysis: '📊 Анализ',
    tabCaption:  '✍️ Подписи',
    tabHashtags: '#️⃣ Хэштеги',

    captionCasual: 'Легко 😊',
    captionStory:  'История 📖',
    captionCTA:    'Призыв к действию 🎯',
    characters:    'симв.',

    hashtagTipBold: 'Рекомендуем микс:',
    hashtagTipText: '3 Тренд + 5 Ниша + 5 Микро',
    hTrending:      '🔥 Тренды',
    hNiche:         '🎯 Ниша',
    hMicro:         '💎 Микро',
    hTrendingReach: '1М–50М публикаций',
    hNicheReach:    '100К–1М публикаций',
    hMicroReach:    '10К–100К публикаций',
    copyAllTags:    (n) => `⎘ Скопировать все ${n} хэштегов`,
    allCopied:      '✓ Все скопированы!',

    copy:   '⎘ Копировать',
    copied: '✓ Скопировано!',

    pwaTitle:   'Установить приложение',
    pwaSub:     'Добавить на главный экран',
    pwaBtn:     'Установить',
    pwaDismiss: 'Не сейчас',
  },
};
