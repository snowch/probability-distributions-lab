export const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
export const mean = values => values.reduce((total, value) => total + value, 0) / values.length;
export const sd = values => {
  const center = mean(values);
  return Math.sqrt(mean(values.map(value => (value - center) ** 2)));
};
export function quantile(sorted, probability) {
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  return sorted[lower] + (index - lower) * (sorted[Math.ceil(index)] - sorted[lower]);
}
export const seq = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

export function random(seed) {
  let state = seed | 0;
  return function next() {
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
export const sample = (size, draw) => Array.from({ length: size }, draw);
export const normalSample = rng => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
export const expSample = (rng, rate) => -Math.log(1 - rng()) / rate;

export function choose(n, k) {
  if (k < 0 || k > n) return 0;
  const limit = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= limit; i++) result *= (n - limit + i) / i;
  return result;
}

export const binomial = (n, p) => seq(0, n).map(k => choose(n, k) * p ** k * (1 - p) ** (n - k));
export const hypergeometric = (n, faulty, take) => seq(0, take)
  .map(k => choose(faulty, k) * choose(n - faulty, take - k) / choose(n, take));
export function poisson(rate, max) {
  const mass = [Math.exp(-rate)];
  for (let k = 1; k <= max; k++) mass.push(mass[k - 1] * rate / k);
  return mass;
}

export function poissonSample(rng, rate) {
  const limit = Math.exp(-rate);
  let product = rng();
  let count = 0;
  while (product > limit) {
    product *= rng();
    count++;
  }
  return count;
}

export function cumsum(masses) {
  let total = 0;
  return masses.map(value => (total += value));
}
export const sumFrom = (mass, threshold) => mass.slice(threshold).reduce((sum, p) => sum + p, 0);
export const normalPdf = (x, mu = 0, sigma = 1) => Math.exp(-.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

export function normalCdf(x, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma;
  if (z === 0) return .5;
  const v = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + .3275911 * v);
  const tail = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - .284496736)
    * t + .254829592) * t * Math.exp(-v * v) / 2;
  return z < 0 ? tail : 1 - tail;
}
export const normalTail = (x, mu, sigma) => normalCdf(mu - x, 0, sigma);

export function normalQuantile(p, mu = 0, sigma = 1) {
  let lo = -9;
  let hi = 9;
  for (let i = 0; i < 45; i++) {
    const middle = (lo + hi) / 2;
    if (normalCdf(middle) < p) lo = middle;
    else hi = middle;
  }
  return mu + sigma * (lo + hi) / 2;
}
export const expPdf = (x, rate) => x < 0 ? 0 : rate * Math.exp(-rate * x);
export const expCdf = (x, rate) => x < 0 ? 0 : -Math.expm1(-rate * x);
export const lognormalPdf = (x, mu, sigma) => x <= 0 ? 0 : normalPdf(Math.log(x), mu, sigma) / x;
export const lognormalTail = (x, mu, sigma) => x <= 0 ? 1 : normalTail(Math.log(x), mu, sigma);

export function lognormalParams(center, spread) {
  const sigma = Math.sqrt(Math.log1p((spread / center) ** 2));
  return { mu: Math.log(center) - sigma * sigma / 2, sigma };
}

export function betaPdf(x, alpha, beta) {
  if (x <= 0 || x >= 1) return 0;
  const logBeta = logGamma(alpha) + logGamma(beta) - logGamma(alpha + beta);
  return Math.exp((alpha - 1) * Math.log(x) + (beta - 1) * Math.log1p(-x) - logBeta);
}

function logGamma(x) {
  const terms = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406,
    12.5073432786869, -.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  const z = x - 1;
  const series = terms.reduce((sum, term, i) => sum + term / (z + i + 1), .9999999999998099);
  const t = z + terms.length - .5;
  return Math.log(2 * Math.PI) / 2 + (z + .5) * Math.log(t) - t + Math.log(series);
}

export const gammaPdf = (x, shape, rate) => {
  if (x <= 0) return shape === 1 ? expPdf(x, rate) : 0;
  return Math.exp(shape * Math.log(rate) + (shape - 1) * Math.log(x) - rate * x - logGamma(shape));
};

export function histogram(values, bins, lo, hi, density = true) {
  const width = (hi - lo) / bins;
  const counts = Array.from({ length: bins }, () => 0);
  for (const value of values) {
    if (value >= lo && value <= hi) counts[Math.min(bins - 1, Math.floor((value - lo) / width))]++;
  }
  const divisor = values.length * (density ? width : 1);
  return counts.map((count, i) => ({ x: lo + (i + .5) * width, y: count / divisor, width }));
}
