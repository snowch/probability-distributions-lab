import { mean } from './math.js';
import { pct } from './experiment-utils.js';

function sampleRows(samples, summarize, format = String) {
  return samples.map(sample => `
    <li>
      <span>${sample.join(', ')}</span>
      <span class="diagram-arrow" aria-hidden="true">→</span>
      <strong>${format(summarize(sample))}</strong>
    </li>`).join('');
}

function trialDiagram() {
  const trials = [['H', 'T', 'H'], ['T', 'T', 'H'], ['H', 'H', 'T']];
  const heads = trial => trial.filter(flip => flip === 'H').length;
  const shares = [0, 1, 2, 3].map(count => trials.filter(trial => heads(trial) === count).length);
  return `
    <figure class="lesson-diagram sample-diagram">
      <figcaption>Three example rounds. H means heads and T means tails.</figcaption>
      <div class="sample-diagram-flow">
        <div>
          <div class="sample-diagram-labels"><span>Flips in one round</span><span>Head count</span></div>
          <ol class="sample-diagram-rows">${sampleRows(trials, heads)}</ol>
        </div>
        <span class="diagram-arrow" aria-hidden="true">→</span>
        <div class="sample-diagram-chart">
          <strong>Share of the three rounds</strong>
          <ol class="diagram-plot" aria-label="Share by head count">
            ${shares.map((share, count) => `
              <li aria-label="${count} heads, ${share} out of 3 rounds">
                <div class="diagram-plot-mark-area">
                  <span>${share ? share + '/3' : '0'}</span>
                  <span class="diagram-mini-bar" style="--bar-height: ${share * 27}px" aria-hidden="true"></span>
                </div>
                <span>${count}</span>
              </li>`).join('')}
          </ol>
          <span class="diagram-axis-label">Heads in one round</span>
        </div>
      </div>
    </figure>`;
}

function averagesDiagram() {
  const samples = [[1, 4, 7], [1, 2, 3], [2, 4, 6]];
  const averages = samples.map(mean);
  return `
    <figure class="lesson-diagram sample-diagram">
      <figcaption>One average per sample. Each sample contains three waits.</figcaption>
      <div class="sample-diagram-flow">
        <div>
          <div class="sample-diagram-labels"><span>Waits (minutes)</span><span>Average</span></div>
          <ol class="sample-diagram-rows">${sampleRows(samples, mean, average => average + ' min')}</ol>
        </div>
        <span class="diagram-arrow" aria-hidden="true">→</span>
        <div class="sample-diagram-chart">
          <strong>One dot per average</strong>
          <ol class="diagram-plot" aria-label="Number of samples by average wait">
            ${[2, 3, 4].map(average => {
              const count = averages.filter(value => value === average).length;
              return `<li aria-label="${average} minutes, ${count} ${count === 1 ? 'sample' : 'samples'}">
                <div class="diagram-plot-mark-area" aria-hidden="true">${'<span class="diagram-dot"></span>'.repeat(count)}</div>
                <span aria-hidden="true">${average}</span>
              </li>`;
            }).join('')}
          </ol>
          <span class="diagram-axis-label">Average wait (minutes)</span>
        </div>
      </div>
    </figure>`;
}

function hypergeometricDiagram() {
  return `
    <figure class="lesson-diagram branch-diagram">
      <figcaption>Chance that the next random draw is faulty</figcaption>
      <div class="branch-origin">
        <strong>4 faulty parts out of 20</strong>
        <span>First draw finds a faulty part</span>
      </div>
      <div class="diagram-branches">
        <div class="diagram-branch">
          <strong>Without replacement</strong>
          <span>The part stays out</span>
          <b>3 / 19</b>
        </div>
        <div class="diagram-branch">
          <strong>With replacement</strong>
          <span>The part goes back</span>
          <b>4 / 20</b>
        </div>
      </div>
    </figure>`;
}

function weatherDiagram() {
  return `
    <figure class="lesson-diagram branch-diagram" id="weather-diagram">
      <figcaption>Chance the trip takes more than 35 minutes</figcaption>
      <div class="branch-origin"><strong data-weather-status>Weather unknown</strong></div>
      <div class="diagram-branches">
        <div class="diagram-branch" data-branch="low">
          <strong>Dry day</strong>
          <span data-dry-share></span>
          <b data-dry-late></b>
        </div>
        <div class="diagram-branch" data-branch="high">
          <strong>Rainy day</strong>
          <span data-rain-share></span>
          <b data-rain-late></b>
        </div>
      </div>
      <p class="diagram-result" data-weather-result></p>
    </figure>`;
}

export function updateWeatherDiagram(diagram, weather) {
  const { rain, dryLate, rainLate, selected, mixTail } = weather;
  const dry = 1 - rain;
  diagram.querySelector('[data-weather-status]').textContent = selected === 'all' ? 'Weather unknown' : 'Weather known';
  diagram.querySelector('[data-dry-share]').textContent = pct(dry) + ' forecast chance';
  diagram.querySelector('[data-rain-share]').textContent = pct(rain) + ' forecast chance';
  diagram.querySelector('[data-dry-late]').textContent = pct(dryLate);
  diagram.querySelector('[data-rain-late]').textContent = pct(rainLate);
  for (const branch of diagram.querySelectorAll('[data-branch]')) {
    branch.classList.toggle('diagram-branch-selected', branch.dataset.branch === selected);
  }

  const result = diagram.querySelector('[data-weather-result]');
  if (selected === 'all') {
    result.textContent = 'Both branches contribute. ' + pct(dry) + ' × ' + pct(dryLate) + ' + ' +
      pct(rain) + ' × ' + pct(rainLate) + ' ≈ ' + pct(mixTail) + '.';
  } else {
    result.textContent = selected === 'low' ? 'Use the dry-day chance.' : 'Use the rainy-day chance.';
  }
}

function projectDiagram() {
  return `
    <figure class="lesson-diagram project-diagram">
      <figcaption>Two example schedules for the same kickoff and tasks</figcaption>
      <div class="project-key">
        <span>Kickoff 3 days</span><span>Task A 4 days</span><span>Task B 6 days</span>
      </div>
      <div class="project-axis"><span>Day 0</span><span>Day 12 deadline</span></div>
      <div class="project-row">
        <div class="project-track" aria-hidden="true">
          <span class="project-kickoff">Kickoff</span><span class="project-task-a">A</span><span class="project-task-b">B</span>
        </div>
        <p><strong>Sequential</strong> finishes on day 13 and misses the deadline.</p>
      </div>
      <div class="project-row">
        <div class="project-track project-track-parallel" aria-hidden="true">
          <span class="project-kickoff">Kickoff</span><span class="project-task-a">A</span><span class="project-task-b">B</span>
        </div>
        <p><strong>Parallel</strong> finishes on day 9 and meets the deadline.</p>
      </div>
    </figure>`;
}

const diagrams = {
  'one-trial': trialDiagram,
  hypergeometric: hypergeometricDiagram,
  conditioning: weatherDiagram,
  'project-deadline': projectDiagram,
  'distribution-of-averages': averagesDiagram
};

export function lessonDiagramMarkup(slug) {
  return diagrams[slug]?.() ?? '';
}
