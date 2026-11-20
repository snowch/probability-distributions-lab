import {
  expSample, histogram, lognormalParams, lognormalTail, mean, normalCdf, normalPdf, normalQuantile,
  normalSample, normalTail, poisson, poissonSample, quantile, random, sample, sd
} from './math.js';
import { bars, continuous, curve, cut, experiment, line, marks, metric, num, pct, points, range, select } from './experiment-utils.js';

const sampleSize = (value = 12) => range('n', 'Observations per sample', 1, 60, 1, value);
const averages = experiment([sampleSize()], ({ n }, seed) => {
  const rng = random(seed);
  const observed = sample(1000, () => expSample(rng, .2));
  const averages = sample(1000, () => mean(sample(n, () => expSample(rng, .2))));
  const hi = Math.ceil(Math.max(...observed, ...averages) / 5) * 5;
  return {
    chart: continuous('Wait or average wait (minutes)', 0, hi, [
      bars('Individual waits', histogram(observed, 30, 0, hi)),
      line('Sample averages', histogram(averages, 30, 0, hi), 'secondary')
    ], { cuts: [cut(5, 'Expected mean')] }),
    metrics: [metric('Spread of individual waits', num(sd(observed)) + ' min'),
      metric('Spread of sample averages', num(sd(averages)) + ' min'), metric('Expected spread of averages', num(5 / Math.sqrt(n)) + ' min')]
  };
}, true);

const clt = experiment([
  sampleSize(4), select('kind', 'Population shape', [['skewed', 'Skewed exponential'], ['symmetric', 'Symmetric uniform']], 'skewed')
], ({ n, kind }, seed) => {
  const rng = random(seed);
  const draw = kind === 'skewed' ? () => expSample(rng, 1) - 1 : () => (rng() - .5) * Math.sqrt(12);
  const values = sample(1800, () => mean(sample(n, draw)) * Math.sqrt(n));
  const lo = Math.min(-4, Math.floor(Math.min(...values)));
  const hi = Math.max(4, Math.ceil(Math.max(...values)));
  return {
    chart: continuous('Standardized sample average', lo, hi, [
      bars('Simulated averages', histogram(values, 32, lo, hi)),
      line('Standard normal', curve(lo, hi, x => normalPdf(x)), 'secondary')
    ]),
    metrics: [metric('Simulated mean', num(mean(values), 3)), metric('Simulated standard deviation', num(sd(values), 3)),
      metric('Runs', num(values.length))]
  };
}, true);

const se = experiment([
  range('n', 'Independent readings', 1, 100, 1, 10),
  range('spread', 'Population standard deviation', 2, 20, 1, 10)
], ({ n, spread }) => {
  const error = spread / Math.sqrt(n);
  return {
    chart: continuous('Number of readings', 1, 100, [
      line('Standard error', curve(1, 100, count => spread / Math.sqrt(count))),
      marks('Selected sample size', [{ x: n, y: error }])
    ], { xInteger: true, yLabel: 'Standard error', yMax: spread * 1.1 }),
    metrics: [metric('Standard error at n = ' + n, num(error)), metric('If you quadrupled the sample size', num(error / 2))]
  };
});

const bootstrap = experiment([
  range('n', 'Observed deliveries', 10, 120, 5, 25),
  select('kind', 'Statistic', [[.5, 'Median'], [.9, '90th percentile']], .5)
], ({ n, kind }, seed) => {
  const rng = random(seed);
  const original = sample(n, () => Math.exp(3.35 + .53 * normalSample(rng)));
  const observed = quantile(original.slice().sort((a, b) => a - b), kind);
  const simulated = sample(600, () => {
    const resampled = sample(n, () => original[Math.floor(rng() * n)]).sort((a, b) => a - b);
    return quantile(resampled, kind);
  }).sort((a, b) => a - b);
  const low = quantile(simulated, .05);
  const high = quantile(simulated, .95);
  const min = Math.floor(simulated[0]) - 1;
  const max = Math.ceil(simulated.at(-1)) + 1;
  return {
    chart: continuous('Statistic in each resample (minutes)', min, max, [
      bars('600 bootstrap estimates', histogram(simulated, 24, min, max))
    ], { cuts: [cut(low), cut(observed, 'Observed'), cut(high)] }),
    metrics: [metric('Observed statistic', num(observed) + ' min'), metric('Middle 90% of bootstrap estimates', num(low) + '–' + num(high) + ' min')]
  };
}, true);

