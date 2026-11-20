import { binomial, choose, cumsum, hypergeometric, poisson, random, seq, sumFrom } from './math.js';
import { bars, discrete, experiment, marks, metric, num, pct, points, range, select, steps } from './experiment-utils.js';

const chance = (value = 50) => range('p', 'Chance of success', 5, 95, 5, value, '%');
const flips = (value = 10) => range('n', 'Flips in each round', 1, 20, 1, value);
const sizes = [[20, '20 rounds'], [200, '200 rounds'], [2000, '2,000 rounds']];
const fixedRounds = select('rounds', 'Simulated sample', sizes, 20);

function highlight(mass, selected, start = 0) {
  return points(mass, start).map(point => ({ ...point, active: selected(point.x) }));
}
function samples(mass, rounds, seed) {
  const rng = random(seed);
  const cdf = cumsum(mass);
  const outcomes = mass.map(() => 0);
  for (let i = 0; i < rounds; i++) {
    const draw = rng();
    const match = cdf.findIndex(probability => draw < probability);
    outcomes[match < 0 ? mass.length - 1 : match]++;
  }
  return outcomes.map(count => count / rounds);
}

function compare(label, mass, first, rounds, seed) {
  const observed = samples(mass, rounds, seed);
  return {
    chart: discrete(label, first, first + mass.length - 1, [
      bars('Observed share', points(observed, first)),
      marks('Exact probability', points(mass, first)),
    ]),
    metrics: [
      metric('Rounds', num(rounds)),
      metric('Expected value', num(mass.reduce((sum, p, i) => sum + (i + first) * p, 0))),
      metric('Largest gap', pct(Math.max(...observed.map((share, i) => Math.abs(share - mass[i]))))),
    ]
  };
}

const trial = experiment([
  select('kind', 'One round', [['coin', 'One coin toss'], ['die', 'One die roll'], ['flips', 'Several coin flips']], 'flips'),
  flips(3), fixedRounds
], ({ kind, n, rounds }, seed) => {
  switch (kind) {
    case 'coin': return compare('Heads in one toss', [.5, .5], 0, rounds, seed);
    case 'die': return compare('Value on the die', Array(6).fill(1 / 6), 1, rounds, seed);
    default: return compare('Heads in one round', binomial(n, .5), 0, rounds, seed);
  }
}, true);

const dice = experiment([range('k', 'Target total', 2, 12, 1, 7)], ({ k }) => {
  const pairs = seq(1, 6).flatMap(a => seq(1, 6).map(b => [a, b]));
  const counts = seq(2, 12).map(x => pairs.filter(([a, b]) => a + b === x).length);
  return {
    chart: discrete('Sum of two dice', 2, 12, [bars('Exact probability', highlight(counts.map(x => x / 36), x => x === k, 2))]),
    metrics: [metric('Probability of ' + k, pct(counts[k - 2] / 36)), metric('Matching pairs', counts[k - 2] + ' out of 36')],
    note: pairs.filter(([a, b]) => a + b === k).map(([a, b]) => '(' + a + ', ' + b + ')').join(' · ')
  };
});

const mass = experiment([flips(3), chance(), range('k', 'Highlight a head count', 0, 20, 1, 2)], ({ n, p, k }) => {
  const probabilities = binomial(n, p / 100);
  return {
    chart: discrete('Heads in one round', 0, n, [bars('Probability mass', highlight(probabilities, x => x === k))]),
    metrics: [metric('Exactly ' + k + ' heads', pct(probabilities[k] ?? 0)), metric('Total probability', pct(sumFrom(probabilities, 0)))],
    note: k > n ? 'That count is outside the possible outcomes for this round size.' : 'Ways to arrange that many heads: ' + num(choose(n, k))
  };
});

const binomialExperiment = experiment([flips(), chance(), fixedRounds], ({ n, p, rounds }, seed) =>
  compare('Heads in one round', binomial(n, p / 100), 0, rounds, seed), true);

const discreteCdf = experiment([chance(), range('k', 'At most this many heads', 0, 10, 1, 5)], ({ p, k }) => {
  const pmf = binomial(10, p / 100);
  const cdf = cumsum(pmf);
  const nodes = [{ x: -.5, y: 0 }, ...points(cdf), { x: 10.5, y: 1 }];
  return {
    chart: { ...discrete('Head-count threshold', 0, 10, [steps('Cumulative probability', nodes), marks('Selected point', [{ x: k, y: cdf[k] }])]), yMax: 1 },
    metrics: [metric('At most ' + k + ' heads', pct(cdf[k])), metric('Exactly ' + k + ' heads', pct(pmf[k]))]
  };
});

