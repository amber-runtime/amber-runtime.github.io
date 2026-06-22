# Amber Case Study

The Amber case study site, built with Astro and deployed to GitHub Pages.

## Develop

```
npm install
npm run dev        # http://localhost:4321/
npm run build      # static output in dist/
npm run preview    # serve the built output
```

## Layout

- `src/pages/index.astro` — the cover page. Markup in `src/partials/index.html`, script in `src/scripts/index.js`.
- `src/pages/case.astro` — the writeup. Assembles the frame plus the markdown sections.
- `src/content/case/*.md` — the writeup sections, edited as markdown (see below).
- `src/partials/case-prefix.html`, `case-suffix.html` — the writeup frame: header, contents rail, intro, footer.
- `src/layouts/Base.astro` — shared `<head>` and page shell.
- `public/` — static assets served as-is: fonts and brand marks in `assets/`, diagrams in `img/`, stylesheets `global.css` and `case.css`.
- `astro.config.mjs` — `base` is `/`; `build.format: 'directory'` plus `trailingSlash: 'never'` keeps the live routes at `/`, `/case`, and `/team`.

## Editing the writeup

Each section is one file in `src/content/case/`, ordered by filename. The frontmatter sets the anchor, number, labels, and heading; the body is the prose.

```
---
id: background
order: 1
num: "01"
label: Background
screenLabel: Background
title: Background
---
Body prose as markdown paragraphs...
```

Body paragraphs are plain markdown. Accent words, the code block, diagrams, captions, headings, and lists are kept as inline HTML in the file, since markdown cannot carry their styling, so edit the text inside those tags and leave the tags. To add a section, drop in a new `NN-id.md`.

## Deploy

Pushes to `main` build and deploy to GitHub Pages via `.github/workflows/deploy.yml`. This requires the repo's Pages source to be set to GitHub Actions (Settings, Pages, Source). The site serves at `/`.
