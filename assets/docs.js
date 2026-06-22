/* Temporis Docs — shared client runtime.
   Renders the chrome (sidebar, language switcher, TOC, code tabs, copy, search,
   theme, pager) from a single nav manifest + i18n table, so every page and every
   language stays consistent with no per-page boilerplate. Fully static — no build. */

(function () {
  'use strict';

  // ---- Supported languages (single source of truth) --------------------
  // `code` is the URL path prefix (/en/, /zh/, …). `dir` defaults to ltr.
  const LANGS = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
  ];
  const LANG_CODES = LANGS.map((l) => l.code);
  const DEFAULT_LANG = 'en';
  const LANG_KEY = 'temporis-lang';

  // ---- Navigation manifest (structure only; labels come from i18n) ------
  // hrefs are relative to the language root; resolved per-page via data-base.
  const NAV = [
    { key: 'getStarted', items: [
      { id: 'index', href: 'index.html' },
      { id: 'quickstart', href: 'quickstart.html' },
    ] },
    { key: 'concepts', items: [
      { id: 'concepts/how-it-works', href: 'concepts/how-it-works.html' },
      { id: 'concepts/data-sources', href: 'concepts/data-sources.html' },
      { id: 'concepts/data-profiles', href: 'concepts/data-profiles.html' },
      { id: 'concepts/predictions', href: 'concepts/predictions.html' },
    ] },
    { key: 'apiReference', items: [
      { id: 'api/authentication', href: 'api/authentication.html' },
      { id: 'api/ingest', href: 'api/ingest.html' },
      { id: 'api/predict', href: 'api/predict.html' },
      { id: 'api/errors', href: 'api/errors.html' },
    ] },
    { key: 'guides', items: [
      { id: 'guides/preparing-data', href: 'guides/preparing-data.html' },
      { id: 'guides/tuning-profile', href: 'guides/tuning-profile.html' },
      { id: 'guides/prediction-samples', href: 'guides/prediction-samples.html' },
    ] },
  ];

  // ---- Chrome translations (sidebar + UI strings) ----------------------
  // Article body text is translated in the per-language HTML files themselves;
  // this table only covers the JS-rendered chrome.
  const I18N = {
    en: {
      groups: { getStarted: 'Get started', concepts: 'Concepts', apiReference: 'API reference', guides: 'Guides' },
      nav: {
        'index': 'Introduction', 'quickstart': 'Quickstart',
        'concepts/how-it-works': 'How forecasting works', 'concepts/data-sources': 'Data sources',
        'concepts/data-profiles': 'Data profiles', 'concepts/predictions': 'Predictions & sampling',
        'api/authentication': 'Authentication', 'api/ingest': 'Ingest records',
        'api/predict': 'Create prediction', 'api/errors': 'Errors & status codes',
        'guides/preparing-data': 'Preparing your data', 'guides/tuning-profile': 'Tuning a data profile',
        'guides/prediction-samples': 'Working with samples',
      },
      ui: { brandSub: 'Docs', search: 'Search docs', searchAria: 'Search documentation', onThisPage: 'On this page',
            previous: 'Previous', next: 'Next', dashboard: 'Dashboard ↗', language: 'Language', noResults: 'No matches' },
    },
    zh: {
      groups: { getStarted: '开始使用', concepts: '核心概念', apiReference: 'API 参考', guides: '指南' },
      nav: {
        'index': '简介', 'quickstart': '快速开始',
        'concepts/how-it-works': '预测的工作原理', 'concepts/data-sources': '数据源',
        'concepts/data-profiles': '数据配置', 'concepts/predictions': '预测与采样',
        'api/authentication': '身份验证', 'api/ingest': '写入记录',
        'api/predict': '创建预测', 'api/errors': '错误与状态码',
        'guides/preparing-data': '准备数据', 'guides/tuning-profile': '调优数据配置',
        'guides/prediction-samples': '处理采样结果',
      },
      ui: { brandSub: '文档', search: '搜索文档', searchAria: '搜索文档', onThisPage: '本页目录',
            previous: '上一页', next: '下一页', dashboard: '控制台 ↗', language: '语言', noResults: '没有匹配项' },
    },
    es: {
      groups: { getStarted: 'Primeros pasos', concepts: 'Conceptos', apiReference: 'Referencia de la API', guides: 'Guías' },
      nav: {
        'index': 'Introducción', 'quickstart': 'Inicio rápido',
        'concepts/how-it-works': 'Cómo funciona la predicción', 'concepts/data-sources': 'Fuentes de datos',
        'concepts/data-profiles': 'Perfiles de datos', 'concepts/predictions': 'Predicciones y muestreo',
        'api/authentication': 'Autenticación', 'api/ingest': 'Ingerir registros',
        'api/predict': 'Crear una predicción', 'api/errors': 'Errores y códigos de estado',
        'guides/preparing-data': 'Preparar tus datos', 'guides/tuning-profile': 'Ajustar un perfil de datos',
        'guides/prediction-samples': 'Trabajar con muestras',
      },
      ui: { brandSub: 'Docs', search: 'Buscar en la documentación', searchAria: 'Buscar en la documentación', onThisPage: 'En esta página',
            previous: 'Anterior', next: 'Siguiente', dashboard: 'Panel ↗', language: 'Idioma', noResults: 'Sin coincidencias' },
    },
    fr: {
      groups: { getStarted: 'Premiers pas', concepts: 'Concepts', apiReference: "Référence de l'API", guides: 'Guides' },
      nav: {
        'index': 'Introduction', 'quickstart': 'Démarrage rapide',
        'concepts/how-it-works': 'Comment fonctionne la prévision', 'concepts/data-sources': 'Sources de données',
        'concepts/data-profiles': 'Profils de données', 'concepts/predictions': 'Prédictions et échantillonnage',
        'api/authentication': 'Authentification', 'api/ingest': 'Ingérer des enregistrements',
        'api/predict': 'Créer une prédiction', 'api/errors': 'Erreurs et codes de statut',
        'guides/preparing-data': 'Préparer vos données', 'guides/tuning-profile': 'Régler un profil de données',
        'guides/prediction-samples': 'Exploiter les échantillons',
      },
      ui: { brandSub: 'Docs', search: 'Rechercher dans la doc', searchAria: 'Rechercher dans la documentation', onThisPage: 'Sur cette page',
            previous: 'Précédent', next: 'Suivant', dashboard: 'Tableau de bord ↗', language: 'Langue', noResults: 'Aucun résultat' },
    },
    de: {
      groups: { getStarted: 'Erste Schritte', concepts: 'Konzepte', apiReference: 'API-Referenz', guides: 'Anleitungen' },
      nav: {
        'index': 'Einführung', 'quickstart': 'Schnellstart',
        'concepts/how-it-works': 'So funktioniert die Prognose', 'concepts/data-sources': 'Datenquellen',
        'concepts/data-profiles': 'Datenprofile', 'concepts/predictions': 'Vorhersagen & Sampling',
        'api/authentication': 'Authentifizierung', 'api/ingest': 'Datensätze senden',
        'api/predict': 'Vorhersage erstellen', 'api/errors': 'Fehler & Statuscodes',
        'guides/preparing-data': 'Daten vorbereiten', 'guides/tuning-profile': 'Datenprofil abstimmen',
        'guides/prediction-samples': 'Mit Stichproben arbeiten',
      },
      ui: { brandSub: 'Docs', search: 'Docs durchsuchen', searchAria: 'Dokumentation durchsuchen', onThisPage: 'Auf dieser Seite',
            previous: 'Zurück', next: 'Weiter', dashboard: 'Dashboard ↗', language: 'Sprache', noResults: 'Keine Treffer' },
    },
    ja: {
      groups: { getStarted: 'はじめに', concepts: 'コンセプト', apiReference: 'API リファレンス', guides: 'ガイド' },
      nav: {
        'index': '概要', 'quickstart': 'クイックスタート',
        'concepts/how-it-works': '予測の仕組み', 'concepts/data-sources': 'データソース',
        'concepts/data-profiles': 'データプロファイル', 'concepts/predictions': '予測とサンプリング',
        'api/authentication': '認証', 'api/ingest': 'レコードの取り込み',
        'api/predict': '予測の作成', 'api/errors': 'エラーとステータスコード',
        'guides/preparing-data': 'データの準備', 'guides/tuning-profile': 'データプロファイルの調整',
        'guides/prediction-samples': 'サンプルの活用',
      },
      ui: { brandSub: 'ドキュメント', search: 'ドキュメントを検索', searchAria: 'ドキュメントを検索', onThisPage: 'このページの内容',
            previous: '前へ', next: '次へ', dashboard: 'ダッシュボード ↗', language: '言語', noResults: '一致なし' },
    },
    ko: {
      groups: { getStarted: '시작하기', concepts: '개념', apiReference: 'API 참조', guides: '가이드' },
      nav: {
        'index': '소개', 'quickstart': '빠른 시작',
        'concepts/how-it-works': '예측의 작동 방식', 'concepts/data-sources': '데이터 소스',
        'concepts/data-profiles': '데이터 프로필', 'concepts/predictions': '예측과 샘플링',
        'api/authentication': '인증', 'api/ingest': '레코드 수집',
        'api/predict': '예측 생성', 'api/errors': '오류 및 상태 코드',
        'guides/preparing-data': '데이터 준비하기', 'guides/tuning-profile': '데이터 프로필 튜닝',
        'guides/prediction-samples': '샘플 활용하기',
      },
      ui: { brandSub: '문서', search: '문서 검색', searchAria: '문서 검색', onThisPage: '이 페이지에서',
            previous: '이전', next: '다음', dashboard: '대시보드 ↗', language: '언어', noResults: '일치 항목 없음' },
    },
    pt: {
      groups: { getStarted: 'Comece aqui', concepts: 'Conceitos', apiReference: 'Referência da API', guides: 'Guias' },
      nav: {
        'index': 'Introdução', 'quickstart': 'Início rápido',
        'concepts/how-it-works': 'Como a previsão funciona', 'concepts/data-sources': 'Fontes de dados',
        'concepts/data-profiles': 'Perfis de dados', 'concepts/predictions': 'Previsões e amostragem',
        'api/authentication': 'Autenticação', 'api/ingest': 'Enviar registros',
        'api/predict': 'Criar uma previsão', 'api/errors': 'Erros e códigos de status',
        'guides/preparing-data': 'Preparando seus dados', 'guides/tuning-profile': 'Ajustando um perfil de dados',
        'guides/prediction-samples': 'Trabalhando com amostras',
      },
      ui: { brandSub: 'Docs', search: 'Pesquisar na documentação', searchAria: 'Pesquisar na documentação', onThisPage: 'Nesta página',
            previous: 'Anterior', next: 'Próximo', dashboard: 'Painel ↗', language: 'Idioma', noResults: 'Nenhum resultado' },
    },
    ru: {
      groups: { getStarted: 'Начало работы', concepts: 'Концепции', apiReference: 'Справочник API', guides: 'Руководства' },
      nav: {
        'index': 'Введение', 'quickstart': 'Быстрый старт',
        'concepts/how-it-works': 'Как работает прогнозирование', 'concepts/data-sources': 'Источники данных',
        'concepts/data-profiles': 'Профили данных', 'concepts/predictions': 'Прогнозы и сэмплирование',
        'api/authentication': 'Аутентификация', 'api/ingest': 'Запись данных',
        'api/predict': 'Создание прогноза', 'api/errors': 'Ошибки и коды состояния',
        'guides/preparing-data': 'Подготовка данных', 'guides/tuning-profile': 'Настройка профиля данных',
        'guides/prediction-samples': 'Работа с сэмплами',
      },
      ui: { brandSub: 'Документация', search: 'Поиск по документации', searchAria: 'Поиск по документации', onThisPage: 'На этой странице',
            previous: 'Назад', next: 'Далее', dashboard: 'Панель ↗', language: 'Язык', noResults: 'Ничего не найдено' },
    },
    hi: {
      groups: { getStarted: 'शुरू करें', concepts: 'अवधारणाएँ', apiReference: 'API संदर्भ', guides: 'गाइड' },
      nav: {
        'index': 'परिचय', 'quickstart': 'क्विकस्टार्ट',
        'concepts/how-it-works': 'पूर्वानुमान कैसे काम करता है', 'concepts/data-sources': 'डेटा स्रोत',
        'concepts/data-profiles': 'डेटा प्रोफ़ाइल', 'concepts/predictions': 'पूर्वानुमान और सैम्पलिंग',
        'api/authentication': 'प्रमाणीकरण', 'api/ingest': 'रिकॉर्ड भेजें',
        'api/predict': 'पूर्वानुमान बनाएँ', 'api/errors': 'त्रुटियाँ और स्टेटस कोड',
        'guides/preparing-data': 'अपना डेटा तैयार करें', 'guides/tuning-profile': 'डेटा प्रोफ़ाइल ट्यून करें',
        'guides/prediction-samples': 'सैम्पल के साथ काम करना',
      },
      ui: { brandSub: 'दस्तावेज़', search: 'दस्तावेज़ खोजें', searchAria: 'दस्तावेज़ खोजें', onThisPage: 'इस पृष्ठ पर',
            previous: 'पिछला', next: 'अगला', dashboard: 'डैशबोर्ड ↗', language: 'भाषा', noResults: 'कोई मेल नहीं' },
    },
    ar: {
      groups: { getStarted: 'البداية', concepts: 'المفاهيم', apiReference: 'مرجع الـ API', guides: 'الأدلة' },
      nav: {
        'index': 'مقدمة', 'quickstart': 'البدء السريع',
        'concepts/how-it-works': 'كيف يعمل التنبؤ', 'concepts/data-sources': 'مصادر البيانات',
        'concepts/data-profiles': 'ملفات البيانات', 'concepts/predictions': 'التنبؤات وأخذ العينات',
        'api/authentication': 'المصادقة', 'api/ingest': 'إدخال السجلات',
        'api/predict': 'إنشاء تنبؤ', 'api/errors': 'الأخطاء ورموز الحالة',
        'guides/preparing-data': 'تحضير بياناتك', 'guides/tuning-profile': 'ضبط ملف البيانات',
        'guides/prediction-samples': 'العمل مع العينات',
      },
      ui: { brandSub: 'الوثائق', search: 'ابحث في الوثائق', searchAria: 'ابحث في الوثائق', onThisPage: 'في هذه الصفحة',
            previous: 'السابق', next: 'التالي', dashboard: 'لوحة التحكم ↗', language: 'اللغة', noResults: 'لا توجد نتائج' },
    },
  };

  const body = document.body;
  const base = body.getAttribute('data-base') || '';
  const current = body.getAttribute('data-page') || '';

  // ---- Language detection & routing ------------------------------------
  function langFromPath() {
    const seg = location.pathname.split('/').filter(Boolean);
    return LANG_CODES.indexOf(seg[0]) !== -1 ? seg[0] : DEFAULT_LANG;
  }
  const lang = langFromPath();
  const t = I18N[lang] || I18N[DEFAULT_LANG];
  const langMeta = LANGS.find((l) => l.code === lang) || LANGS[0];

  // Apply lang + direction as early as possible.
  document.documentElement.lang = lang;
  document.documentElement.dir = langMeta.dir || 'ltr';
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

  // Swap the language segment of the current path, preserving the rest.
  function pathForLang(code) {
    const seg = location.pathname.split('/').filter(Boolean);
    if (LANG_CODES.indexOf(seg[0]) !== -1) seg[0] = code;
    else seg.unshift(code);
    let p = '/' + seg.join('/');
    if (location.pathname.endsWith('/')) p += '/';
    return p;
  }

  const flat = NAV.flatMap((g) => g.items);

  // ---- Chrome (sidebar + mobile topbar + scrim) ------------------------
  const THEME_TOGGLE_HTML =
    '<button class="theme-toggle" type="button" aria-label="Toggle color theme" title="Toggle theme">' +
    '<svg class="theme-toggle-icon-light" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 1.75v2.1M8 12.15v2.1M3.58 3.58l1.48 1.48M10.94 10.94l1.48 1.48M1.75 8h2.1M12.15 8h2.1M3.58 12.42l1.48-1.48M10.94 5.06l1.48-1.48"/><circle cx="8" cy="8" r="2.75"/></svg>' +
    '<svg class="theme-toggle-icon-dark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9.82 1.24a.6.6 0 0 0-.75.75A5.6 5.6 0 0 1 2 9.07a.6.6 0 0 0-.75.75A6.85 6.85 0 1 0 9.82 1.24Z"/></svg>' +
    '</button>';

  function langSwitcherHTML() {
    const opts = LANGS.map((l) =>
      '<a class="lang-option' + (l.code === lang ? ' active' : '') + '" role="menuitem" lang="' + l.code +
      '" href="' + pathForLang(l.code) + '">' + escapeHtml(l.name) + '</a>'
    ).join('');
    return (
      '<div class="lang-switcher">' +
        '<button class="lang-button" type="button" aria-haspopup="true" aria-expanded="false" title="' + escapeAttr(t.ui.language) + '">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M8 1.5c2 1.9 2 11.1 0 13M8 1.5c-2 1.9-2 11.1 0 13M1.7 6h12.6M1.7 10h12.6"/></svg>' +
          '<span class="lang-button-text">' + escapeHtml(langMeta.name) + '</span>' +
          '<svg class="lang-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>' +
        '</button>' +
        '<div class="lang-menu" role="menu">' + opts + '</div>' +
      '</div>'
    );
  }

  function buildChrome() {
    const shell = document.querySelector('.docs-shell');
    const page = document.querySelector('.docs-page');
    if (!shell || !page) return;

    const sidebar = el('aside', 'docs-sidebar');
    sidebar.innerHTML =
      '<a class="docs-brand" href="' + base + 'index.html">' +
        '<span class="docs-brand-mark"><img src="/assets/logo.svg" alt="" width="30" height="19"></span>' +
        '<span class="docs-brand-text"><span class="docs-brand-name">Temporis</span><span class="docs-brand-sub">' + escapeHtml(t.ui.brandSub) + '</span></span>' +
      '</a>' +
      '<div class="docs-search">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>' +
        '<input id="docs-search-input" type="search" placeholder="' + escapeAttr(t.ui.search) + '" autocomplete="off" spellcheck="false" aria-label="' + escapeAttr(t.ui.searchAria) + '">' +
        '<kbd>/</kbd>' +
      '</div>' +
      '<nav id="docs-nav" aria-label="' + escapeAttr(t.ui.searchAria) + '"></nav>' +
      '<div class="docs-sidebar-foot">' +
        langSwitcherHTML() +
        '<a class="dash-link" href="https://platform.temporis.co">' + escapeHtml(t.ui.dashboard) + '</a>' +
        THEME_TOGGLE_HTML +
      '</div>';
    shell.insertBefore(sidebar, shell.firstChild);

    const scrim = el('div', 'nav-scrim');
    shell.insertBefore(scrim, shell.firstChild);

    const topbar = el('div', 'docs-topbar');
    topbar.innerHTML =
      '<button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open navigation">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4h12M2 8h12M2 12h12"/></svg>' +
      '</button>' +
      '<a class="docs-mini-brand" href="' + base + 'index.html"><span class="docs-brand-mark"><img src="/assets/logo.svg" alt="" width="26" height="16"></span>Temporis ' + escapeHtml(t.ui.brandSub) + '</a>' +
      THEME_TOGGLE_HTML;
    page.insertBefore(topbar, page.firstChild);

    const nav = document.getElementById('docs-nav');
    NAV.forEach((group) => {
      const g = el('div', 'docs-nav-group');
      const title = el('div', 'docs-nav-title');
      title.textContent = t.groups[group.key] || group.key;
      g.appendChild(title);
      group.items.forEach((item) => {
        const a = el('a', 'docs-nav-link');
        a.href = base + item.href;
        a.textContent = t.nav[item.id] || item.id;
        a.dataset.navId = item.id;
        if (item.id === current) a.classList.add('active');
        g.appendChild(a);
      });
      nav.appendChild(g);
    });
  }

  // ---- Language switcher behavior --------------------------------------
  function initLangSwitcher() {
    const wrap = document.querySelector('.lang-switcher');
    if (!wrap) return;
    const btn = wrap.querySelector('.lang-button');
    const close = () => { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // ---- On-this-page TOC ------------------------------------------------
  function buildToc() {
    const toc = document.getElementById('docs-toc-list');
    const article = document.querySelector('.docs-article');
    if (!toc || !article) return;
    const titleEl = document.querySelector('.docs-toc-title');
    if (titleEl) titleEl.textContent = t.ui.onThisPage;
    const headings = article.querySelectorAll('h2, h3');
    if (!headings.length) {
      const host = document.getElementById('docs-toc');
      if (host) host.style.display = 'none';
      return;
    }
    headings.forEach((h) => {
      if (!h.id) h.id = slug(h.textContent);
      const anchor = el('a', 'heading-anchor');
      anchor.href = '#' + h.id;
      anchor.textContent = '#';
      anchor.setAttribute('aria-hidden', 'true');
      h.appendChild(anchor);

      const a = el('a', h.tagName === 'H3' ? 'h3' : 'h2');
      a.href = '#' + h.id;
      a.textContent = stripAnchor(h);
      a.dataset.target = h.id;
      toc.appendChild(a);
    });

    const links = Array.from(toc.querySelectorAll('a'));
    const map = new Map(links.map((l) => [l.dataset.target, l]));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove('active'));
            const link = map.get(e.target.id);
            if (link) link.classList.add('active');
          }
        });
      },
      { rootMargin: '0px 0px -75% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  function stripAnchor(h) {
    const clone = h.cloneNode(true);
    const a = clone.querySelector('.heading-anchor');
    if (a) a.remove();
    return clone.textContent.trim();
  }

  // ---- Prev / next pager ----------------------------------------------
  function buildPager() {
    const host = document.getElementById('docs-pager');
    if (!host) return;
    const idx = flat.findIndex((i) => i.id === current);
    if (idx === -1) return;
    const prev = flat[idx - 1];
    const next = flat[idx + 1];
    if (prev) host.appendChild(pagerLink(prev, t.ui.previous, 'prev'));
    if (next) host.appendChild(pagerLink(next, t.ui.next, 'next'));
  }

  function pagerLink(item, dir, cls) {
    const a = el('a', 'pager-link ' + cls);
    a.href = base + item.href;
    const d = el('span', 'pager-dir');
    d.textContent = dir;
    const ti = el('span', 'pager-title');
    ti.textContent = t.nav[item.id] || item.id;
    a.appendChild(d);
    a.appendChild(ti);
    return a;
  }

  // ---- Code tabs -------------------------------------------------------
  function initCodeGroups() {
    document.querySelectorAll('.code-group').forEach((group) => {
      const blocks = Array.from(group.querySelectorAll('.code-block-wrap'));
      if (!blocks.length) return;
      const tabs = el('div', 'code-tabs');
      if (blocks.length === 1) group.classList.add('single');
      blocks.forEach((block, i) => {
        const codeLang = block.getAttribute('data-lang') || 'Code';
        const btn = el('button', 'code-tab');
        btn.type = 'button';
        btn.textContent = codeLang;
        if (i !== 0) block.hidden = true;
        else btn.classList.add('active');
        btn.addEventListener('click', () => {
          blocks.forEach((b, j) => (b.hidden = j !== i));
          tabs.querySelectorAll('.code-tab').forEach((tb, j) =>
            tb.classList.toggle('active', j === i)
          );
          rememberLang(codeLang);
        });
        tabs.appendChild(btn);
      });
      group.insertBefore(tabs, group.firstChild);
    });
    restoreLang();
  }

  // Sync the chosen programming language across all multi-tab groups.
  const CODE_LANG_KEY = 'temporis-docs-code-lang';
  function rememberLang(codeLang) {
    try { localStorage.setItem(CODE_LANG_KEY, codeLang); } catch (e) {}
    applyCodeLang(codeLang);
  }
  function restoreLang() {
    let codeLang;
    try { codeLang = localStorage.getItem(CODE_LANG_KEY); } catch (e) {}
    if (codeLang) applyCodeLang(codeLang);
  }
  function applyCodeLang(codeLang) {
    document.querySelectorAll('.code-group').forEach((group) => {
      const tabs = Array.from(group.querySelectorAll('.code-tab'));
      const blocks = Array.from(group.querySelectorAll('.code-block-wrap'));
      const i = tabs.findIndex((tb) => tb.textContent === codeLang);
      if (i === -1) return;
      tabs.forEach((tb, j) => tb.classList.toggle('active', j === i));
      blocks.forEach((b, j) => (b.hidden = j !== i));
    });
  }

  // ---- Copy buttons ----------------------------------------------------
  function initCopyButtons() {
    document.querySelectorAll('.code-block-wrap').forEach((wrap) => {
      if (wrap.querySelector('.code-copy-button')) return;
      const pre = wrap.querySelector('pre');
      if (!pre) return;
      const btn = el('button', 'code-copy-button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code');
      btn.setAttribute('title', 'Copy');
      btn.innerHTML =
        '<svg class="code-copy-icon-copy" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 2.75h6.25A1.75 1.75 0 0 1 14 4.5v8.25a1.75 1.75 0 0 1-1.75 1.75H6A1.75 1.75 0 0 1 4.25 12.75V4.5A1.75 1.75 0 0 1 6 2.75z"/><path d="M4.25 5.5h-1A1.75 1.75 0 0 0 1.5 7.25v5A1.75 1.75 0 0 0 3.25 14h5"/></svg>' +
        '<svg class="code-copy-icon-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5"/></svg>';
      let timer;
      btn.addEventListener('click', async () => {
        const text = pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          const r = document.createRange();
          r.selectNodeContents(pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
        }
        btn.classList.add('is-copied');
        btn.setAttribute('title', 'Copied');
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.setAttribute('title', 'Copy');
        }, 1100);
      });
      wrap.appendChild(btn);
    });
  }

  // ---- Search (filter nav) --------------------------------------------
  function initSearch() {
    const input = document.getElementById('docs-search-input');
    if (!input) return;
    const haystack = flat.map((i) => ({
      id: i.id,
      text: ((t.nav[i.id] || '') + ' ' + i.id).toLowerCase(),
    }));
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      const links = document.querySelectorAll('.docs-nav-link');
      const groups = document.querySelectorAll('.docs-nav-group');
      if (!q) {
        links.forEach((l) => (l.style.display = ''));
        groups.forEach((g) => (g.style.display = ''));
        return;
      }
      const matches = new Set(
        haystack.filter((h) => h.text.includes(q)).map((h) => h.id)
      );
      links.forEach((l) => {
        l.style.display = matches.has(l.dataset.navId) ? '' : 'none';
      });
      groups.forEach((g) => {
        const any = Array.from(g.querySelectorAll('.docs-nav-link')).some(
          (l) => l.style.display !== 'none'
        );
        g.style.display = any ? '' : 'none';
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) &&
          document.activeElement !== input) {
        e.preventDefault();
        body.classList.add('nav-open');
        input.focus();
        input.select();
      }
      if (e.key === 'Escape' && document.activeElement === input) {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.blur();
      }
    });
  }

  // ---- Theme toggle ----------------------------------------------------
  function initTheme() {
    const storageKey = 'temporis-theme';
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sys = () => (media.matches ? 'dark' : 'light');
    const cur = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = cur() === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        try {
          if (next === sys()) localStorage.removeItem(storageKey);
          else localStorage.setItem(storageKey, next);
        } catch (e) {}
      });
    });
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', () => {
        let stored;
        try { stored = localStorage.getItem(storageKey); } catch (e) {}
        if (stored !== 'light' && stored !== 'dark') {
          document.documentElement.dataset.theme = sys();
        }
      });
    }
  }

  // ---- Mobile menu -----------------------------------------------------
  function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const scrim = document.querySelector('.nav-scrim');
    if (toggle) toggle.addEventListener('click', () => body.classList.toggle('nav-open'));
    if (scrim) scrim.addEventListener('click', () => body.classList.remove('nav-open'));
    document.querySelectorAll('#docs-nav .docs-nav-link').forEach((l) =>
      l.addEventListener('click', () => body.classList.remove('nav-open'))
    );
  }

  // ---- helpers ---------------------------------------------------------
  function el(tag, cls) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }
  function slug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ---- boot ------------------------------------------------------------
  buildChrome();
  initLangSwitcher();
  buildToc();
  buildPager();
  initCodeGroups();
  initCopyButtons();
  initSearch();
  initTheme();
  initMenu();
})();
