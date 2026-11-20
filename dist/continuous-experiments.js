import {
  betaPdf, clamp, expCdf, expPdf, expSample, gammaPdf, histogram, lognormalPdf,
  normalCdf, normalPdf, normalQuantile, normalTail, random, sample
} from './math.js';
import { area, bars, continuous, curve, cut, experiment, line, marks, metric, num, pct, range, select } from './experiment-utils.js';

function densityChart(label, lo, hi, pdf, from, to, markers = []) {
  return continuous(label, lo, hi, [line('Model density', curve(lo, hi, pdf))], {
    area: from < to ? area(from, to, pdf) : null,
    cuts: markers
  });
}
const ordered = (a, b) => [Math.min(a, b), Math.max(a, b)];

const measure = experiment([range('time', 'Reported wait', 1, 14, .5, 4, ' min'),
  select('width', 'Rounding interval', [[1, '1 minute'], [.5, '0.5 minutes'], [.1, '0.1 minutes'], [.01, '0.01 minutes']], 1)
], ({ time, width }) => {
  const rate = .2;
  const low = time - width / 2;
  const high = time + width / 2;
  const probability = expCdf(high, rate) - expCdf(low, rate);
  return {
    chart: densityChart('Actual wait (minutes)', 0, 16, x => expPdf(x, rate), low, high, [cut(low), cut(high)]),
    metrics: [metric('Actual interval', num(low, 3) + '–' + num(high, 3) + ' min'), metric('Probability of that reading', pct(probability))]
  };
});

const density = experiment([
  range('center', 'Interval center', 12, 48, 1, 30, ' min'),
  range('width', 'Interval width', 1, 16, 1, 4, ' min')
], ({ center, width }) => {
  const low = center - width / 2;
  const high = center + width / 2;
  return {
    chart: densityChart('Delivery time (minutes)', 0, 60, x => normalPdf(x, 30, 6), low, high, [cut(low), cut(high)]),
    metrics: [metric('Shaded area', pct(normalCdf(high, 30, 6) - normalCdf(low, 30, 6))),
      metric('Interval', num(low) + '–' + num(high) + ' min'), metric('Density at center', num(normalPdf(center, 30, 6), 4) + ' per min')]
  };
});

const histogramExperiment = experiment([
  range('bins', 'Number of bins', 4, 30, 1, 10),
  select('scale', 'Vertical scale', [['probability', 'Probability per bin'], ['density', 'Probability density']], 'probability')
], ({ bins, scale }) => {
  const rng = random(109);
  const values = sample(150, () => expSample(rng, .18));
  const hi = Math.ceil(Math.max(...values) / 5) * 5;
  const isDensity = scale === 'density';
  const width = hi / bins;
  return {
    chart: continuous('Observed wait (minutes)', 0, hi, [bars('Same 150 observations', histogram(values, bins, 0, hi, isDensity))], {
      yLabel: isDensity ? 'Density' : 'Probability per bin', yPercent: !isDensity
    }),
    metrics: [metric('Observations', '150'), metric('Bin width', num(width) + ' min'), metric(isDensity ? 'Total bar area' : 'Sum of bar heights', '1')]
  };
});

const cdf = experiment([
  range('a', 'Endpoint A', 8, 52, 1, 25, ' min'),
  range('b', 'Endpoint B', 8, 52, 1, 35, ' min')
], ({ a, b }) => {
  const [lo, hi] = ordered(a, b);
  const fn = x => normalCdf(x, 30, 6);
  return {
    chart: continuous('Delivery time (minutes)', 0, 60, [
      line('Cumulative probability', curve(0, 60, fn)),
      marks('Endpoints', [{ x: lo, y: fn(lo) }, { x: hi, y: fn(hi) }])
    ], { yLabel: 'Cumulative probability', yPercent: true, yMax: 1, cuts: [cut(lo), cut(hi)] }),
    metrics: [metric('By ' + hi + ' min', pct(fn(hi))), metric('Above ' + hi + ' min', pct(1 - fn(hi))),
      metric('Between ' + lo + ' and ' + hi + ' min', pct(fn(hi) - fn(lo)))]
  };
});

