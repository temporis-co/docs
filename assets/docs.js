/* Temporis Docs — shared client runtime.
   Renders the chrome (sidebar, TOC, code tabs, copy, search, theme, pager)
   from a single nav manifest so every page stays consistent and there is no
   per-page boilerplate to maintain. Fully static — no build step. */

(function () {
  'use strict';

  // ---- Navigation manifest (single source of truth) --------------------
  // hrefs are written relative to the docs root; resolved per-page via base.
  const NAV = [
    {
      title: 'Get started',
      items: [
        { id: 'index', label: 'Introduction', href: 'index.html' },
        { id: 'quickstart', label: 'Quickstart', href: 'quickstart.html' },
      ],
    },
    {
      title: 'Concepts',
      items: [
        { id: 'concepts/how-it-works', label: 'How forecasting works', href: 'concepts/how-it-works.html' },
        { id: 'concepts/data-sources', label: 'Data sources', href: 'concepts/data-sources.html' },
        { id: 'concepts/data-profiles', label: 'Data profiles', href: 'concepts/data-profiles.html' },
        { id: 'concepts/predictions', label: 'Predictions & sampling', href: 'concepts/predictions.html' },
      ],
    },
    {
      title: 'API reference',
      items: [
        { id: 'api/authentication', label: 'Authentication', href: 'api/authentication.html' },
        { id: 'api/ingest', label: 'Ingest records', href: 'api/ingest.html' },
        { id: 'api/predict', label: 'Create prediction', href: 'api/predict.html' },
        { id: 'api/errors', label: 'Errors & status codes', href: 'api/errors.html' },
      ],
    },
    {
      title: 'Guides',
      items: [
        { id: 'guides/preparing-data', label: 'Preparing your data', href: 'guides/preparing-data.html' },
        { id: 'guides/tuning-profile', label: 'Tuning a data profile', href: 'guides/tuning-profile.html' },
        { id: 'guides/prediction-samples', label: 'Working with samples', href: 'guides/prediction-samples.html' },
      ],
    },
  ];

  const flat = NAV.flatMap((g) => g.items);
  const body = document.body;
  const base = body.getAttribute('data-base') || '';
  const current = body.getAttribute('data-page') || '';

  // ---- Chrome (sidebar + mobile topbar + scrim) ------------------------
  // Injected from JS so each content page carries no chrome boilerplate.
  const THEME_TOGGLE_HTML =
    '<button class="theme-toggle" type="button" aria-label="Toggle color theme" title="Toggle theme">' +
    '<svg class="theme-toggle-icon-light" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 1.75v2.1M8 12.15v2.1M3.58 3.58l1.48 1.48M10.94 10.94l1.48 1.48M1.75 8h2.1M12.15 8h2.1M3.58 12.42l1.48-1.48M10.94 5.06l1.48-1.48"/><circle cx="8" cy="8" r="2.75"/></svg>' +
    '<svg class="theme-toggle-icon-dark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9.82 1.24a.6.6 0 0 0-.75.75A5.6 5.6 0 0 1 2 9.07a.6.6 0 0 0-.75.75A6.85 6.85 0 1 0 9.82 1.24Z"/></svg>' +
    '</button>';

  function buildChrome() {
    const shell = document.querySelector('.docs-shell');
    const page = document.querySelector('.docs-page');
    if (!shell || !page) return;

    // Sidebar
    const sidebar = el('aside', 'docs-sidebar');
    sidebar.innerHTML =
      '<a class="docs-brand" href="' + base + 'index.html">' +
        '<span class="docs-brand-mark"><img src="' + base + 'assets/logo.svg" alt="" width="30" height="19"></span>' +
        '<span class="docs-brand-text"><span class="docs-brand-name">Temporis</span><span class="docs-brand-sub">Docs</span></span>' +
      '</a>' +
      '<div class="docs-search">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>' +
        '<input id="docs-search-input" type="search" placeholder="Search docs" autocomplete="off" spellcheck="false" aria-label="Search documentation">' +
        '<kbd>/</kbd>' +
      '</div>' +
      '<nav id="docs-nav" aria-label="Documentation"></nav>' +
      '<div class="docs-sidebar-foot">' +
        '<a class="dash-link" href="https://platform.temporis.co">Dashboard ↗</a>' +
        THEME_TOGGLE_HTML +
      '</div>';
    shell.insertBefore(sidebar, shell.firstChild);

    // Mobile scrim
    const scrim = el('div', 'nav-scrim');
    shell.insertBefore(scrim, shell.firstChild);

    // Mobile topbar (inside main column, above article)
    const topbar = el('div', 'docs-topbar');
    topbar.innerHTML =
      '<button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open navigation">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4h12M2 8h12M2 12h12"/></svg>' +
      '</button>' +
      '<a class="docs-mini-brand" href="' + base + 'index.html"><span class="docs-brand-mark"><img src="' + base + 'assets/logo.svg" alt="" width="26" height="16"></span>Temporis Docs</a>' +
      THEME_TOGGLE_HTML;
    page.insertBefore(topbar, page.firstChild);

    // Nav links
    const nav = document.getElementById('docs-nav');
    NAV.forEach((group) => {
      const g = el('div', 'docs-nav-group');
      const t = el('div', 'docs-nav-title');
      t.textContent = group.title;
      g.appendChild(t);
      group.items.forEach((item) => {
        const a = el('a', 'docs-nav-link');
        a.href = base + item.href;
        a.textContent = item.label;
        a.dataset.navId = item.id;
        if (item.id === current) a.classList.add('active');
        g.appendChild(a);
      });
      nav.appendChild(g);
    });
  }

  // ---- On-this-page TOC ------------------------------------------------
  function buildToc() {
    const toc = document.getElementById('docs-toc-list');
    const article = document.querySelector('.docs-article');
    if (!toc || !article) return;
    const headings = article.querySelectorAll('h2, h3');
    if (!headings.length) {
      const host = document.getElementById('docs-toc');
      if (host) host.style.display = 'none';
      return;
    }
    headings.forEach((h) => {
      if (!h.id) h.id = slug(h.textContent);
      // hover anchor
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

    // scroll spy
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
    if (prev) host.appendChild(pagerLink(prev, 'Previous', 'prev'));
    if (next) host.appendChild(pagerLink(next, 'Next', 'next'));
  }

  function pagerLink(item, dir, cls) {
    const a = el('a', 'pager-link ' + cls);
    a.href = base + item.href;
    const d = el('span', 'pager-dir');
    d.textContent = dir;
    const t = el('span', 'pager-title');
    t.textContent = item.label;
    a.appendChild(d);
    a.appendChild(t);
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
        const lang = block.getAttribute('data-lang') || 'Code';
        const btn = el('button', 'code-tab');
        btn.type = 'button';
        btn.textContent = lang;
        if (i !== 0) block.hidden = true;
        else btn.classList.add('active');
        btn.addEventListener('click', () => {
          blocks.forEach((b, j) => (b.hidden = j !== i));
          tabs.querySelectorAll('.code-tab').forEach((t, j) =>
            t.classList.toggle('active', j === i)
          );
          rememberLang(lang);
        });
        tabs.appendChild(btn);
      });
      group.insertBefore(tabs, group.firstChild);
    });
    restoreLang();
  }

  // Sync language choice across all multi-tab groups on the page.
  const LANG_KEY = 'temporis-docs-lang';
  function rememberLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang(lang);
  }
  function restoreLang() {
    let lang;
    try { lang = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (lang) applyLang(lang);
  }
  function applyLang(lang) {
    document.querySelectorAll('.code-group').forEach((group) => {
      const tabs = Array.from(group.querySelectorAll('.code-tab'));
      const blocks = Array.from(group.querySelectorAll('.code-block-wrap'));
      const i = tabs.findIndex((t) => t.textContent === lang);
      if (i === -1) return;
      tabs.forEach((t, j) => t.classList.toggle('active', j === i));
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
      item: i,
      text: (i.label + ' ' + i.id).toLowerCase(),
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
        haystack.filter((h) => h.text.includes(q)).map((h) => h.item.id)
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
      .replace(/\s+/g, '-');
  }

  // ---- boot ------------------------------------------------------------
  buildChrome();
  buildToc();
  buildPager();
  initCodeGroups();
  initCopyButtons();
  initSearch();
  initTheme();
  initMenu();
})();
