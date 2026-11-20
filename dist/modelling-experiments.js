import {
  betaPdf, expCdf, expSample, histogram, lognormalParams, lognormalPdf, lognormalTail, mean, normalCdf,
  normalPdf, normalQuantile, normalSample, normalTail, random, sample, sd
} from './math.js';
import { bars, continuous, curve, cut, dots, experiment, line, metric, num, pct, range, select } from './experiment-utils.js';

const sampleSize = (value = 30) => select('n', 'Sample size', [[20, '20'], [30, '30'], [60, '60'], [100, '100'], [200, '200']], value);
const models = {
  normal: { label: 'Normal', support: 'All real numbers', cdf: x => normalCdf(x, .5, .45), pdf: x => normalPdf(x, .5, .45) },
  lognormal: { label: 'Lognormal', support: 'Positive real values', cdf: x => x <= 0 ? 0 : normalCdf(Math.log(x), -.45, .55), pdf: x => lognormalPdf(x, -.45, .55) },
  beta: { label: 'Beta', support: 'Between zero and one', cdf: x => {
    const t = Math.min(1, Math.max(0, x));
    return t ** 3 * (10 - 15 * t + 6 * t * t);
  }, pdf: x => betaPdf(x, 3, 3) }
};
const support = experiment([
  select('data', 'Quantity', [['time', 'Elapsed time'], ['fraction', 'Fraction between 0 and 1'], ['error', 'Signed measurement error']], 'time'),
  select('kind', 'Candidate model', [['normal', 'Normal'], ['lognormal', 'Lognormal'], ['beta', 'Beta']], 'normal')
], ({ data, kind }) => {
  const model = models[kind];
  const outside = (data === 'error' ? 0 : model.cdf(0)) + (data === 'fraction' ? 1 - model.cdf(1) : 0);
  return {
    chart: continuous('Value (common model scale)', -1.5, 3, [line(model.label, curve(-1.5, 3, model.pdf))], {
      cuts: data === 'error' ? [] : [cut(0, 'Lower bound'), ...(data === 'fraction' ? [cut(1, 'Upper bound')] : [])]
    }),
    metrics: [metric('Values the model allows', model.support), metric('Probability outside bounds', pct(outside))],
    note: data === 'error' && kind !== 'normal' ? 'This candidate excludes negative errors, which the measurement can produce.' : ''
  };
});

function matchedTails(t, n) {
  const mu = 30;
  const spread = 10;
  const matched = lognormalParams(mu, spread);
  const hi = Math.max(80, t + 10);
  const normal = normalTail(t, mu, spread);
  const lognormal = lognormalTail(t, matched.mu, matched.sigma);
  return {
    chart: continuous('Delivery time (minutes)', -7, hi, [
      line('Normal', curve(-7, hi, x => normalPdf(x, mu, spread))),
      line('Lognormal', curve(-7, hi, x => lognormalPdf(x, matched.mu, matched.sigma)), 'secondary', true)
    ], { cuts: [cut(t, 'Deadline')] }),
    metrics: [metric('Normal above deadline', pct(normal)), metric('Lognormal above deadline', pct(lognormal)),
      ...(n ? [metric('Expected late observations · normal / lognormal', num(n * normal, 3) + ' / ' + num(n * lognormal, 3))] : [])],
    note: 'Both models have mean 30 min and standard deviation 10 min.'
  };
}
const moments = experiment([range('t', 'Deadline', 30, 75, 1, 50, ' min')], ({ t }) => matchedTails(t));
const tail = experiment([
  range('t', 'Deadline', 35, 100, 1, 65, ' min'), range('n', 'Observations collected', 20, 1000, 20, 100)
], ({ t, n }) => matchedTails(t, n));

const fit = experiment([sampleSize(20)], ({ n }, seed) => {
  const rng = random(seed);
  const values = sample(n, () => 30 + 6 * normalSample(rng));
  const center = mean(values);
  const spread = sd(values);
  return {
    chart: continuous('Measurement', 0, 60, [
      bars('Observed sample', histogram(values, 16, 0, 60)),
      line('Fitted normal', curve(0, 60, x => normalPdf(x, center, spread)), 'secondary'),
      line('Generating model', curve(0, 60, x => normalPdf(x, 30, 6)), 'neutral', true)
    ]),
    metrics: [metric('Fitted mean', num(center)), metric('Fitted standard deviation', num(spread))]
  };
}, true);

