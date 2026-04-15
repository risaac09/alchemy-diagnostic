# Alchemy Diagnostic Snapshot

A standalone PWA that administers the **Information Metabolism Diagnostic** — Mode 2 of the Alchemy product architecture. Built on the torus framework from the Information Alchemist OS methodology.

## What it does

Twelve-question assessment across four torus axes (intake regulation, transformation capacity, expression, return flow). Renders a single-page report with:

- **2×2 placement map** (volume × circulation) — Stagnant / Drowning / Distilling / Thriving
- **Four-axis radar chart** — client polygon overlaid on the ideal balanced torus
- **Key findings** (rule-based, 3–5 bullets)
- **Recommendations** mapped to RP service tiers (Founder Story, Program Engagement, etc.)

Two entry points:
- `index.html` — full standalone experience (live-call mode, self-service)
- `embed.html` — iframe-minimal variant with `postMessage` API (drop into rubinsteinproductions.com)

## Hard rules (do not violate)

- **Vanilla JS only.** No frameworks, no bundlers, no npm runtime dependencies. The only "tooling" allowed is a static file server for local dev.
- **No external services.** Scoring runs in the browser. Nothing leaves the user's device. No analytics, no telemetry, no email gate (in MVP).
- **No charting libraries.** All visualization is hand-rolled SVG. If you find yourself reaching for Chart.js or D3, stop.
- **No drop shadows.** Light is generated from within via SVG `<filter>` Gaussian blur. This rule comes from the metabolic luminescence visual philosophy.
- **No "save to PDF" libraries.** Browser print (`Cmd+P → Save as PDF`) is the export path. Print CSS in `app.css` makes this clean.
- **One file per concern.** `index.html` (shell), `app.js` (logic), `app.css` (style). Don't split unless you'd otherwise exceed ~600 lines.

## Architecture

```
index.html / embed.html  — shell (loads app.js + app.css)
app.js                   — IIFE: questions, state, scoring, SVG rendering, view router
app.css                  — design tokens + layout + print styles
manifest.json            — PWA manifest
sw.js                    — service worker (cache-first shell)
icon.svg                 — torus mark
```

State lives in a single `state` object inside the IIFE. Three views: `landing | question | report`. Event delegation on `[data-action]` attributes. Keyboard nav (1–5 to answer, arrows to navigate, Enter to advance).

## Design tokens

```
--bg:     #0a0e1a   /* darkest navy-charcoal — never pure black */
--amber:  #e8a949   /* intake — raw signal */
--teal:   #3dd6b5   /* transformation — processing */
--violet: #9b7fd4   /* expression / meaning */
--ink:    #e8e6d9   /* primary text */
```

Typography:
- `Inter` light/300 for body
- `JetBrains Mono` for labels, eyebrows, axis annotations
- Sparse, clinical, generous negative space

## Scoring model

```
intake          = mean((6 - Q1), Q2, Q3)        // Q1 inverted
transformation  = mean(Q4, Q5, Q6)
expression      = mean(Q7, Q8, Q9)
return_flow     = mean(Q10, Q11, Q12)

volume          = Q1 raw                        // 2×2 y-axis
circulation     = mean(intake, transformation, expression, return_flow)  // 2×2 x-axis
```

Quadrant logic: `volume > 3` and `circulation > 3` are the splits.

## Embed contract

`embed.html` posts three messages to its parent:
- `{ type: 'height', px }` — on every render and resize, parent should set iframe height
- `{ type: 'started' }` — when user begins
- `{ type: 'complete', scores }` — when report renders, payload includes computed scores

See `README.md` for the parent-side iframe snippet.

## Deploy

GitHub Pages at `risaac09.github.io/alchemy-diagnostic`. No build step. `git push` is the deploy.

## What this is NOT

- Not Mode 1 (personal torus / daily metabolism tool — separate repo, separate concern)
- Not Mode 3 (consulting portal — explicitly deferred until Mode 2 generates revenue)
- Not a marketing site (the result is the marketing — the report is the artifact)
- Not a generic assessment tool — the questions, axes, and recommendations are specific to RP's methodology