const evidence = experiment([
  select('n', 'Number of flips', [[10, '10'], [20, '20'], [50, '50'], [100, '100']], 10),
  range('k', 'Heads threshold', 50, 90, 5, 70, '%'),
  range('p', 'Biased model’s chance of heads', 55, 85, 5, 70, '%')
], ({ n, k, p }) => {
  const first = binomial(n, .5);
  const second = binomial(n, p / 100);
  const threshold = Math.ceil(k * n / 100);
  return {
    chart: discrete('Heads observed', 0, n, [
      bars('Fair coin', highlight(first, x => x >= threshold)),
      marks('Biased coin', points(second))
    ]),
    metrics: [metric('At least ' + threshold + ' heads, fair', pct(sumFrom(first, threshold))),
      metric('At least ' + threshold + ' heads, biased', pct(sumFrom(second, threshold)))],
    note: 'Highlighted bars show the upper tail under the fair-coin model.'
  };
});

const bernoulli = experiment([chance(60)], ({ p }) => ({
  chart: { ...discrete('Outcome (0 = failure, 1 = success)', 0, 1, [bars('Probability', points([1 - p / 100, p / 100]))]), yMax: 1 },
  metrics: [metric('Failure', pct(1 - p / 100)), metric('Success', pct(p / 100)), metric('Expected value', num(p / 100))]
}));

const geometric = experiment([chance(20), range('k', 'Attempt to inspect', 1, 20, 1, 5)], ({ p, k }) => {
  const rate = p / 100;
  const pmf = seq(1, 20).map(i => (1 - rate) ** (i - 1) * rate);
  return {
    chart: discrete('Attempt of first success', 1, 20, [bars('Exact probability', highlight(pmf, x => x === k, 1))]),
    metrics: [metric('First success on attempt ' + k, pct(pmf[k - 1])), metric('Success by attempt ' + k, pct(1 - (1 - rate) ** k))],
    note: 'Attempts beyond 20 are outside the chart. Their combined probability is ' + pct((1 - rate) ** 20) + '.'
  };
});

const hyper = experiment([range('n', 'Parts inspected out of 20', 1, 20, 1, 8), range('k', 'Faulty count to inspect', 0, 20, 1, 5)], ({ n, k }) => {
  const without = hypergeometric(20, 4, n);
  const withReplacement = binomial(n, .2);
  return {
    chart: discrete('Faulty parts found', 0, n, [bars('Without replacement', highlight(without, x => x === k)), marks('With replacement', points(withReplacement))]),
    metrics: [metric('Without replacement, exactly ' + k, pct(without[k] ?? 0)), metric('With replacement, exactly ' + k, pct(withReplacement[k] ?? 0))]
  };
});

const poissonExperiment = experiment([range('rate', 'Expected chats per hour', 1, 12, .5, 4), range('k', 'Busy-hour threshold', 1, 25, 1, 8)], ({ rate, k }) => {
  const masses = poisson(rate, 70);
  return {
    chart: discrete('Chats in an hour', 0, 25, [bars('Exact probability', highlight(masses.slice(0, 26), x => x >= k))]),
    metrics: [metric('At least ' + k + ' chats', pct(sumFrom(masses, k))), metric('Mean and variance', num(rate))],
    note: 'The tail calculation also includes counts beyond the chart.'
  };
});

const cases = {
  orders: { name: 'Binomial', label: 'Successful orders out of ten', first: 0, mass: binomial(10, .6), key: 'Fixed number of independent orders' },
  parts: { name: 'Hypergeometric', label: 'Faulty parts in the sample', first: 0, mass: hypergeometric(20, 4, 8), key: 'Known lot sampled without replacement' },
  calls: { name: 'Geometric', label: 'Call of first answer', first: 1, mass: seq(1, 20).map(k => .8 ** (k - 1) * .2), key: 'Trials until the first success' },
  tickets: { name: 'Poisson', label: 'Tickets in one hour', first: 0, mass: poisson(4, 20), key: 'Independent arrivals at a constant rate' }
};
const counts = experiment([select('kind', 'Scenario', [
  ['orders', 'Ten independent orders'], ['parts', 'Eight parts drawn from a lot'],
  ['calls', 'Calls until the first answer'], ['tickets', 'Tickets arriving in an hour']
], 'orders')], ({ kind }) => {
  const item = cases[kind];
  return {
    chart: discrete(item.label, item.first, item.first + item.mass.length - 1, [bars('Model probability', points(item.mass, item.first))]),
    metrics: [metric('Candidate model', item.name)],
    note: item.key + '.'
  };
});

export const countExperiments = {
  trial, dice, mass, binomial: binomialExperiment, 'discrete-cdf': discreteCdf, 'coin-evidence': evidence,
  bernoulli, geometric, hypergeometric: hyper, poisson: poissonExperiment, counts
};