const qq = experiment([
  select('kind', 'Data source', [['normal', 'Symmetric normal'], ['skewed', 'Right-skewed lognormal']], 'normal'), sampleSize(60)
], ({ kind, n }, seed) => {
  const rng = random(seed);
  const values = sample(n, () => kind === 'normal' ? 30 + 6 * normalSample(rng) : Math.exp(3.3 + .58 * normalSample(rng))).sort((a, b) => a - b);
  const center = mean(values);
  const spread = sd(values);
  const points = values.map((value, i) => ({ x: normalQuantile((i + .5) / n, center, spread), y: value }));
  const lo = Math.floor(Math.min(values[0], points[0].x)) - 1;
  const hi = Math.ceil(Math.max(values.at(-1), points.at(-1).x)) + 1;
  return {
    chart: continuous('Fitted normal quantile', lo, hi, [
      line('Perfect agreement', [{ x: lo, y: lo }, { x: hi, y: hi }], 'neutral', true),
      dots('Observed quantile', points)
    ], { yLabel: 'Observed quantile', yMin: lo, yMax: hi }),
    metrics: [metric('Highest observed value', num(values.at(-1))), metric('Matching model quantile', num(points.at(-1).x))]
  };
}, true);

const delivery = experiment([
  sampleSize(100), range('t', 'Promise time', 20, 100, 1, 55, ' min')
], ({ n, t }, seed) => {
  const rng = random(seed);
  const logs = sample(n, () => 3.35 + .48 * normalSample(rng));
  const values = logs.map(Math.exp);
  const center = mean(values);
  const spread = sd(values);
  const logCenter = mean(logs);
  const logSpread = sd(logs);
  const hi = Math.max(100, Math.ceil(Math.max(...values)), t + 5);
  return {
    chart: continuous('Delivery time (minutes)', 0, hi, [
      bars('Observed sample', histogram(values, 25, 0, hi)),
      line('Fitted normal', curve(0, hi, x => normalPdf(x, center, spread)), 'secondary'),
      line('Fitted lognormal', curve(0, hi, x => lognormalPdf(x, logCenter, logSpread)), 'neutral', true)
    ], { cuts: [cut(t, 'Promise')] }),
    metrics: [metric('Observed above promise', pct(values.filter(x => x > t).length / n)),
      metric('Normal prediction', pct(normalTail(t, center, spread))), metric('Lognormal prediction', pct(lognormalTail(t, logCenter, logSpread)))]
  };
}, true);

const sum = experiment([range('n', 'Independent journey legs', 1, 8, 1, 4)], ({ n }, seed) => {
  const rng = random(seed);
  const values = sample(800, () => sample(n, () => expSample(rng, .125)).reduce((total, time) => total + time, 0));
  const hi = Math.ceil(Math.max(...values) / 10) * 10;
  return {
    chart: continuous('Total journey time (minutes)', 0, hi, [bars('Simulated total', histogram(values, 26, 0, hi))], { cuts: [cut(n * 8, 'Expected mean')] }),
    metrics: [metric('Expected mean', num(n * 8) + ' min'), metric('Expected standard deviation', num(Math.sqrt(n) * 8) + ' min'),
      metric('Simulated standard deviation', num(sd(values)) + ' min')],
    note: 'Each independent leg has mean 8 min and standard deviation 8 min.'
  };
}, true);

const dependence = experiment([
  range('rho', 'Correlation between legs', 0, 90, 5, 0, '%'),
  range('t', 'Deadline', 36, 66, 1, 46, ' min')
], ({ rho, t }) => {
  const center = 36;
  const spread = 4 * Math.sqrt(3 + 6 * rho / 100);
  const base = 4 * Math.sqrt(3);
  return {
    chart: continuous('Total time (minutes)', 0, 78, [
      line('With selected correlation', curve(0, 78, x => normalPdf(x, center, spread))),
      line('Independent reference', curve(0, 78, x => normalPdf(x, center, base)), 'secondary', true)
    ], { cuts: [cut(t, 'Deadline')] }),
    metrics: [metric('Chance of missing deadline', pct(normalTail(t, center, spread))),
      metric('Independent reference', pct(normalTail(t, center, base))), metric('Total standard deviation', num(spread) + ' min')],
    note: 'Both curves have a total mean of 36 minutes.'
  };
});

