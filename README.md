# Temporis Docs

Static developer documentation for the Temporis platform, intended for
`docs.temporis.co`. No build step — plain HTML, one shared CSS file, one shared
JS file.

## Preview locally

```
cd docs
python3 -m http.server 8000
# open http://127.0.0.1:8000
```

## Deploy

Upload the contents of `docs/` to any static host (S3 + CloudFront, Netlify,
nginx, GitHub Pages, …) and point `docs.temporis.co` at it. `index.html` is the
entry point.

## Structure

```
index.html              Landing page
quickstart.html         5-minute end-to-end walkthrough
concepts/               Teaching pages (how it works, data sources, profiles, predictions)
api/                    Endpoint reference (auth, ingest, predict, errors)
guides/                 Task-oriented how-tos
assets/
  docs.css              All styling + the light/dark theme tokens
  docs.js               Shared chrome: sidebar, TOC, code tabs, copy, search, theme, pager
  logo.svg
```

## How the pages work

Each page is a thin HTML file containing only its **article content**. The
chrome (sidebar, mobile top bar, "On this page" TOC, code-tab bars, copy
buttons, search, theme toggle, prev/next pager) is rendered at runtime by
`assets/docs.js` from a single `NAV` manifest at the top of that file.

A page declares two things on its `<body>`:

- `data-page="<id>"` — must match an `id` in the `NAV` manifest; drives the
  active sidebar link and the prev/next pager.
- `data-base="<prefix>"` — `""` for pages at the docs root, `"../"` for pages in
  a subdirectory. Used to resolve nav/asset links.

### Adding a new page

1. Create the HTML file, copying the wrapper from an existing page in the same
   directory (keep the `<head>`, the `.docs-shell` shell, and the `#docs-pager`
   / `#docs-toc` placeholders).
2. Set `data-page` to a new unique id and the correct `data-base`.
3. Add one entry to the matching group in the `NAV` array in `assets/docs.js`.

That's it — the sidebar link, ordering, and prev/next wiring follow from the
manifest. Headings (`<h2>`/`<h3>`) are picked up into the TOC automatically.

### Components

Reusable patterns (callouts, multi-language code groups, parameter lists,
endpoint headers, tables, cards) are documented inline in `assets/docs.css`.
Multi-language examples use:

```html
<div class="code-group">
  <div class="code-block-wrap" data-lang="cURL"><pre class="code-block"><code>...</code></pre></div>
  <div class="code-block-wrap" data-lang="Python"><pre class="code-block"><code>...</code></pre></div>
  <div class="code-block-wrap" data-lang="JavaScript"><pre class="code-block"><code>...</code></pre></div>
</div>
```

The tab bar and copy button are added automatically; the chosen language is
remembered across the page and across visits.

## License

[MIT](LICENSE) © Temporis