const quantile = experiment([range('q', 'Percentile', 5, 99, 1, 90, '%')], ({ q }) => {
  const p = q / 100;
  const time = normalQuantile(p, 30, 6);
  return {
    chart: densityChart('Delivery time (minutes)', 0, 60, x => normalPdf(x, 30, 6), 0, time, [cut(time, 'Percentile')]),
    metrics: [metric('Time at the percentile', num(time) + ' min'), metric('At or below', pct(p)), metric('Later than that', pct(1 - p))]
  };
});

const threeViews = experiment([
  select('view', 'View', [['model', 'Model density and cumulative curve'], ['sample', 'Sample histogram']], 'model'),
  range('a', 'Endpoint A', 0, 16, .5, 3, ' min'),
  range('b', 'Endpoint B', 0, 16, .5, 8, ' min')
], ({ view, a, b }, seed) => {
  const [lo, hi] = ordered(a, b);
  const rng = random(seed);
  const values = sample(300, () => expSample(rng, .2));
  const max = Math.max(20, Math.ceil(Math.max(...values)));
  const fn = x => expCdf(x, .2);
  const endpoints = lo === hi ? [{ x: lo, y: fn(lo) }] : [{ x: lo, y: fn(lo) }, { x: hi, y: fn(hi) }];
  const cuts = endpoints.map(point => cut(point.x));
  const observed = values.filter(x => x >= lo && x <= hi).length / values.length;
  const lower = fn(lo);
  const upper = fn(hi);
  const probability = upper - lower;
  const rise = num(probability * 100) + ' percentage points';
  const metrics = [metric('Observed share', pct(observed))];
  if (view === 'sample') {
    return {
      chart: continuous('Wait (minutes)', 0, max, [bars('Observed density', histogram(values, 22, 0, max))], { cuts }),
      metrics: [...metrics, metric('Shaded area', pct(probability)), metric('Cumulative rise', rise)]
    };
  }
  return {
    chart: {
      ...densityChart('Wait (minutes)', 0, 25, x => expPdf(x, .2), lo, hi, cuts),
      height: 174, sharedXAxis: true
    },
    comparison: {
      chart: continuous('Wait (minutes)', 0, 25, [
        line('Cumulative probability', curve(0, 25, fn)), marks('Endpoints', endpoints)
      ], { height: 174, yLabel: 'Cumulative probability', yPercent: true, yMax: 1, cuts, rise: endpoints }),
      area: pct(probability),
      rise: pct(upper) + ' by ' + num(hi) + ' min − ' + pct(lower) + ' by ' + num(lo) + ' min ≈ ' + rise
    },
    metrics
  };
}, true);

const uniform = experiment([
  range('end', 'Minutes between shuttles', 3, 24, 1, 12, ' min'),
  range('t', 'Wait threshold', 0, 24, 1, 3, ' min')
], ({ end, t }) => {
  const inside = Math.min(t, end);
  const nodes = [{ x: 0, y: 1 / end }, { x: end, y: 1 / end }, { x: end, y: 0 }, { x: 26, y: 0 }];
  return {
    chart: continuous('Wait (minutes)', 0, 26, [line('Uniform density', nodes)], {
      area: inside > 0 ? area(0, inside, () => 1 / end) : null, cuts: [cut(t)]
    }),
    metrics: [metric('Wait at most ' + t + ' min', pct(inside / end)), metric('Mean wait', num(end / 2) + ' min')]
  };
});

const normal = experiment([
  range('mu', 'Mean', 15, 45, 1, 30, ' min'),
  range('sigma', 'Standard deviation', 2, 12, .5, 6, ' min'),
  range('t', 'Late threshold', 15, 60, 1, 38, ' min')
], ({ mu, sigma, t }) => ({
  chart: densityChart('Delivery time (minutes)', -20, 85, x => normalPdf(x, mu, sigma), t, 85, [cut(t, 'Threshold')]),
  metrics: [metric('Chance above threshold', pct(normalTail(t, mu, sigma))), metric('Chance below threshold', pct(normalCdf(t, mu, sigma))),
    metric('Standard deviations from the mean', num((t - mu) / sigma))]
}));