function weatherModel(rain, gap, group, isCondition) {
  const weight = rain / 100;
  const first = 24;
  const second = first + gap;
  const mixPdf = x => (1 - weight) * normalPdf(x, first, 4) + weight * normalPdf(x, second, 4);
  const mixTail = (1 - weight) * normalTail(35, first, 4) + weight * normalTail(35, second, 4);
  const all = line(isCondition ? 'All days' : 'Pooled distribution', curve(4, 70, mixPdf));
  const low = line(isCondition ? 'Dry days' : 'Weekdays', curve(4, 70, x => normalPdf(x, first, 4)), 'secondary', true);
  const high = line(isCondition ? 'Rainy days' : 'Weekends', curve(4, 70, x => normalPdf(x, second, 4)), 'neutral', true);
  return {
    chart: continuous('Time (minutes)', 4, 70, group === 'low' ? [low] : group === 'high' ? [high] : [all, low, high], {
      cuts: [cut(35, '35 min')], yMax: .11
    }),
    metrics: [metric('Selected distribution mean', num(group === 'low' ? first : group === 'high' ? second : first + weight * gap) + ' min'),
      metric('Chance above 35 min', pct(group === 'low' ? normalTail(35, first, 4) : group === 'high' ? normalTail(35, second, 4) : mixTail))]
  };
}

const condition = experiment([
  range('rain', 'Chance of rain', 5, 95, 5, 30, '%'),
  select('group', 'What you know', [['all', 'Weather unknown'], ['low', 'Dry day'], ['high', 'Rainy day']], 'all')
], ({ rain, group }) => weatherModel(rain, 15, group, true));
const mixture = experiment([
  range('rain', 'Weekend share', 0, 100, 5, 30, '%'),
  range('gap', 'Difference in means', 0, 28, 1, 12, ' min')
], ({ rain, gap }) => weatherModel(rain, gap, 'all', false));

const extremes = experiment([
  range('n', 'Independent times', 1, 10, 1, 4),
  range('t', 'Threshold', 1, 45, 1, 15, ' min')
], ({ n, t }) => {
  const minimum = x => expCdf(x, n / 10);
  const maximum = x => expCdf(x, .1) ** n;
  return {
    chart: continuous('Time threshold (minutes)', 0, 48, [
      line('First completion', curve(0, 48, minimum)),
      line('Last completion', curve(0, 48, maximum), 'secondary', true)
    ], { yLabel: 'Cumulative probability', yPercent: true, yMax: 1, cuts: [cut(t)] }),
    metrics: [metric('First completion by threshold', pct(minimum(t))), metric('Last completion by threshold', pct(maximum(t)))]
  };
});

const deadline = experiment([
  range('t', 'Project deadline', 8, 55, 1, 25, ' days'),
  range('risk', 'Chance of shared disruption', 0, 60, 5, 20, '%')
], ({ t, risk }, seed) => {
  const rng = random(seed);
  const cases = sample(1600, () => {
    const delay = rng() < risk / 100 ? 6 : 0;
    const kickoff = 3 + expSample(rng, .4);
    const first = 4 + expSample(rng, .28) + delay;
    const second = 3 + expSample(rng, .24) + delay;
    return { sequential: kickoff + first + second, parallel: kickoff + Math.max(first, second) };
  });
  const sequential = cases.map(item => item.sequential);
  const parallel = cases.map(item => item.parallel);
  const hi = Math.max(58, Math.ceil(Math.max(...sequential)));
  return {
    chart: continuous('Project duration (days)', 0, hi, [
      bars('Parallel schedule', histogram(parallel, 26, 0, hi)),
      line('Sequential schedule', histogram(sequential, 26, 0, hi), 'secondary')
    ], { cuts: [cut(t, 'Deadline')] }),
    metrics: [metric('Parallel miss rate', pct(parallel.filter(x => x > t).length / cases.length)),
      metric('Sequential miss rate', pct(sequential.filter(x => x > t).length / cases.length))]
  };
}, true);

export const modellingExperiments = { support, moments, fit, qq, tail, delivery, sum, dependence, condition, mixture, extremes, deadline };
