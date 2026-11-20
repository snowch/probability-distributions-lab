import { units, lessons } from './course/index.js';
import { drawChart } from './chart.js';
import { experiments } from './experiments.js';
import { bars, discrete, points } from './experiment-utils.js';
import { binomial } from './math.js';
import { pythonExamples } from './python-examples.js';
import { mountPython } from './python-ui.js';

const main = document.getElementById('main-content');
const title = 'Probability Distributions Lab';
const lessonUrl = lesson => '#lesson/' + lesson.slug;
const ordinal = number => String(number).padStart(2, '0');
const scopedStorage = 'probability-distributions-lab:v1:';
const memory = new Map();
let cleanup = () => {};
let currentRoute = '';

function read(key, fallback) {
  if (memory.has(key)) return memory.get(key);
  try {
    const stored = localStorage.getItem(scopedStorage + key);
    if (stored !== null) return JSON.parse(stored);
  } catch {
    return fallback;
  }
  return fallback;
}

function write(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(scopedStorage + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const validSlugs = new Set(lessons.map(lesson => lesson.slug));
const previousProgress = read('completed', []);
const completed = new Set(Array.isArray(previousProgress) ? previousProgress.filter(slug => validSlugs.has(slug)) : []);
const characters = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const html = value => String(value).replace(/[&<>"']/g, character => characters[character]);
const query = selector => main.querySelector(selector);

function lessonLink(lesson, selected) {
  const current = lesson === selected ? ' aria-current="page"' : '';
  const done = completed.has(lesson.slug);
  const index = done ? '<span aria-label="Completed">✓</span>' : ordinal(lesson.number);
  return '<li><a href="' + lessonUrl(lesson) + '"' + current + '><span class="lesson-index" data-lesson-index="' + lesson.slug + '">' +
    index + '</span><span>' + html(lesson.title) + '</span></a></li>';
}

function outline() {
  const search = query('#lesson-search');
  const searchStatus = query('#search-status');
  function renderUnits() {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matching = units.map(unit => {
      const selected = unit.lessons.filter(lesson => {
        const searchable = [unit.title, lesson.title, lesson.intro, lesson.idea].join(' ').toLowerCase();
        return terms.every(term => searchable.includes(term));
      });
      return { unit, selected };
    }).filter(({ selected }) => selected.length);
    const matches = matching.reduce((sum, { selected }) => sum + selected.length, 0);
    query('#unit-grid').innerHTML = matching.map(({ unit, selected }) =>
      '<section class="unit-card"><p class="eyebrow">Unit ' + ordinal(unit.number) + '</p><h3>' +
      html(unit.title) + '</h3><p>' + html(unit.summary) + '</p><ol class="lesson-list">' +
      selected.map(lesson => lessonLink(lesson)).join('') + '</ol></section>').join('');
    searchStatus.hidden = !terms.length;
    searchStatus.textContent = matches ? matches + (matches === 1 ? ' matching lesson' : ' matching lessons') : 'No matching lessons. Try a different search.';
  }
  search.addEventListener('input', renderUnits);
  renderUnits();
}

function renderHome() {
  const next = lessons.find(lesson => !completed.has(lesson.slug)) ?? lessons[0];
  const callToAction = completed.size === lessons.length ? 'Revisit the lab' : completed.size ? 'Continue learning' : 'Start with coin flips';
  const progress = completed.size ? '<span><strong>' + completed.size + ' / ' + lessons.length + '</strong> completed</span>' : '';
  main.innerHTML = `
    <div class="home">
      <section class="hero" aria-labelledby="home-title">
        <div>
          <p class="eyebrow">A hands-on probability course</p>
          <h1 id="home-title">Probability Distributions Lab</h1>
          <p>Start with coin flips. Learn to read, choose, and test distributions for the decisions you actually need to make.</p>
          <div class="hero-actions">
            <a href="${lessonUrl(next)}" class="button">${callToAction}</a>
            <a href="#curriculum" class="button-secondary">Explore the outline</a>
          </div>
        </div>
        <div class="hero-chart">
          <div class="hero-chart-head"><strong>Heads in 10 fair flips</strong><span>5 heads · 24.6%</span></div>
          <svg class="data-chart" role="img"></svg>
        </div>
      </section>
      <div class="course-facts">
        <span><strong>8</strong> units</span><span><strong>48</strong> interactive lessons</span><span>Optional Python in your browser</span>${progress}
      </div>
      <section id="curriculum" class="curriculum" aria-labelledby="outline-title">
        <div class="outline-header">
          <div><p class="eyebrow">Course outline</p><h2 id="outline-title">From outcomes to decisions</h2>
            <p>Work through in order or look up a distribution you want to understand.</p></div>
          <label class="search-label" for="lesson-search">Find a lesson
            <input type="search" id="lesson-search" placeholder="Try “binomial” or “tails”" autocomplete="off">
          </label>
        </div>
        <p id="search-status" role="status" hidden></p>
        <div class="unit-grid" id="unit-grid"></div>
      </section>
      <details class="primer"><summary>Optional refresher · Probability essentials</summary>
        <dl>
          <dt>Trial and outcome</dt><dd>A trial is one complete run of the experiment. An outcome is what that run produces.</dd>
          <dt>Probability</dt><dd>A probability is between 0 and 1. For outcomes that are equally likely, count the matching cases and divide by the total number of cases.</dd>
          <dt>Complement</dt><dd>If an event has probability 0.2, its complement has probability 0.8. Between them they cover all outcomes.</dd>
          <dt>Independence</dt><dd>If learning the result of one event leaves the other’s chance unchanged, their joint chance is the product of their individual chances.</dd>
          <dt>Conditional probability</dt><dd>When you know something about a trial, limit attention to trials that match that information. The chance of rain among all days can differ from the chance of rain among cloudy days.</dd>
        </dl>
      </details>
    </div>`;
  outline();
  const svg = query('.hero-chart svg');
  const probabilities = points(binomial(10, .5)).map(point => ({ ...point, active: point.x === 5 }));
  const chart = discrete('Heads in one round', 0, 10, [bars('Exact binomial probability', probabilities)]);
  const redraw = () => drawChart(svg, chart);
  const observer = new ResizeObserver(redraw);
  observer.observe(svg);
  redraw();
  return () => observer.disconnect();
}

function sideNav(lesson, unit) {
  return `<aside class="lesson-side"><div class="side-inner">
    <a class="back-link" href="#curriculum">Course outline</a>
    <p class="eyebrow">Unit ${ordinal(unit.number)} of ${ordinal(units.length)}</p>
    <h2 class="unit-label">${html(unit.title)}</h2>
    <details class="lesson-menu"${matchMedia('(min-width: 691px)').matches ? ' open' : ''}>
      <summary>Lessons in this unit</summary>
      <nav aria-label="Lessons in this unit"><ol class="lesson-list">${unit.lessons.map(item => lessonLink(item, lesson)).join('')}</ol></nav>
    </details>
    <div class="side-progress">
      <p class="progress-text" id="side-progress-label">${completed.size} of ${lessons.length} completed</p>
      <progress id="side-progress" max="${lessons.length}" value="${completed.size}" aria-labelledby="side-progress-label"></progress>
    </div>
  </div></aside>`;
}

function controlsMarkup(controls) {
  return controls.map((control, index) => {
    const id = 'experiment-control-' + index;
    const label = html(control.label);
    const output = control.options ? '' : '<output for="' + id + '">' + html(control.value + control.unit) + '</output>';
    const field = control.options
      ? '<select id="' + id + '">' + control.options.map(([value, description]) =>
        '<option value="' + html(value) + '"' + (value === control.value ? ' selected' : '') + '>' + html(description) + '</option>').join('') + '</select>'
      : '<input id="' + id + '" type="range" min="' + control.min + '" max="' + control.max + '" step="' + control.step + '" value="' + control.value + '">';
    return '<div class="control" data-control="' + index + '"><label for="' + id + '">' + label + output + '</label>' + field + '</div>';
  }).join('');
}

function experimentUI(lesson, settings) {
  const controls = Array.from(main.querySelectorAll('[data-control]'));
  const svg = query('#experiment-svg');
  const run = query('#resample');
  const seedLabel = query('#seed');
  const resampleArea = query('.chart-actions');
  let seed = 500 + lesson.number;
  let chart;
  let scheduled = 0;
  const values = Object.fromEntries(settings.controls.map(control => [control.key, control.value]));
  function draw() {
    if (chart) drawChart(svg, chart);
  }
  const resize = new ResizeObserver(draw);
  resize.observe(svg);

  function render() {
    scheduled = 0;
    const result = settings.compute(values, seed);
    chart = result.chart;
    redrawControls();
    draw();
    query('#legend').innerHTML = chart.series.map(series =>
      '<span><i aria-hidden="true" class="legend-swatch series-' + series.color + ' is-' + series.type +
      (series.dashed ? ' is-dashed' : '') + '"></i>' + html(series.label) + '</span>').join('');
    query('#metrics').innerHTML = result.metrics.map(item => '<div><dt>' + html(item.label) +
      '</dt><dd>' + html(item.value) + '</dd></div>').join('');
    const note = query('#chart-note');
    note.hidden = !result.note;
    note.textContent = result.note ?? '';
  }
  function redrawControls() {
    controls.forEach((wrapper, index) => {
      const specification = settings.controls[index];
      wrapper.hidden = Boolean(specification.when && values.scenario !== specification.when);
    });
    const canResample = typeof settings.resample === 'function' ? settings.resample(values) : settings.resample;
    resampleArea.hidden = !canResample;
    seedLabel.textContent = 'Sample seed ' + seed;
  }
  function schedule() {
    if (!scheduled) scheduled = requestAnimationFrame(render);
  }
  controls.forEach((wrapper, index) => {
    const specification = settings.controls[index];
    const input = wrapper.querySelector('input, select');
    const output = wrapper.querySelector('output');
    input.addEventListener(specification.options ? 'change' : 'input', () => {
      values[specification.key] = specification.options
        ? specification.options.find(([value]) => String(value) === input.value)[0]
        : Number(input.value);
      if (output) output.textContent = values[specification.key] + specification.unit;
      schedule();
    });
  });
  run.addEventListener('click', () => {
    seed++;
    schedule();
  });
  render();
  return () => {
    resize.disconnect();
    if (scheduled) cancelAnimationFrame(scheduled);
  };
}

const draftTemplate = `Decision and two actions

Outcome, units, and success criterion

Distribution choices, assumptions, and evidence

Baseline comparison

Sensitivity comparison

Recommendation, limitations, and next measurement
`;

function mountDraft() {
  const editor = query('#draft');
  const status = query('#draft-status');
  editor.value = read('capstone', draftTemplate);
  editor.addEventListener('input', () => {
    const saved = write('capstone', editor.value);
    status.textContent = saved ? 'Draft saved in this browser.' : 'Browser storage is unavailable. Download your draft to keep it.';
  });
  query('#download-draft').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob(['# Probability Distributions Lab capstone\n\n', editor.value], { type: 'text/markdown' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'probability-distributions-capstone.md';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

function renderLesson(lesson) {
  const unit = units[lesson.unit - 1];
  const settings = experiments[lesson.model];
  const previous = lessons[lesson.number - 2];
  const next = lessons[lesson.number];
  const python = pythonExamples[lesson.python];
  main.innerHTML = `<div class="lesson-shell">
    ${sideNav(lesson, unit)}
    <article class="lesson-content">
      <header class="lesson-heading">
        <p class="eyebrow">Lesson ${ordinal(lesson.number)} · ${html(unit.title)}</p>
        <h1 id="lesson-title" tabindex="-1">${html(lesson.title)}</h1>
        <p>${html(lesson.intro)}</p>
      </header>
      <section class="lesson-idea"><h2>The idea</h2><p>${html(lesson.idea)}</p></section>
      <section class="predict"><h2>Make a prediction</h2><p>${html(lesson.predict)}</p></section>
      <section class="workbench" aria-labelledby="experiment-title">
        <h2 id="experiment-title">Run the experiment</h2><p>${html(lesson.explore)}</p>
        <div class="control-grid">${controlsMarkup(settings.controls)}</div>
        <div class="chart-actions" hidden><button id="resample" class="button-secondary" type="button">Resample</button><p id="seed"></p></div>
        <div class="experiment-chart">
          <svg id="experiment-svg" class="data-chart" role="img"></svg>
          <div id="legend" class="chart-legend"></div>
          <dl id="metrics" class="metric-grid" aria-live="polite"></dl>
          <p id="chart-note" class="chart-note" hidden></p>
        </div>
      </section>
      <details class="check"><summary>Check your prediction</summary><p>${html(lesson.answer)}</p></details>
      ${python ? `<details class="python-panel">
        <summary>Explore in Python</summary><p>${html(python.prompt)}</p>
        <label class="code-label" for="python-code">Python code</label>
        <textarea id="python-code" class="code-editor" rows="12" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
        <div class="python-buttons">
          <button id="python-run" class="button" type="button">Run Python</button>
          <button id="python-stop" class="button-secondary" type="button" hidden>Stop run</button>
          <button id="python-reset" class="button-quiet" type="button">Restore example</button>
        </div>
        <p id="python-status" class="python-status" role="status">The first run loads Python and its packages.</p>
        <pre id="python-output" class="python-output" aria-label="Python output" hidden></pre>
        <div id="python-figures" class="python-figures"></div>
      </details>` : ''}
      ${lesson.model === 'capstone' ? `<section class="capstone-draft">
        <h2>Capstone draft</h2><p>Use this draft for both capstone lessons. Include enough detail to reproduce your comparison.</p>
        <label for="draft" class="code-label">Your investigation</label>
        <textarea id="draft"></textarea>
        <div class="draft-buttons"><button id="download-draft" class="button-secondary" type="button">Download draft</button>
        <p role="status" id="draft-status"></p></div>
      </section>` : ''}
      <section class="transfer"><h2>Apply it</h2><p>${html(lesson.transfer)}</p></section>
      <nav class="lesson-footer" aria-label="Lesson navigation">
        ${previous ? '<a class="button-secondary previous" href="' + lessonUrl(previous) + '">Previous lesson</a>' : ''}
        <button id="complete" type="button" class="button-secondary" aria-pressed="${completed.has(lesson.slug)}">${completed.has(lesson.slug) ? 'Completed' : 'Mark complete'}</button>
        <a class="button" href="${next ? lessonUrl(next) : '#curriculum'}">${next ? 'Next lesson' : 'Back to course outline'}</a>
        <span id="complete-status" role="status"></span>
      </nav>
    </article>
  </div>`;

  query('#complete').addEventListener('click', event => {
    const button = event.currentTarget;
    const alreadyComplete = completed.delete(lesson.slug);
    if (!alreadyComplete) completed.add(lesson.slug);
    const saved = write('completed', [...completed]);
    button.setAttribute('aria-pressed', String(!alreadyComplete));
    button.textContent = alreadyComplete ? 'Mark complete' : 'Completed';
    query('#side-progress-label').textContent = completed.size + ' of ' + lessons.length + ' completed';
    query('#side-progress').value = completed.size;
    query('[data-lesson-index="' + lesson.slug + '"]').innerHTML = alreadyComplete ? ordinal(lesson.number) :
      '<span aria-label="Completed">✓</span>';
    query('#complete-status').textContent = saved ? '' : 'Progress is available for this session.';
  });

  if (lesson.model === 'capstone') mountDraft();
  const cleanupExperiment = experimentUI(lesson, settings);
  const key = 'python:' + lesson.slug;
  const cleanupPython = python ? mountPython(main, python, {
    read: () => read(key, python.code),
    write: code => write(key, code)
  }) : () => {};
  return () => {
    cleanupExperiment();
    cleanupPython();
  };
}

function route({ initial = false } = {}) {
  const hash = location.hash;
  if (hash === '#main-content') return;
  const fragment = hash.slice(1);
  const newRoute = fragment.startsWith('lesson/') ? fragment : 'home';
  if (currentRoute !== newRoute) {
    cleanup();
    currentRoute = newRoute;
    if (newRoute === 'home') {
      cleanup = renderHome();
      document.title = title;
    } else {
      const lesson = lessons.find(item => item.slug === newRoute.slice(7));
      if (lesson) {
        cleanup = renderLesson(lesson);
        document.title = lesson.title + ' · ' + title;
      } else {
        main.innerHTML = '<section class="unknown"><h1>Lesson not found</h1><p>Choose one of the published lessons from the course outline.</p><a class="button" href="#curriculum">Course outline</a></section>';
        document.title = 'Lesson not found · ' + title;
        cleanup = () => {};
      }
    }
  }
  if (fragment === 'curriculum') {
    query('#curriculum')?.scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo(0, 0);
    if (!initial) (query('#lesson-title') ?? main).focus({ preventScroll: true });
  }
}

document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView({ block: 'start' });
});
window.addEventListener('hashchange', () => route());
route({ initial: true });
