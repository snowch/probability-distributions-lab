const svgNamespace = 'http://www.w3.org/2000/svg';
const tickNumber = new Intl.NumberFormat('en', { maximumFractionDigits: 4 });
const tickPercent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 2 });

function svgNode(tag, attrs, content) {
  const node = document.createElementNS(svgNamespace, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (content !== undefined) node.textContent = content;
  return node;
}

function ticks(lo, hi, count, integer = false) {
  const interval = (hi - lo) / count;
  const magnitude = 10 ** Math.floor(Math.log10(interval));
  const scaled = interval / magnitude;
  const step = Math.max(integer ? 1 : 0, magnitude * ([1, 2, 2.5, 5, 10].find(value => value >= scaled) ?? 10));
  const first = Math.ceil((lo - 1e-10) / step);
  const last = Math.floor((hi + 1e-10) / step);
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => Number(((first + index) * step).toPrecision(10)));
}

function coords(points, x, y, stepped) {
  return points.map((point, i) => {
    if (!i) return 'M' + x(point.x) + ' ' + y(point.y);
    return stepped ? 'H' + x(point.x) + 'V' + y(point.y) : 'L' + x(point.x) + ' ' + y(point.y);
  }).join(' ');
}

function seriesMarks(series, x, y, baseline, plotWidth) {
  const group = svgNode('g', { class: 'series-' + series.color });
  if (series.type === 'line' || series.type === 'step') {
    group.append(svgNode('path', {
      d: coords(series.points, x, y, series.type === 'step'),
      class: 'chart-line' + (series.dashed ? ' is-dashed' : '')
    }));
    return group;
  }
  const hasHighlights = series.points.some(point => point.active);
  series.points.forEach(point => {
    const xValue = x(point.x);
    const yValue = y(point.y);
    if (series.type === 'bar') {
      const nominal = x(point.x + (point.width ?? 1)) - xValue;
      const width = point.width ? Math.max(1, nominal - 1) : Math.max(1, Math.min(36, nominal * .72));
      const height = Math.max(0, baseline - yValue);
      group.append(svgNode('rect', {
        x: xValue - width / 2, y: yValue, width, height,
        rx: Math.min(2, width / 5, height / 2),
        class: 'chart-bar' + (hasHighlights && !point.active ? ' is-muted' : '')
      }));
    } else if (series.type === 'point') {
      group.append(svgNode('circle', { cx: xValue, cy: yValue, r: 3.2, class: 'chart-point' }));
    } else {
      const radius = Math.max(1.5, Math.min(8, plotWidth / series.points.length * .32));
      group.append(svgNode('line', { x1: xValue - radius, x2: xValue + radius, y1: yValue, y2: yValue, class: 'chart-mark' }));
    }
  });
  return group;
}

export function drawChart(svg, chart) {
  const width = Math.max(260, svg.clientWidth || 575);
  const height = chart.height ?? 276;
  const right = width - 17;
  const left = width < 370 ? 44 : 51;
  const top = 29;
  const bottom = height - (chart.sharedXAxis ? 10 : 52);
  const minY = chart.yMin ?? 0;
  const highest = Math.max(...chart.series.flatMap(series => series.points.map(point => point.y)));
  const maxY = chart.yMax ?? (highest > minY ? minY + (highest - minY) * 1.12 : minY + 1);
  const x = value => left + (value - chart.xMin) * (right - left) / (chart.xMax - chart.xMin);
  const y = value => bottom - (value - minY) * (bottom - top) / (maxY - minY);
  const formatX = chart.xFormat ?? (value => (chart.xPercent ? tickPercent : tickNumber).format(value));
  const formatY = value => (chart.yPercent ? tickPercent : tickNumber).format(value);
  svg.replaceChildren();
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttribute('aria-label', chart.yLabel + ' by ' + chart.xLabel + '. ' + chart.series.map(series => series.label).join(', ') + '.');

  for (const value of ticks(minY, maxY, 4)) {
    svg.append(svgNode('line', { x1: left, x2: right, y1: y(value), y2: y(value), class: 'chart-grid' }));
    svg.append(svgNode('text', { x: left - 7, y: y(value) + 4, 'text-anchor': 'end', class: 'chart-tick' }, formatY(value)));
  }
  const xTicks = chart.xTicks ?? ticks(chart.xMin, chart.xMax, width < 390 ? 5 : 8, chart.xInteger);
  if (!chart.sharedXAxis) {
    for (const value of xTicks) {
      svg.append(svgNode('line', { x1: x(value), x2: x(value), y1: bottom, y2: bottom + 5, class: 'chart-axis' }));
      svg.append(svgNode('text', { x: x(value), y: bottom + 20, 'text-anchor': 'middle', class: 'chart-tick' }, formatX(value)));
    }
    svg.append(svgNode('text', { x: (left + right) / 2, y: height - 7, 'text-anchor': 'middle', class: 'chart-label' }, chart.xLabel));
  }
  svg.append(svgNode('line', { x1: left, x2: right, y1: bottom, y2: bottom, class: 'chart-axis' }));
  svg.append(svgNode('text', { x: left, y: 15, class: 'chart-label' }, chart.yLabel));

  if (chart.area?.length) {
    const first = chart.area[0];
    const last = chart.area.at(-1);
    svg.append(svgNode('path', {
      d: coords(chart.area, x, y, false) + 'L' + x(last.x) + ' ' + bottom + 'L' + x(first.x) + ' ' + bottom + 'Z',
      class: 'chart-area'
    }));
  }
  const order = { bar: 0, line: 1, step: 1, point: 2, mark: 2 };
  [...chart.series].sort((a, b) => order[a.type] - order[b.type]).forEach(series =>
    svg.append(seriesMarks(series, x, y, bottom, right - left)));

  for (const cut of chart.cuts ?? []) {
    if (cut.x < chart.xMin || cut.x > chart.xMax) continue;
    const position = x(cut.x);
    svg.append(svgNode('line', { x1: position, x2: position, y1: top, y2: bottom, class: 'chart-cut' }));
    if (cut.label && width > 340) {
      const anchor = position > right - 85 ? 'end' : 'start';
      svg.append(svgNode('text', {
        x: position + (anchor === 'end' ? -5 : 5), y: top + 13, 'text-anchor': anchor, class: 'chart-cut-label'
      }, cut.label));
    }
  }
  if (chart.rise?.length === 2) {
    const [from, to] = chart.rise;
    svg.append(svgNode('path', { d: coords([from, to], x, y, true), class: 'chart-rise' }));
  }
}
