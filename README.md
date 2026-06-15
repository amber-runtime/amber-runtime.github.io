# Amber Case Study (Astro)

Astro port of the Amber case study, recovered from the bundled HTML exports and
split into editable source. The cover is HTML; the writeup is markdown.

## Run locally
    npm install
    npm run dev        # http://localhost:4321/case-study/
    npm run build      # outputs to dist/
    npm run preview    # serve the built site

## Structure
- `src/layouts/Base.astro` — shared `<head>`, the global stylesheet link, body slot.
- `src/pages/index.astro` — the cover. Stays HTML (widget-heavy, little prose). Markup in `src/partials/index.html`, JS in `src/scripts/index.js`.
- `src/pages/case.astro` — the writeup. Assembles the frame + the markdown sections.
- `src/content/case/*.md` — **the eight writeup sections, editable as markdown.**
- `src/partials/case-prefix.html` / `case-suffix.html` — writeup frame: minibar, contents rail, the bespoke intro/hero, footer.
- `public/global.css` — shared base CSS + 64 `@font-face` rules.
- `public/case.css` — writeup page CSS + the one reconciliation rule.
- `public/assets/` — 16 fonts + 2 brand SVGs.
- `public/img/` — **diagram SVGs go here (see below).**
- `astro.config.mjs` — `base: '/case-study/'`, `build.format: 'file'` so URLs stay `index.html` / `case.html`.
- `.github/workflows/deploy.yml` — builds and deploys to Pages on push to `main`.

## Editing the writeup (markdown)
Each section is one file in `src/content/case/`, ordered by filename. Frontmatter plus body:
```
---
id: durable
order: 1
num: "01"
label: Durable execution
screenLabel: What is Durable Execution?
title: What is Durable Execution?
---
Body prose, as markdown paragraphs...
```
- Plain body paragraphs are markdown. Edit them like normal text.
- Amber accent words (`<span class="grad">`), the hand-tokenized code block, diagram `<img>` tags, the `aslot` captions, headings (`<h3 class="sh">`), and lists stay as inline HTML, because markdown cannot carry their styling. Edit the text inside those tags; leave the tags.
- Add a section: drop a new `NN-id.md` with frontmatter. It appears automatically, ordered by `order`.

## You must supply the diagrams
`case.html` references six files that were never in the export:
`amber-hero-minimal.svg`, `amber-double-charge.svg`, `amber-agent-loop.svg`,
`amber-capability-table.svg`, `amber-responsibilities.svg`, `amber-embedded-vs-runtime.svg`.
Copy them from your repo's `img/` folder into `public/img/`. Until then they 404; everything else works.

## Deploy
1. Push to `main`. The Action builds and deploys.
2. One time: repo Settings -> Pages -> Source = "GitHub Actions".
3. `base` must equal `/<repo-name>/`. It is `/case-study/`. Change it if the repo is named differently.

## Verify in the browser (only you can do this)
- [ ] Writeup prose, headings, lists, diagrams, and the code block look identical to the original.
- [ ] Fonts render as Space Grotesk / Inter, not a fallback.
- [ ] Cover interactives work (toggle, correlation reveal, recovery timeline); the writeup scroll-spy rail works.
- [ ] The six diagrams appear once added to `public/img/`.
- [ ] Technical terms render intact (markdown leaves `under_scores` alone; glance for stray `*` or backticks).
- [ ] Check the deployed `/case-study/` URL, not just local; base-path issues only show in production.