const budgets = [[100, '100 runs'], [400, '400 runs'], [1000, '1,000 runs'], [4000, '4,000 runs'], [10000, '10,000 runs'], [100000, '100,000 runs']];
const mc = experiment([
  select('kind', 'Quantity to estimate', [['mean', 'Average outcome'], ['event', 'Event probability']], 'event'),
  select('n', 'Runs per estimate', budgets, 1000),
  select('p', 'True event probability', [[.1, '10%'], [.01, '1%'], [.001, '0.1%'], [.0001, '0.01%']], .001)
], ({ kind, n, p }) => {
  const standardError = count => kind === 'event' ? Math.sqrt(p * (1 - p) / count) : 10 / Math.sqrt(count);
  const error = standardError(n);
  const counts = budgets.map(([value]) => value);
  return {
    chart: continuous('Simulation runs per estimate (log scale)', Math.log10(counts[0]), Math.log10(counts.at(-1)), [
      line('Model-based standard error', curve(2, 5, logCount => standardError(10 ** logCount))),
      marks('Selected budget', [{ x: Math.log10(n), y: error }])
    ], {
      xTicks: [2, 3, 4, 5], xFormat: x => num(10 ** x, 0), yLabel: 'Standard error',
      yPercent: kind === 'event'
    }),
    metrics: [metric('Standard error at this budget', kind === 'event' ? pct(error) + ' points' : num(error, 3)),
      ...(kind === 'event' ? [metric('Expected hits', num(n * p)), metric('Relative standard error', num(100 * error / p, 1) + '%')] : [])],
    note: kind === 'mean' ? 'The model’s outcome standard deviation is 10 units.' : 'Relative standard error is the standard error divided by the true probability.'
  };
});

const zero = experiment([
  select('n', 'Independent tests', [[20, '20'], [100, '100'], [500, '500'], [2000, '2,000']], 20),
  range('p', 'Proposed failure rate', .1, 10, .1, 1, '%')
], ({ n, p }) => {
  const rate = p / 100;
  const chance = x => (1 - x) ** n;
  const bound = 1 - .05 ** (1 / n);
  return {
    chart: continuous('True failure rate', 0, .16, [
      line('Probability of zero failures', curve(0, .16, chance, 320)),
      marks('Proposed rate', [{ x: rate, y: chance(rate) }])
    ], { xPercent: true, yPercent: true, yLabel: 'Chance of zero failures', yMax: 1, cuts: [cut(bound)] }),
    metrics: [metric('Chance of zero failures at proposed rate', pct(chance(rate))), metric('95% one-sided upper limit', pct(bound))]
  };
});

const decision = experiment([
  range('t', 'Proposed delivery window', 20, 55, 1, 35, ' min'),
  range('goal', 'On-time service goal', 60, 99, 1, 90, '%')
], ({ t, goal }) => {
  const achieved = normalCdf(t, 30, 6);
  const required = normalQuantile(goal / 100, 30, 6);
  return {
    chart: continuous('Promised delivery window (minutes)', 10, 60, [
      line('Chance of on-time delivery', curve(10, 60, x => normalCdf(x, 30, 6))),
      marks('Current promise', [{ x: t, y: achieved }]),
      marks('Goal boundary', [{ x: required, y: goal / 100 }], 'neutral')
    ], { yLabel: 'On-time probability', yMax: 1, yPercent: true }),
    metrics: [metric('On-time probability', pct(achieved)), metric('Minimum qualifying window', num(required) + ' min'),
      metric('Service goal', achieved >= goal / 100 ? 'Met' : 'Below target')]
  };
});

const inventoryControls = [
  range('stock', 'Units in stock', 0, 70, 1, 30),
  range('demand', 'Expected demand', 10, 45, 1, 26),
  range('shortage', 'Cost per unit short', 1, 12, 1, 5, ' credits')
];
function inventoryResult({ stock, demand, shortage }) {
  const probabilities = poisson(demand, 145);
  const loss = level => probabilities.reduce((total, p, k) => total + p * (k > level ? (k - level) * shortage : (level - k) * 2), 0);
  const losses = points(Array.from({ length: 71 }, (_, level) => loss(level)));
  const optimum = losses.reduce((best, point) => point.y < best.y ? point : best);
  return {
    chart: continuous('Units in stock', 0, 70, [
      line('Expected loss', losses), marks('Your stock level', [losses[stock]]), marks('Lowest expected loss', [optimum], 'neutral')
    ], { xInteger: true, yLabel: 'Expected loss (credits)' }),
    metrics: [metric('Stockout risk at selected level', pct(probabilities.slice(stock + 1).reduce((sum, p) => sum + p, 0))),
      metric('Expected loss at selected level', num(losses[stock].y) + ' credits'), metric('Lowest-loss stock level', optimum.x + ' units')],
    note: 'Leftover units cost 2 credits each.'
  };
}
const inventory = experiment(inventoryControls, inventoryResult);

