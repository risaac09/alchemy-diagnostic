# Alchemy Diagnostic Snapshot

A 12-question Information Metabolism diagnostic. Built on the torus framework from the Information Alchemist OS methodology. Mode 2 of the Alchemy product architecture.

**Live:** https://risaac09.github.io/alchemy-diagnostic/
**Embed:** https://risaac09.github.io/alchemy-diagnostic/embed.html

## What it does

Asks twelve questions about how information moves through your system, then computes a four-axis metabolism score and renders a single-page visual report:

- **Placement map** — where you sit on a 2×2 of volume × circulation (Stagnant / Drowning / Distilling / Thriving)
- **Radar chart** — your shape across intake, transformation, expression, return flow
- **Findings** — rule-based interpretations of your scores
- **Recommendations** — practice prescriptions mapped to your shape

Everything runs in the browser. No backend, no database, no email gate, no tracking. The report is exportable via browser print (`Cmd+P → Save as PDF`).

## Run locally

```bash
cd ~/alchemy-diagnostic
python3 -m http.server 8000
# open http://localhost:8000
```

That's it. No build step, no npm install, no bundler. Vanilla JS, single HTML, single CSS, single JS.

## File layout

```
index.html       — full standalone experience
embed.html       — iframe-optimized variant (postMessage API)
app.js           — questions, scoring, SVG rendering, state machine
app.css          — design system + print styles
manifest.json    — PWA manifest
sw.js            — service worker
icon.svg         — torus mark
CLAUDE.md        — project constraints and design rules
```

## Embed anywhere

Drop this snippet into any host page:

```html
<iframe
  src="https://risaac09.github.io/alchemy-diagnostic/embed.html"
  style="width:100%;border:0;"
  title="Information Metabolism Diagnostic"
  loading="lazy"></iframe>
<script>
  window.addEventListener('message', (e) => {
    if (e.origin !== 'https://risaac09.github.io') return;
    if (e.data?.type === 'height') {
      document.querySelector('iframe[title="Information Metabolism Diagnostic"]').style.height = e.data.px + 'px';
    }
  });
</script>
```

The iframe sends three messages to the parent:
- `{ type: 'height', px }` — on every render and resize
- `{ type: 'started' }` — when the user clicks Begin
- `{ type: 'complete', scores }` — when the report renders, with the four axis scores

## Use in a live client conversation

1. Open `index.html` in a clean browser window
2. Share screen
3. Walk the client through the twelve questions verbally — let them answer, you click
4. At the report, talk through findings and recommendations live
5. `Cmd+P → Save as PDF` to give them a take-home artifact

The diagnostic is the conversation, not a substitute for it.

## Deploy

GitHub Pages, no build:

```bash
git init && git add -A && git commit -m "init"
gh repo create alchemy-diagnostic --public --source=. --push
gh repo edit --enable-pages --pages-source main
```

Or push manually and enable Pages in repo settings → Pages → main branch / root.

## License

The methodology (Information Alchemist OS, the torus framework, Voice Liberation) is proprietary; the code structure is freely studyable.
