# Temporis Docs

Static developer documentation for the Temporis platform, intended for
`docs.temporis.co`. No build step — plain HTML, one shared CSS file, one shared
JS file. Localized into many languages and with multi-language code samples.

## Preview locally

```
cd docs
python3 -m http.server 8000
# open http://127.0.0.1:8000  (redirects to your browser language, e.g. /en/)
```

Serve from the `docs/` directory root: shared assets are referenced with
absolute paths (`/assets/…`) so they resolve the same at any page depth.

## Deploy

Upload the contents of `docs/` to any static host (S3 + CloudFront, Netlify,
nginx, GitHub Pages, …) **served at the domain root** and point
`docs.temporis.co` at it. `/index.html` is the entry point; it redirects each
visitor to their preferred language (saved choice → browser language → English).

## Structure

```
index.html              Root redirect → /<lang>/ (language detection)
en/                     English (source of truth)
  index.html              Landing page
  quickstart.html         5-minute end-to-end walkthrough
  concepts/               Teaching pages (how it works, data sources, profiles, predictions)
  api/                    Endpoint reference (auth, ingest, predict, errors)
  guides/                 Task-oriented how-tos
zh/ es/ fr/ de/ ja/     One folder per language, mirroring en/ exactly
ko/ pt/ ru/ hi/ ar/       (ar is right-to-left)
assets/
  docs.css              All styling + light/dark tokens + RTL rules
  docs.js               Shared chrome: sidebar, language switcher, TOC, code tabs,
                        copy, search, theme, pager — plus the i18n table for chrome
  logo.svg
```

Every page lives at `/<lang>/<path>`. URLs are parallel across languages, e.g.
`/en/api/predict.html` ⇄ `/zh/api/predict.html`.

## How the pages work

Each page is a thin HTML file containing only its **article content**. The
chrome (sidebar, language switcher, mobile top bar, "On this page" TOC,
code-tab bars, copy buttons, search, theme toggle, prev/next pager) is rendered
at runtime by `assets/docs.js` from a single `NAV` manifest and an `I18N` table.

A page declares two things on its `<body>`:

- `data-page="<id>"` — must match an `id` in the `NAV` manifest; drives the
  active sidebar link and the prev/next pager. **Identical across languages.**
- `data-base="<prefix>"` — path to the **language root**: `""` for a page at
  `/<lang>/`, `"../"` for a page in a subdirectory. **Identical across
  languages.**

`docs.js` detects the current language from the first URL path segment, renders
the sidebar/UI in that language, and sets `<html lang>` / `dir`. Shared assets
are loaded with absolute paths, so page depth doesn't matter.

### Languages (human)

Supported languages live in two places that must stay in sync:

- `LANGS` in `assets/docs.js` (drives the switcher and chrome translations).
- `SUPPORTED` in the root `index.html` (drives redirect language detection).

The chrome strings (sidebar labels, group titles, "On this page", pager,
search placeholder, etc.) are translated in the `I18N` table in `docs.js`. The
**article body** of each page is translated in the per-language HTML files
themselves.

**Adding a language** (`xx`):

1. Add `{ code: 'xx', name: 'Native name' }` to `LANGS` in `docs.js` (add
   `dir: 'rtl'` if the script is right-to-left), and an `xx` entry to the
   `I18N` table.
2. Add `'xx'` to `SUPPORTED` in the root `index.html`.
3. Copy `en/` to `xx/` and translate the article prose, leaving code blocks,
   HTML structure, `data-page`/`data-base`, and technical tokens untouched.
   Set `<html lang="xx">` (and `dir="rtl"` if applicable) on each file.

### Adding a new page

1. Create the HTML file under **every** language folder, copying the wrapper
   from an existing page in the same directory (keep the `<head>`, the
   `.docs-shell` shell, and the `#docs-pager` / `#docs-toc` placeholders).
2. Set `data-page` to a new unique id and the correct `data-base`.
3. Add one entry to the matching group in the `NAV` array in `assets/docs.js`,
   and a label for it under every language in the `I18N` table.

Headings (`<h2>`/`<h3>`) are picked up into the TOC automatically.

### Programming-language code tabs

Multi-language code examples use a `code-group`; each `code-block-wrap` carries a
`data-lang`. The tab bar, copy button, and cross-page/cross-visit language memory
are added automatically.

```html
<div class="code-group">
  <div class="code-block-wrap" data-lang="cURL"><pre class="code-block"><code>...</code></pre></div>
  <div class="code-block-wrap" data-lang="Python"><pre class="code-block"><code>...</code></pre></div>
  <div class="code-block-wrap" data-lang="Go"><pre class="code-block"><code>...</code></pre></div>
  <!-- JavaScript, PHP, Ruby, Java, C#, … -->
</div>
```

The API reference (`api/predict`, `api/ingest`) and the Quickstart carry the full
language matrix (cURL, Python, JavaScript, Go, PHP, Ruby, Java, C#); conceptual
pages keep a lighter set. Code blocks are identical across all human languages —
only the surrounding prose is translated.

### Components

Reusable patterns (callouts, multi-language code groups, parameter lists,
endpoint headers, tables, cards) are documented inline in `assets/docs.css`.

## License

[MIT](LICENSE) © Temporis