const staffControls = [
  range('staff', 'Staff on shift', 1, 8, 1, 3),
  range('arrivals', 'Expected requests per hour', 4, 32, 1, 16),
  range('service', 'Mean service time', 3, 18, 1, 9, ' min')
];
function staffingResult({ staff, arrivals, service }, seed) {
  const rng = random(seed);
  const workload = sample(1500, () => {
    const arrivalsRng = random(Math.floor(rng() * 2 ** 32));
    const serviceRng = random(Math.floor(rng() * 2 ** 32));
    const count = poissonSample(arrivalsRng, arrivals);
    let work = 0;
    for (let i = 0; i < count; i++) work += expSample(serviceRng, 1 / service);
    return work;
  });
  const capacity = staff * 60;
  const hi = Math.ceil(Math.max(510, ...workload) / 50) * 50;
  return {
    chart: continuous('Total staff-minutes required in an hour', 0, hi, [bars('Simulated workload', histogram(workload, 30, 0, hi))], { cuts: [cut(capacity, 'Capacity')] }),
    metrics: [metric('Work exceeds available time', pct(workload.filter(x => x > capacity).length / workload.length)),
      metric('Available staff-time', capacity + ' min'), metric('Expected staff-time needed', num(arrivals * service) + ' min')]
  };
}
const staffing = experiment(staffControls, staffingResult, true);

const stressControls = [
  select('kind', 'Assumed shape', [['normal', 'Normal'], ['lognormal', 'Lognormal']], 'normal'),
  range('t', 'Delivery deadline', 32, 75, 1, 51, ' min'),
  range('penalty', 'Penalty for a late delivery', 5, 150, 5, 70, ' credits')
];
function stressResult({ kind, t, penalty }) {
  const actionTail = (time, center) => {
    const spread = 10;
    if (kind === 'normal') return normalTail(time, center, spread);
    const params = lognormalParams(center, spread);
    return lognormalTail(time, params.mu, params.sigma);
  };
  const firstCost = time => penalty * actionTail(time, 34);
  const secondCost = time => 3 + penalty * actionTail(time, 29);
  const standard = firstCost(t);
  const fast = secondCost(t);
  return {
    chart: continuous('Delivery deadline (minutes)', 32, 75, [
      line('Standard delivery', curve(32, 75, firstCost)),
      line('Expedited delivery', curve(32, 75, secondCost), 'secondary', true)
    ], { yLabel: 'Expected cost (credits)', cuts: [cut(t, 'Chosen deadline')] }),
    metrics: [metric('Standard expected cost', num(standard) + ' credits'),
      metric('Expedited expected cost', num(fast) + ' credits'),
      metric('Lower expected cost', Math.abs(standard - fast) < .005 ? 'Effectively tied' : standard < fast ? 'Standard' : 'Expedited')],
    note: 'Expediting costs 3 credits per delivery and changes the mean from 34 to 29 minutes. Both options have a 10-minute standard deviation.'
  };
}
const stress = experiment(stressControls, stressResult);
const scenarios = {
  delivery: { controls: stressControls, compute: stressResult },
  inventory: { controls: inventoryControls, compute: inventoryResult },
  staffing: { controls: staffControls, compute: staffingResult }
};
const scenario = select('scenario', 'Starting scenario', [
  ['delivery', 'A delivery promise'], ['inventory', 'Inventory stock'], ['staffing', 'Support staffing']
], 'delivery');
const capstone = {
  controls: [scenario, ...stressControls.map(control => ({ ...control, when: 'delivery' })),
    ...inventoryControls.map(control => ({ ...control, when: 'inventory' })),
    ...staffControls.map(control => ({ ...control, when: 'staffing' }))],
  compute: (values, seed) => scenarios[values.scenario].compute(values, seed),
  resample: values => values.scenario === 'staffing'
};

export const decisionExperiments = { averages, clt, se, bootstrap, mc, zero, decision, inventory, staffing, stress, capstone };