const exponential = experiment([
  range('rate', 'Arrivals per 10 minutes', .5, 8, .5, 2),
  range('t', 'Wait threshold', 1, 30, 1, 10, ' min')
], ({ rate, t }) => ({
  chart: densityChart('Wait for the next arrival (minutes)', 0, 55, x => expPdf(x, rate / 10), t, 55, [cut(t)]),
  metrics: [metric('Mean wait', num(10 / rate) + ' min'), metric('Wait longer than threshold', pct(Math.exp(-rate * t / 10))),
    metric('Zero arrivals by threshold', pct(Math.exp(-rate * t / 10)))],
  note: 'The full tail probability includes waits beyond the chart.'
}));

const gamma = experiment([
  range('k', 'Arrivals needed', 1, 8, 1, 5),
  range('rate', 'Arrivals per 10 minutes', 1, 6, .5, 2)
], ({ k, rate }) => {
  const perMinute = rate / 10;
  const hi = Math.max(45, 1.5 * k / perMinute + 4 * Math.sqrt(k) / perMinute);
  return {
    chart: continuous('Total wait (minutes)', 0, hi, [
      line('Wait for ' + k + (k === 1 ? ' arrival' : ' arrivals'), curve(0, hi, x => gammaPdf(x, k, perMinute))),
      ...(k > 1 ? [line('Wait for first arrival', curve(0, hi, x => expPdf(x, perMinute)), 'secondary', true)] : [])
    ], { cuts: [cut(k / perMinute, 'Mean')] }),
    metrics: [metric('Mean total wait', num(k / perMinute) + ' min'), metric('Standard deviation', num(Math.sqrt(k) / perMinute) + ' min')]
  };
});

const lognormal = experiment([
  range('sigma', 'Log-scale spread', .1, 1.1, .05, .5),
  select('scale', 'Measurement', [['original', 'Original values'], ['logged', 'Log of each value']], 'original')
], ({ sigma, scale }) => {
  const mu = Math.log(20);
  const p90 = Math.exp(normalQuantile(.9, mu, sigma));
  const chart = scale === 'original'
    ? continuous('Lead time (days)', 0, Math.max(75, p90 * 1.8), [line('Lognormal density', curve(0, Math.max(75, p90 * 1.8), x => lognormalPdf(x, mu, sigma)))], { cuts: [cut(20, 'Median'), cut(p90)] })
    : continuous('Log lead time', mu - 4 * sigma, mu + 4 * sigma, [line('Normal density of logs', curve(mu - 4 * sigma, mu + 4 * sigma, x => normalPdf(x, mu, sigma)))], { cuts: [cut(mu, 'Median'), cut(Math.log(p90))] });
  return { chart, metrics: [metric('Median on original scale', '20 days'), metric('90th percentile on original scale', num(p90) + ' days')] };
});

const beta = experiment([
  range('mean', 'Mean defect rate', 10, 90, 5, 20, '%'),
  range('total', 'Concentration', 12, 100, 2, 20)
], ({ mean, total }) => {
  const p = mean / 100;
  return {
    chart: continuous('Possible defect rate', 0, 1, [
      line('Beta density', curve(0, 1, x => betaPdf(x, p * total, (1 - p) * total)))
    ], { cuts: [cut(clamp(p, 0, 1), 'Mean')], xPercent: true }),
    metrics: [metric('Mean defect rate', pct(p)), metric('Standard deviation', num(100 * Math.sqrt(p * (1 - p) / (total + 1))) + ' percentage points'),
      metric('Shape parameters', 'α = ' + num(p * total) + ', β = ' + num((1 - p) * total))]
  };
});

export const continuousExperiments = {
  measure, density, histogram: histogramExperiment, cdf, quantile, 'three-views': threeViews,
  uniform, normal, exponential, gamma, lognormal, beta
};
