export const range = (key, label, min, max, step, value, unit = '') => ({ key, label, min, max, step, value, unit });
export const select = (key, label, options, value) => ({ key, label, options, value });
export const experiment = (controls, compute, resample = false) => ({ controls, compute, resample });
export const pct = probability => {
  const value = Math.max(0, Math.min(1, probability)) * 100;
  if (value > 0 && value < .01) return '<0.01%';
  return value.toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
};
export const num = (value, digits = 2) => value.toLocaleString('en', { maximumFractionDigits: digits });
export const metric = (label, value) => ({ label, value });
export const bars = (label, points, color = 'primary') => ({ type: 'bar', label, points, color });
export const dots = (label, points, color = 'primary') => ({ type: 'point', label, points, color });
export const marks = (label, points, color = 'secondary') => ({ type: 'mark', label, points, color });
export const line = (label, points, color = 'primary', dashed = false) => ({ type: 'line', label, points, color, dashed });
export const steps = (label, points, color = 'primary') => ({ ...line(label, points, color), type: 'step' });
export const points = (values, start = 0) => values.map((y, index) => ({ x: start + index, y }));

export function curve(xMin, xMax, fn, count = 160) {
  return Array.from({ length: count + 1 }, (_, i) => {
    const x = xMin + (xMax - xMin) * i / count;
    return { x, y: fn(x) };
  });
}
export const area = (lo, hi, fn) => curve(lo, hi, fn, 70);
export const cut = (x, label = '') => ({ x, label });
export const discrete = (xLabel, xMin, xMax, series, yPercent = true) => ({
  xLabel, xMin: xMin - .5, xMax: xMax + .5, series, xInteger: true, yPercent,
  yLabel: yPercent ? 'Probability' : 'Loss'
});
export const continuous = (xLabel, xMin, xMax, series, extras = {}) => ({
  xLabel, xMin, xMax, series, yLabel: 'Density', ...extras
});
