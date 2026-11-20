import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessons, units } from '../dist/course/index.js';
import { experiments } from '../dist/experiments.js';
import { pythonExamples } from '../dist/python-examples.js';
import { binomial, cumsum, hypergeometric, normalCdf, normalQuantile, poisson, sumFrom } from '../dist/math.js';

function near(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, actual + ' versus ' + expected);
}

test('the course has 48 complete, addressable lessons with linked experiments', () => {
  assert.deepEqual(units.map(unit => unit.lessons.length), Array(8).fill(6));
  assert.equal(new Set(lessons.map(lesson => lesson.slug)).size, 48);
  for (const [i, lesson] of lessons.entries()) {
    assert.equal(lesson.number, i + 1);
    assert.match(lesson.slug, /^[a-z0-9-]+$/);
    for (const key of ['title', 'intro', 'idea', 'predict', 'explore', 'answer', 'transfer']) {
      assert.ok(lesson[key], lesson.slug + ' needs ' + key);
    }
    assert.ok(experiments[lesson.model], lesson.slug);
    if (lesson.python) {
      assert.match(pythonExamples[lesson.python].code, /matplotlib/);
      assert.ok(pythonExamples[lesson.python].figure);
    }
  }
});

test('all experiment defaults, endpoints, and selectable views produce finite chart geometry', () => {
  for (const [name, model] of Object.entries(experiments)) {
    const defaults = Object.fromEntries(model.controls.map(control => [control.key, control.value]));
    const variants = [defaults];
    for (const control of model.controls) {
      const options = control.options?.map(([value]) => value) ?? [control.min, control.max];
      for (const value of options) {
        const dependency = control.showWhen;
        variants.push({ ...defaults, ...(dependency ? { [dependency[0]]: dependency[1] } : {}), [control.key]: value });
      }
    }
    for (const values of variants) {
      const result = model.compute(values, 513);
      assert.ok(result.metrics.length, name);
      for (const chart of [result.chart, result.comparison?.chart].filter(Boolean)) {
        assert.ok(chart.xMax > chart.xMin, name);
        assert.ok(chart.series.length, name);
        for (const series of chart.series) {
          assert.ok(series.points.length, name + ' has no points in ' + series.label);
          for (const point of series.points) {
            assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y), name);
          }
        }
      }
    }
  }
});

test('the model plots share endpoints and report the same interval probability as the sample view', () => {
  const model = experiments['three-views'];
  const settings = { a: 3, b: 8, view: 'model' };
  const results = model.compute(settings, 518);
  assert.deepEqual(results.chart.cuts, results.comparison.chart.cuts);
  assert.equal(results.chart.xMin, results.comparison.chart.xMin);
  assert.equal(results.chart.xMax, results.comparison.chart.xMax);
  assert.equal(results.comparison.area, '34.69%');
  assert.match(results.comparison.rise, /79\.81% by 8 min − 45\.12% by 3 min ≈ 34\.69 percentage points/);
  assert.deepEqual(model.compute({ ...settings, a: 8, b: 3 }, 518), results);
  const sample = model.compute({ ...settings, view: 'sample' }, 518);
  assert.equal(sample.comparison, undefined);
  assert.deepEqual(sample.metrics[0], results.metrics[0]);
  assert.equal(sample.metrics[1].value, results.comparison.area);
  const singlePoint = model.compute({ ...settings, a: 4, b: 4 }, 518);
  assert.equal(singlePoint.chart.area, null);
  assert.equal(singlePoint.comparison.area, '0%');
});

test('conditioning selects a weather branch without changing its conditional probability', () => {
  const condition = experiments.condition;
  const unknown = condition.compute({ rain: 30, group: 'all' });
  const rainy = condition.compute({ rain: 30, group: 'high' });
  const changedForecast = condition.compute({ rain: 70, group: 'high' });
  assert.equal(unknown.metrics[1].value, '25.45%');
  assert.equal(rainy.metrics[1].value, '84.13%');
  assert.equal(rainy.weather.selected, 'high');
  near(rainy.weather.rainLate, changedForecast.weather.rainLate);
  assert.notEqual(rainy.weather.mixTail, changedForecast.weather.mixTail);
});

test('exact counts and cumulative probabilities match the worked examples', () => {
  const mass = binomial(10, .5);
  near(sumFrom(mass, 0), 1);
  near(mass[5], .24609375);
  near(cumsum(mass)[5], .623046875);
  near(sumFrom(mass, 7), .171875);
  near(sumFrom(poisson(4, 100), 8), .0511336157928473);
  near(sumFrom(poisson(6, 100), 8), .256020239546283);
  const lot = hypergeometric(20, 4, 20);
  near(lot[4], 1);
  near(sumFrom(lot, 5), 0);
  assert.equal(experiments.dice.compute({ k: 7 }, 1).metrics[1].value, '6 out of 36');
});

test('continuous percentiles round-trip through the CDF and zero failures gives the stated limit', () => {
  near(normalCdf(30, 30, 6), .5);
  const quantile = normalQuantile(.9, 30, 6);
  near(quantile, 37.689309, 1e-5);
  near(normalCdf(quantile, 30, 6), .9);
  const metrics = experiments.zero.compute({ n: 2000, p: 1 }, 1).metrics;
  assert.equal(metrics[0].value, '<0.01%');
  assert.equal(metrics[1].value, '0.15%');
});

test('samples are reproducible and adding staff to the same draws cannot raise overload risk', () => {
  const sandbox = experiments.staffing;
  const settings = { staff: 2, arrivals: 18, service: 9 };
  const a = sandbox.compute(settings, 621);
  const b = sandbox.compute(settings, 621);
  const c = sandbox.compute({ ...settings, staff: 3 }, 621);
  assert.deepEqual(a, b);
  assert.deepEqual(a.chart.series, c.chart.series);
  assert.ok(parseFloat(c.metrics[0].value) < parseFloat(a.metrics[0].value));
  const model = experiments.binomial;
  const settings2 = { n: 10, p: 50, rounds: 200 };
  assert.notDeepEqual(model.compute(settings2, 621).chart, model.compute(settings2, 622).chart);
});
