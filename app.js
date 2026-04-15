/* Alchemy Diagnostic Snapshot
 * Information Metabolism assessment built on the torus framework.
 * Vanilla JS, no dependencies. Pure SVG rendering.
 * (c) Rubinstein Productions
 */
(function () {
  'use strict';

  // =====================================================================
  // QUESTION CONFIG
  // =====================================================================
  const QUESTIONS = [
    {
      id: 'q1',
      axis: 'intake',
      text: 'On a normal day, how much new information do you take in — articles, videos, scrolling, meetings, conversations?',
      options: [
        'Very little — under 30 minutes total',
        'A modest amount — an hour or two',
        'A steady stream — a few hours',
        'A lot — most of the day',
        'It never really stops'
      ]
    },
    {
      id: 'q2',
      axis: 'intake',
      text: 'When something enters your attention, how often are you the one choosing vs. something pulling you?',
      options: [
        'Almost always pulled — I react to what shows up',
        'Mostly pulled',
        'About half and half',
        'Mostly chosen',
        'Almost always chosen — I decide what to let in'
      ]
    },
    {
      id: 'q3',
      axis: 'intake',
      text: 'After a stretch of consuming, how do you usually feel?',
      options: [
        'Cluttered, wired, scattered',
        'Slightly overloaded',
        'Neutral',
        'A little clearer',
        'Clearer and more composed than when I started'
      ]
    },
    {
      id: 'q4',
      axis: 'transformation',
      text: 'When something lands — an idea, a quote, a pattern — what usually happens next?',
      options: [
        'I save it somewhere and rarely come back',
        'I think about it briefly, then move on',
        'I note it for possible future use',
        'I write, talk, or make something with it',
        'I run it through a deliberate practice'
      ]
    },
    {
      id: 'q5',
      axis: 'transformation',
      text: 'How often does raw material change shape in your hands — become a note, a sentence, a drawing, a new question?',
      options: [
        'Almost never',
        'Occasionally',
        'Sometimes',
        'Often',
        'Nearly everything I take in'
      ]
    },
    {
      id: 'q6',
      axis: 'transformation',
      text: 'When you sit with something unresolved or uncomfortable, how long can you stay with it before resolving or discarding?',
      options: [
        'Minutes at most',
        'Part of a day',
        'A day or two',
        'Most of a week',
        'Days or weeks — I let things cook'
      ]
    },
    {
      id: 'q7',
      axis: 'expression',
      text: 'In a typical month, how much of your output carries your voice — your framing, your questions, your angle?',
      options: [
        'Almost none — I mostly reformulate or respond to others',
        'A little',
        'About half',
        'Most of it',
        'Nearly all — I generate more than I react'
      ]
    },
    {
      id: 'q8',
      axis: 'expression',
      text: 'How often are you putting work out publicly — writing, speaking, posting, presenting?',
      options: [
        'Rarely or never',
        'A few times a year',
        'Monthly',
        'Weekly',
        'More than weekly'
      ]
    },
    {
      id: 'q9',
      axis: 'expression',
      text: 'If someone with similar skills saw your recent work, could they have made the same thing?',
      options: [
        'Yes, it\u2019s pretty interchangeable',
        'Mostly',
        'Some of it',
        'Not really — it carries my perspective',
        'No — it\u2019s unmistakably mine'
      ]
    },
    {
      id: 'q10',
      axis: 'returnFlow',
      text: 'Does your published or shared work come back to you — as responses, conversations, new questions, new invitations?',
      options: [
        'Almost never — it disappears',
        'Occasionally',
        'Sometimes',
        'Usually',
        'Almost always — every piece opens the next'
      ]
    },
    {
      id: 'q11',
      axis: 'returnFlow',
      text: 'How often do you re-encounter your own past work and let it shape what comes next?',
      options: [
        'Rarely — past work stays past',
        'Occasionally',
        'Sometimes',
        'Often',
        'Regularly — I mine my own history'
      ]
    },
    {
      id: 'q12',
      axis: 'returnFlow',
      text: 'If you drew the path of your information — where it enters, what happens to it, where it goes — would it look more like a pipe or a loop?',
      options: [
        'A pipe — in and out',
        'Mostly pipe with small returns',
        'A pipe that\u2019s starting to curve',
        'A loop with leaks',
        'A closed circulating torus'
      ]
    }
  ];

  // =====================================================================
  // STATE
  // =====================================================================
  const state = {
    view: 'landing',  // landing | question | report
    index: 0,
    answers: {},
    embed: document.body.dataset.embed === 'true'
  };

  const root = document.getElementById('root');

  // =====================================================================
  // SCORING
  // =====================================================================
  function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function computeScores(answers) {
    // Q1 raw drives the volume axis on the 2x2 placement map.
    // Q1 inverted contributes to intake regulation (high volume w/o filter = poor regulation).
    const q1Inverted = 6 - answers.q1;
    const intake = mean([q1Inverted, answers.q2, answers.q3]);
    const transformation = mean([answers.q4, answers.q5, answers.q6]);
    const expression = mean([answers.q7, answers.q8, answers.q9]);
    const returnFlow = mean([answers.q10, answers.q11, answers.q12]);
    const volume = answers.q1;
    const circulation = mean([intake, transformation, expression, returnFlow]);
    return { intake, transformation, expression, returnFlow, volume, circulation };
  }

  function quadrant(s) {
    const highVolume = s.volume > 3;
    const highCirculation = s.circulation > 3;
    if (highVolume && highCirculation) return { name: 'Thriving', summary: 'a circulating torus' };
    if (highVolume && !highCirculation) return { name: 'Drowning', summary: 'a pipe under pressure' };
    if (!highVolume && highCirculation) return { name: 'Distilling', summary: 'a compact loop' };
    return { name: 'Stagnant', summary: 'an idle field' };
  }

  // =====================================================================
  // FINDINGS LIBRARY
  // =====================================================================
  function generateFindings(s) {
    const out = [];
    // Use the three deliberate axes for "all axes" checks — intake has a structural
    // ceiling at 3.67 in extreme cases due to the Q1-inversion penalty for raw volume.
    const deliberate = [s.transformation, s.expression, s.returnFlow];

    if (deliberate.every(v => v >= 4) && s.intake >= 3.5) {
      out.push('Your circulation is strong across every axis. The work here is refinement, not restructuring.');
    }
    if (deliberate.every(v => v <= 2) && s.volume <= 2) {
      out.push('Your system is under-activated. Start with one axis and build from there — return flow is usually the highest leverage.');
    }
    if (s.returnFlow <= 2) {
      out.push('Your system is operating as a pipe. Material enters and exits without circling back.');
    }
    if (s.volume >= 4 && s.transformation <= 2) {
      out.push('Your intake is high but transformation is low — you are taking in more than you can metabolize.');
    }
    if (s.transformation >= 4 && s.expression <= 2) {
      out.push('Your transformation is strong but expression is low. Material is being processed but not released.');
    }
    if (s.expression >= 4 && s.returnFlow <= 2) {
      out.push('You are producing — but the work is not coming back to feed the next cycle.');
    }
    if (s.intake <= 2 && s.volume >= 4) {
      out.push('A lot is getting in, but almost none of it is by choice. The filter needs building before anything else.');
    }
    if (s.expression <= 2 && s.transformation >= 3) {
      out.push('You are metabolizing material privately. The next move is finding a public surface to release it.');
    }
    if (s.returnFlow >= 4 && s.expression >= 4 && s.transformation <= 2) {
      out.push('Your output is generating return — but the middle is thin. More transformation would deepen what you put out.');
    }
    if (s.volume <= 2 && s.circulation >= 4) {
      out.push('Low volume, high circulation. You are distilling. The risk here is starvation, not overload.');
    }

    // Always close with the quadrant summary
    const q = quadrant(s);
    out.push('Your placement: ' + q.name + ' — your information field currently shapes itself like ' + q.summary + '.');

    return out.slice(0, 5);
  }

  function generateRecommendations(s) {
    const recs = [];
    if (s.expression <= 2) {
      recs.push({
        tier: 'Founder Story',
        body: 'A Founder Story engagement could establish your output voice — the practice of releasing what you have already metabolized.'
      });
    }
    if (s.returnFlow <= 2) {
      recs.push({
        tier: 'Program Engagement',
        body: 'A Program Engagement could help you build return-flow infrastructure — publishing rhythms that feed back into inquiry.'
      });
    }
    if (s.transformation <= 2 && s.volume >= 4) {
      recs.push({
        tier: 'Sift Practice',
        body: 'Before adding output, the system needs an intake filter and a metabolizing rhythm. A short Sift engagement comes first.'
      });
    }
    if (s.circulation >= 4) {
      recs.push({
        tier: 'Retained / Mode 3',
        body: 'You are running a torus already. A retained engagement would give you longitudinal tracking and refinement, not restructuring.'
      });
    }
    recs.push({
      tier: 'Discovery call',
      body: 'Walk through these results in person. Schedule at rubinsteinproductions.com.'
    });
    return recs.slice(0, 3);
  }

  // =====================================================================
  // SVG RENDERING — TORUS PLACEMENT MAP (2x2)
  // =====================================================================
  function renderTorusMap(s) {
    const W = 360, H = 360, P = 48;  // padding
    const innerW = W - P * 2, innerH = H - P * 2;
    // x = circulation (1..5), y = volume (1..5), inverted so high volume = top
    const cx = P + ((s.circulation - 1) / 4) * innerW;
    const cy = P + ((5 - s.volume) / 4) * innerH;

    return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="chart" role="img" aria-label="Torus placement map">
  <defs>
    <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e8a949" stop-opacity="1"/>
      <stop offset="40%" stop-color="#3dd6b5" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#9b7fd4" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Frame -->
  <rect x="${P}" y="${P}" width="${innerW}" height="${innerH}"
        fill="none" stroke="#2a3142" stroke-width="1"/>

  <!-- Quadrant divider lines -->
  <line x1="${P + innerW / 2}" y1="${P}" x2="${P + innerW / 2}" y2="${P + innerH}"
        stroke="#2a3142" stroke-width="1" stroke-dasharray="2 4"/>
  <line x1="${P}" y1="${P + innerH / 2}" x2="${P + innerW}" y2="${P + innerH / 2}"
        stroke="#2a3142" stroke-width="1" stroke-dasharray="2 4"/>

  <!-- Quadrant labels -->
  <text x="${P + innerW * 0.25}" y="${P + innerH * 0.20}" class="quad-label" text-anchor="middle">DROWNING</text>
  <text x="${P + innerW * 0.25}" y="${P + innerH * 0.20 + 14}" class="quad-sub" text-anchor="middle">pipe</text>

  <text x="${P + innerW * 0.75}" y="${P + innerH * 0.20}" class="quad-label" text-anchor="middle">THRIVING</text>
  <text x="${P + innerW * 0.75}" y="${P + innerH * 0.20 + 14}" class="quad-sub" text-anchor="middle">torus</text>

  <text x="${P + innerW * 0.25}" y="${P + innerH * 0.85}" class="quad-label" text-anchor="middle">STAGNANT</text>
  <text x="${P + innerW * 0.25}" y="${P + innerH * 0.85 + 14}" class="quad-sub" text-anchor="middle">idle</text>

  <text x="${P + innerW * 0.75}" y="${P + innerH * 0.85}" class="quad-label" text-anchor="middle">DISTILLING</text>
  <text x="${P + innerW * 0.75}" y="${P + innerH * 0.85 + 14}" class="quad-sub" text-anchor="middle">compact loop</text>

  <!-- Axis labels -->
  <text x="${W / 2}" y="${H - 14}" class="axis-label" text-anchor="middle">CIRCULATION  →</text>
  <text x="14" y="${H / 2}" class="axis-label" text-anchor="middle"
        transform="rotate(-90, 14, ${H / 2})">VOLUME  →</text>

  <!-- Marker glow (large soft halo) -->
  <circle cx="${cx}" cy="${cy}" r="36" fill="url(#markerGlow)"/>

  <!-- Marker core -->
  <circle cx="${cx}" cy="${cy}" r="6" fill="#e8e6d9" filter="url(#softGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="2" fill="#0a0e1a"/>
</svg>`;
  }

  // =====================================================================
  // SVG RENDERING — RADAR CHART (4-axis)
  // =====================================================================
  function renderRadar(s) {
    const W = 420, H = 360;
    const cx = W / 2, cy = H / 2;
    const R = 120;

    // Axis order: top = intake, right = transformation, bottom = expression, left = returnFlow
    const axes = [
      { key: 'intake',         label: 'INTAKE',    value: s.intake,         angle: -Math.PI / 2 },
      { key: 'transformation', label: 'TRANSFORM', value: s.transformation, angle: 0 },
      { key: 'expression',     label: 'EXPRESS',   value: s.expression,     angle: Math.PI / 2 },
      { key: 'returnFlow',     label: 'RETURN',    value: s.returnFlow,     angle: Math.PI }
    ];

    // Concentric rings (1..5)
    let rings = '';
    for (let i = 1; i <= 5; i++) {
      const r = (R * i) / 5;
      rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2a3142" stroke-width="${i === 5 ? 1 : 0.6}" stroke-dasharray="${i === 5 ? '' : '1 3'}"/>`;
    }

    // Axis lines
    let axisLines = '';
    axes.forEach(a => {
      const x = cx + Math.cos(a.angle) * R;
      const y = cy + Math.sin(a.angle) * R;
      axisLines += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#2a3142" stroke-width="0.6"/>`;
    });

    // Ideal balanced shape (4s on every axis, dashed violet)
    const idealPts = axes.map(a => {
      const r = (R * 4) / 5;
      return [cx + Math.cos(a.angle) * r, cy + Math.sin(a.angle) * r];
    });
    const idealPath = idealPts.map(p => p.join(',')).join(' ');

    // Client polygon
    const clientPts = axes.map(a => {
      const r = (R * a.value) / 5;
      return [cx + Math.cos(a.angle) * r, cy + Math.sin(a.angle) * r];
    });
    const clientPath = clientPts.map(p => p.join(',')).join(' ');

    // Axis labels and value chips
    let labels = '';
    axes.forEach((a, i) => {
      const lr = R + 22;
      const lx = cx + Math.cos(a.angle) * lr;
      const ly = cy + Math.sin(a.angle) * lr + 4;
      const anchor = (i === 0 || i === 2) ? 'middle' : (i === 1 ? 'start' : 'end');
      labels += `<text x="${lx}" y="${ly}" class="radar-label" text-anchor="${anchor}">${a.label}</text>`;
    });

    // Value vertices (small dots)
    let vertices = '';
    clientPts.forEach(p => {
      vertices += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#e8a949"/>`;
    });

    return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="chart" role="img" aria-label="Four-axis information metabolism radar">
  <defs>
    <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#e8a949" stop-opacity="0.35"/>
      <stop offset="50%"  stop-color="#3dd6b5" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#9b7fd4" stop-opacity="0.35"/>
    </linearGradient>
  </defs>

  ${rings}
  ${axisLines}

  <!-- Ideal balanced torus shape -->
  <polygon points="${idealPath}" fill="none" stroke="#9b7fd4" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>

  <!-- Client polygon -->
  <polygon points="${clientPath}" fill="url(#radarFill)" stroke="#e8a949" stroke-width="1.5"/>

  ${vertices}
  ${labels}

  <!-- Center mark -->
  <circle cx="${cx}" cy="${cy}" r="2" fill="#e8e6d9"/>
</svg>`;
  }

  // =====================================================================
  // VIEW: LANDING
  // =====================================================================
  function renderLanding() {
    return `
<section class="landing">
  <div class="eyebrow">RUBINSTEIN PRODUCTIONS</div>
  <h1>Information Metabolism Diagnostic</h1>
  <p class="lede">A 12-question snapshot of how information moves through your system. Are you running a pipe, or a torus?</p>
  <ul class="meta">
    <li>Twelve questions</li>
    <li>About four minutes</li>
    <li>No email required</li>
  </ul>
  <button class="btn-primary" data-action="start">Begin</button>
  <p class="footnote">Built on the Information Alchemist OS methodology. Results are computed locally — nothing leaves your browser.</p>
</section>`;
  }

  // =====================================================================
  // VIEW: QUESTION
  // =====================================================================
  function renderQuestion() {
    const q = QUESTIONS[state.index];
    const total = QUESTIONS.length;
    const selected = state.answers[q.id];

    let dots = '';
    for (let i = 0; i < total; i++) {
      const cls = i === state.index ? 'dot active' : (state.answers[QUESTIONS[i].id] ? 'dot done' : 'dot');
      dots += `<span class="${cls}"></span>`;
    }

    let opts = '';
    q.options.forEach((opt, i) => {
      const val = i + 1;
      const cls = selected === val ? 'opt selected' : 'opt';
      opts += `<button class="${cls}" data-action="answer" data-value="${val}">
        <span class="opt-num">${val}</span>
        <span class="opt-text">${opt}</span>
      </button>`;
    });

    const axisLabel = {
      intake: 'Intake regulation · Sift',
      transformation: 'Transformation · Alchemy',
      expression: 'Expression · Say Why',
      returnFlow: 'Return flow · Torus'
    }[q.axis];

    return `
<section class="question">
  <div class="q-header">
    <div class="q-axis">${axisLabel}</div>
    <div class="q-progress">${state.index + 1} of ${total}</div>
  </div>
  <div class="q-dots">${dots}</div>
  <h2 class="q-text">${q.text}</h2>
  <div class="q-options">${opts}</div>
  <div class="q-nav">
    ${state.index > 0 ? '<button class="btn-ghost" data-action="back">← Back</button>' : '<span></span>'}
    ${selected ? '<button class="btn-primary" data-action="next">' + (state.index === total - 1 ? 'See report →' : 'Next →') + '</button>' : '<span class="hint">Pick 1–5 or press a number key</span>'}
  </div>
</section>`;
  }

  // =====================================================================
  // VIEW: REPORT
  // =====================================================================
  function renderReport() {
    const s = computeScores(state.answers);
    const findings = generateFindings(s);
    const recs = generateRecommendations(s);
    const q = quadrant(s);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const fmt = (v) => v.toFixed(1);

    let findingsHtml = findings.map(f => `<li>${f}</li>`).join('');
    let recsHtml = recs.map(r => `
      <div class="rec">
        <div class="rec-tier">${r.tier}</div>
        <div class="rec-body">${r.body}</div>
      </div>
    `).join('');

    return `
<section class="report">
  <div class="report-header">
    <div class="eyebrow">RUBINSTEIN PRODUCTIONS · INFORMATION ALCHEMIST OS</div>
    <h1>Information Metabolism Report</h1>
    <div class="report-meta">${date} · placement: <strong>${q.name}</strong></div>
  </div>

  <div class="charts">
    <div class="chart-card">
      <div class="chart-title">PLACEMENT MAP</div>
      ${renderTorusMap(s)}
    </div>
    <div class="chart-card">
      <div class="chart-title">FOUR-AXIS METABOLISM</div>
      ${renderRadar(s)}
    </div>
  </div>

  <div class="scores">
    <div class="score-pill"><div class="score-label">INTAKE</div><div class="score-value">${fmt(s.intake)}</div></div>
    <div class="score-pill"><div class="score-label">TRANSFORM</div><div class="score-value">${fmt(s.transformation)}</div></div>
    <div class="score-pill"><div class="score-label">EXPRESS</div><div class="score-value">${fmt(s.expression)}</div></div>
    <div class="score-pill"><div class="score-label">RETURN</div><div class="score-value">${fmt(s.returnFlow)}</div></div>
  </div>

  <div class="findings">
    <div class="section-title">KEY FINDINGS</div>
    <ul>${findingsHtml}</ul>
  </div>

  <div class="recommendations">
    <div class="section-title">NEXT STEPS</div>
    <div class="rec-grid">${recsHtml}</div>
  </div>

  <div class="report-footer">
    <div class="report-mark">rubinsteinproductions.com</div>
    <div class="report-actions no-print">
      <button class="btn-ghost" data-action="restart">↻ Start over</button>
      <button class="btn-primary" data-action="print">Save as PDF</button>
    </div>
  </div>
</section>`;
  }

  // =====================================================================
  // RENDER + EVENTS
  // =====================================================================
  function render() {
    let html = '';
    if (state.view === 'landing') html = renderLanding();
    else if (state.view === 'question') html = renderQuestion();
    else if (state.view === 'report') html = renderReport();
    root.innerHTML = html;
    postHeight();
  }

  function postHeight() {
    if (!state.embed || !window.parent || window.parent === window) return;
    // Reading scrollHeight forces synchronous layout, so the value is accurate
    // without needing requestAnimationFrame (which is throttled on hidden iframes).
    const h = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'height', px: h }, '*');
  }

  function postEvent(type, payload) {
    if (!state.embed || !window.parent || window.parent === window) return;
    window.parent.postMessage(Object.assign({ type: type }, payload || {}), '*');
  }

  function handleAction(action, target) {
    if (action === 'start') {
      state.view = 'question';
      state.index = 0;
      render();
      postEvent('started');
    } else if (action === 'answer') {
      const val = parseInt(target.dataset.value, 10);
      const q = QUESTIONS[state.index];
      state.answers[q.id] = val;
      render();
    } else if (action === 'next') {
      if (state.index < QUESTIONS.length - 1) {
        state.index++;
        render();
      } else {
        state.view = 'report';
        render();
        postEvent('complete', { scores: computeScores(state.answers) });
      }
    } else if (action === 'back') {
      if (state.index > 0) {
        state.index--;
        render();
      }
    } else if (action === 'restart') {
      state.view = 'landing';
      state.index = 0;
      state.answers = {};
      render();
    } else if (action === 'print') {
      window.print();
    }
  }

  // Event delegation
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    handleAction(target.dataset.action, target);
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (state.view === 'landing' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleAction('start');
      return;
    }
    if (state.view !== 'question') return;
    if (e.key >= '1' && e.key <= '5') {
      const val = parseInt(e.key, 10);
      const q = QUESTIONS[state.index];
      state.answers[q.id] = val;
      render();
      // Auto-advance after a short pause for visual confirmation
      setTimeout(() => {
        if (state.answers[q.id] === val && state.view === 'question') {
          handleAction('next');
        }
      }, 220);
    } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
      handleAction('back');
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      if (state.answers[QUESTIONS[state.index].id]) handleAction('next');
    }
  });

  window.addEventListener('resize', postHeight);

  // Service worker registration (only on real origins, not file://)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  // Boot
  render();

  // Expose for debugging only
  window.__alchemy = { state, computeScores, QUESTIONS };
})();
