// SVG figures for reports: line charts and the research tree. Self-contained files that follow the
// viewer's light or dark mode. Colours are the validated categorical slots (blue, orange, aqua);
// every line is also labelled at its end, and every point has a tooltip, so colour is never the
// only cue.
import type { World } from '../engine/world.ts';

const STYLE = `
  .viz { --surface: #fcfcfb; --ink: #0b0b0b; --ink-2: #52514e; --grid: #e6e5e1;
         --s1: #2a78d6; --s2: #eb6834; --s3: #1baf7a; --s4: #eda100; --s5: #e87ba4; --dead: #c9c7c0; }
  @media (prefers-color-scheme: dark) {
    .viz { --surface: #1a1a19; --ink: #ffffff; --ink-2: #c3c2b7; --grid: #34332f;
           --s1: #3987e5; --s2: #d95926; --s3: #199e70; --s4: #c98500; --s5: #d55181; --dead: #4a4945; }
  }
  .bg { fill: var(--surface); }
  text { fill: var(--ink); font-family: Helvetica, Arial, sans-serif; }
  .title { font-size: 16px; font-weight: 700; }
  .sub, .tick, .axis { fill: var(--ink-2); font-size: 12px; }
  .grid { stroke: var(--grid); stroke-width: 1; }
  .base { stroke: var(--ink-2); stroke-width: 1; }
  .line { fill: none; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .c1 { stroke: var(--s1); } .f1 { fill: var(--s1); }
  .c2 { stroke: var(--s2); } .f2 { fill: var(--s2); }
  .c3 { stroke: var(--s3); } .f3 { fill: var(--s3); }
  .dot { stroke: var(--surface); stroke-width: 2; }
  .label { font-size: 12px; font-weight: 700; }
  .t1 { fill: var(--s1); } .t2 { fill: var(--s2); } .t3 { fill: var(--s3); }
`;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface Series {
  name: string;
  /** Categorical slot 1-3, fixed per entity across all charts. */
  slot: 1 | 2 | 3;
  points: [number, number][];
}

export interface LineChart {
  title: string;
  subtitle: string;
  xLabel: string;
  yLabel: string;
  series: Series[];
  x: [number, number];
  y: [number, number];
  xTicks: number[];
  yTicks: number[];
  /** Draw x from high (left) to low (right). */
  reverseX?: boolean;
  format?: { x?: (v: number) => string; y?: (v: number) => string };
  /** Show a marker at every point (for sparse data); dense curves get end markers only. */
  markers?: boolean;
}

export function lineChart(c: LineChart): string {
  const W = 760, H = 420, left = 64, right = 190, top = 92, bottom = 56;
  const pw = W - left - right, ph = H - top - bottom;
  const fx = c.format?.x ?? ((v: number) => String(v));
  const fy = c.format?.y ?? ((v: number) => String(v));
  const sx = (v: number) => {
    const t = (v - c.x[0]) / (c.x[1] - c.x[0] || 1);
    return left + (c.reverseX ? 1 - t : t) * pw;
  };
  const sy = (v: number) => top + ph - ((v - c.y[0]) / (c.y[1] - c.y[0] || 1)) * ph;
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(c.title)}">`);
  out.push(`<style>${STYLE}</style><rect class="bg" width="${W}" height="${H}" rx="8"/>`);
  out.push(`<text class="title" x="${left}" y="30">${esc(c.title)}</text>`);
  out.push(`<text class="sub" x="${left}" y="50">${esc(c.subtitle)}</text>`);
  // Legend, one row above the plot.
  let lx = left;
  for (const s of c.series) {
    // The legend is in each series' colour, like its line.
    out.push(`<line class="line c${s.slot}" x1="${lx}" y1="70" x2="${lx + 18}" y2="70"/><text class="label t${s.slot}" x="${lx + 24}" y="74">${esc(s.name)}</text>`);
    lx += 34 + s.name.length * 6.6;
  }
  for (const t of c.yTicks) {
    out.push(`<line class="grid" x1="${left}" x2="${left + pw}" y1="${sy(t)}" y2="${sy(t)}"/>`);
    out.push(`<text class="tick" x="${left - 8}" y="${sy(t) + 4}" text-anchor="end">${esc(fy(t))}</text>`);
  }
  out.push(`<line class="base" x1="${left}" x2="${left + pw}" y1="${top + ph}" y2="${top + ph}"/>`);
  for (const t of c.xTicks) {
    out.push(`<text class="tick" x="${sx(t)}" y="${top + ph + 18}" text-anchor="middle">${esc(fx(t))}</text>`);
  }
  out.push(`<text class="axis" x="${left + pw / 2}" y="${H - 12}" text-anchor="middle">${esc(c.xLabel)}</text>`);
  out.push(`<text class="axis" transform="translate(16 ${top + ph / 2}) rotate(-90)" text-anchor="middle">${esc(c.yLabel)}</text>`);
  // Lines, then points with tooltips.
  const ends: { y: number; s: Series; last: [number, number] }[] = [];
  for (const s of c.series) {
    if (!s.points.length) continue;
    const d = s.points.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`).join(' ');
    out.push(`<path class="line c${s.slot}" d="${d}"/>`);
    const shown = c.markers ? s.points : [s.points[s.points.length - 1]];
    for (const [x, y] of shown) {
      out.push(`<circle class="dot f${s.slot}" cx="${sx(x).toFixed(1)}" cy="${sy(y).toFixed(1)}" r="4.5"><title>${esc(`${s.name}: ${fy(y)} at ${c.xLabel.toLowerCase()} ${fx(x)}`)}</title></circle>`);
    }
    const last = s.points[s.points.length - 1];
    ends.push({ y: sy(last[1]), s, last });
  }
  // Direct labels at the right, nudged apart so they never overlap.
  ends.sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
  const labelX = Math.max(...ends.map((e) => sx(e.last[0]))) + 12;
  for (const e of ends) {
    out.push(`<text class="label t${e.s.slot}" x="${labelX}" y="${e.y + 4}">${esc(e.s.name)}: ${esc(fy(e.last[1]))}</text>`);
  }
  out.push('</svg>');
  return out.join('\n');
}

/** The research tree: columns are levels, colour is area, grey is a dead end, stars are targets. */
export function worldFigure(w: World, title: string, areaNames: string[] = []): string {
  const perLevel: number[][] = [];
  for (let r = 0; r < w.n; r++) (perLevel[w.level[r]] ??= []).push(r);
  const width = Math.max(...perLevel.filter(Boolean).map((l) => l.length));
  const colW = Math.max(70, Math.min(130, 900 / Math.max(1, w.levels))), rowH = width > 14 ? 26 : 40;
  const left = 70, top = 96;
  const x = (r: number) => left + (w.level[r] - 1) * colW;
  const y = (r: number) => top + perLevel[w.level[r]].indexOf(r) * rowH;
  const W = left + (w.levels - 1) * colW + 110, H = top + width * rowH + 80;
  // Areas use the categorical slots in fixed order; past three, the legend and tooltips carry identity.
  const slots = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)'];
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">`);
  out.push(`<style>${STYLE}</style><rect class="bg" width="${W}" height="${H}" rx="8"/>`);
  out.push(`<text class="title" x="20" y="30">${esc(title)}</text>`);
  out.push(`<text class="sub" x="20" y="50">${w.n} ideas · ${w.targets.length} targets · ${w.deadEnd.filter(Boolean).length} dead ends · columns are levels (deeper to the right); lines join an idea to what it builds on</text>`);
  for (let l = 1; l <= w.levels; l++) {
    const r0 = perLevel[l]?.[0];
    if (r0 === undefined) continue;
    out.push(`<text class="tick" x="${left + (l - 1) * colW}" y="${top - 26}" text-anchor="middle">level ${l}</text>`);
    out.push(`<text class="tick" x="${left + (l - 1) * colW}" y="${top - 12}" text-anchor="middle">p ≈ ${(w.p[r0] * 100).toFixed(1)}%</text>`);
  }
  for (let r = 0; r < w.n; r++) for (const j of w.prereqs[r]) {
    out.push(`<line class="grid" style="stroke:${w.deadEnd[r] ? 'var(--grid)' : 'var(--ink-2)'};stroke-opacity:${w.deadEnd[r] ? 1 : 0.45}" x1="${x(j)}" y1="${y(j)}" x2="${x(r)}" y2="${y(r)}"/>`);
  }
  for (let r = 0; r < w.n; r++) {
    const fill = w.deadEnd[r] ? 'var(--dead)' : slots[w.area[r] % slots.length];
    const name = w.names?.[r] ?? `#${r}`;
    const tip = `${name} · level ${w.level[r]} · ${areaNames[w.area[r]] ?? `area ${w.area[r] + 1}`}${w.isTarget[r] ? ` · target, bounty ${w.bounty[r]}` : ''}${w.deadEnd[r] ? ' · dead end' : ''}`;
    if (w.isTarget[r]) {
      const s = 11, cx = x(r), cy = y(r);
      const pts = Array.from({ length: 10 }, (_, k) => {
        const a = -Math.PI / 2 + (k * Math.PI) / 5, rad = k % 2 ? s * 0.45 : s;
        return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      out.push(`<polygon points="${pts}" style="fill:${fill};stroke:var(--ink);stroke-width:1.2"><title>${esc(tip)}</title></polygon>`);
      out.push(`<text class="tick" x="${cx}" y="${cy + 24}" text-anchor="middle">${esc(String(w.bounty[r]))}</text>`);
    } else {
      out.push(`<circle cx="${x(r)}" cy="${y(r)}" r="6" style="fill:${fill}"><title>${esc(tip)}</title></circle>`);
    }
  }
  const areas = Math.max(...w.area) + 1;
  let lx = 20;
  const ly = H - 26;
  for (let a = 0; a < Math.min(areas, slots.length); a++) {
    const label = areaNames[a] ?? `area ${a + 1}`;
    out.push(`<circle cx="${lx + 6}" cy="${ly - 4}" r="6" style="fill:${slots[a]}"/><text class="tick" x="${lx + 16}" y="${ly}">${esc(label)}</text>`);
    lx += 34 + label.length * 6.6;
  }
  out.push(`<circle cx="${lx + 6}" cy="${ly - 4}" r="6" style="fill:var(--dead)"/><text class="tick" x="${lx + 16}" y="${ly}">dead end</text>`);
  out.push(`<text class="tick" x="${lx + 90}" y="${ly}">★ target (number = bounty)</text>`);
  out.push('</svg>');
  return out.join('\n');
}

export interface RangeRow {
  label: string;
  group: string;
  /** Each tested value: its label and the outcome there. */
  points: { value: string; y: number }[];
  /** The outcome at the space's own value. */
  base: number;
}

/**
 * Sensitivity, one row per parameter: a dot for each tested value of the outcome (OSO's lead), a
 * line across their range, and a tick at the base value. Ends are labelled with the parameter values.
 */
export function rangeChart(c: { title: string; subtitle: string; xLabel: string; rows: RangeRow[]; format?: (v: number) => string }): string {
  const fx = c.format ?? ((v: number) => v.toFixed(1));
  const groups = [...new Set(c.rows.map((r) => r.group))];
  const rowH = 30, groupGap = 34, left = 210, right = 70, top = 96;
  const W = 760, pw = W - left - right;
  const H = top + c.rows.length * rowH + groups.length * groupGap + 50;
  const all = c.rows.flatMap((r) => [...r.points.map((p) => p.y), r.base]).concat([0]);
  let lo = Math.min(...all), hi = Math.max(...all);
  const pad = (hi - lo || 1) * 0.08;
  lo -= pad; hi += pad;
  const sx = (v: number) => left + ((v - lo) / (hi - lo)) * pw;
  const step = niceStep((hi - lo) / 5);
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(Math.round(t / step) * step);
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(c.title)}">`);
  out.push(`<style>${STYLE}</style><rect class="bg" width="${W}" height="${H}" rx="8"/>`);
  out.push(`<text class="title" x="20" y="30">${esc(c.title)}</text>`);
  out.push(`<text class="sub" x="20" y="50">${esc(c.subtitle)}</text>`);
  out.push(`<line class="line c1" x1="20" y1="70" x2="38" y2="70"/><circle class="dot f1" cx="29" cy="70" r="4.5"/><text class="tick" x="46" y="74">one tested value (end labels give the value)</text>`);
  out.push(`<line class="base" x1="330" y1="63" x2="330" y2="77" style="stroke-width:2.5"/><text class="tick" x="338" y="74">this space's value</text>`);
  const plotBottom = H - 50;
  for (const t of ticks) {
    out.push(`<line class="grid" x1="${sx(t)}" x2="${sx(t)}" y1="${top - 8}" y2="${plotBottom}" ${t === 0 ? 'style="stroke:var(--ink-2)"' : ''}/>`);
    out.push(`<text class="tick" x="${sx(t)}" y="${plotBottom + 18}" text-anchor="middle">${esc(fx(t))}</text>`);
  }
  out.push(`<text class="axis" x="${left + pw / 2}" y="${H - 10}" text-anchor="middle">${esc(c.xLabel)}</text>`);
  let y = top;
  for (const g of groups) {
    y += 12;
    out.push(`<text class="label" x="20" y="${y}">${esc(g)}</text>`);
    y += groupGap - 12;
    for (const r of c.rows.filter((row) => row.group === g)) {
      const ys = r.points.map((p) => p.y);
      const [mn, mx] = [Math.min(...ys), Math.max(...ys)];
      out.push(`<text class="tick" x="28" y="${y + 4}">${esc(r.label)}</text>`);
      out.push(`<line class="line c1" x1="${sx(mn)}" x2="${sx(mx)}" y1="${y}" y2="${y}" style="stroke-opacity:0.45;stroke-width:6"/>`);
      out.push(`<line class="base" x1="${sx(r.base)}" x2="${sx(r.base)}" y1="${y - 9}" y2="${y + 9}" style="stroke-width:2.5"/>`);
      for (const p of r.points) {
        out.push(`<circle class="dot f1" cx="${sx(p.y).toFixed(1)}" cy="${y}" r="4.5"><title>${esc(`${r.label} = ${p.value}: ${fx(p.y)}`)}</title></circle>`);
      }
      const at = (v: number) => r.points.find((p) => p.y === v)!.value;
      if (mx - mn > (hi - lo) * 0.02) {
        out.push(`<text class="tick" x="${sx(mn) - 8}" y="${y + 4}" text-anchor="end" style="font-size:10px">${esc(at(mn))}</text>`);
        out.push(`<text class="tick" x="${sx(mx) + 8}" y="${y + 4}" style="font-size:10px">${esc(at(mx))}</text>`);
      }
      y += rowH;
    }
  }
  out.push('</svg>');
  return out.join('\n');
}

function niceStep(raw: number): number {
  const mag = 10 ** Math.floor(Math.log10(raw || 1));
  return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
}

// Sequential blue, light to dark (validated reference ramp, steps 100-700).
const RAMP = ['#cde2fb', '#b7d3f6', '#9ec5f4', '#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'];

/** A heat map with the value printed in every cell (so colour is never the only cue). */
export function heatmap(c: {
  title: string; subtitle: string; rowLabel: string; colLabel: string;
  rows: string[]; cols: string[]; values: number[][]; range: [number, number];
  format: (v: number) => string; note?: (r: number, k: number) => string;
}): string {
  const cell = 74, left = 130, top = 110;
  const W = Math.max(560, left + c.cols.length * cell + 40), H = top + c.rows.length * cell + 60;
  const shade = (v: number) => {
    const t = Math.max(0, Math.min(1, (v - c.range[0]) / (c.range[1] - c.range[0] || 1)));
    const i = Math.round(t * (RAMP.length - 1));
    return { fill: RAMP[i], ink: i >= 6 ? '#ffffff' : '#0b0b0b' };
  };
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(c.title)}">`);
  out.push(`<style>${STYLE}</style><rect class="bg" width="${W}" height="${H}" rx="8"/>`);
  out.push(`<text class="title" x="20" y="30">${esc(c.title)}</text>`);
  out.push(`<text class="sub" x="20" y="50">${esc(c.subtitle)}</text>`);
  out.push(`<text class="axis" x="${left + (c.cols.length * cell) / 2}" y="${top - 34}" text-anchor="middle">${esc(c.colLabel)}</text>`);
  c.cols.forEach((col, k) => out.push(`<text class="tick" x="${left + k * cell + cell / 2}" y="${top - 12}" text-anchor="middle">${esc(col)}</text>`));
  out.push(`<text class="axis" transform="translate(30 ${top + (c.rows.length * cell) / 2}) rotate(-90)" text-anchor="middle">${esc(c.rowLabel)}</text>`);
  c.rows.forEach((row, r) => {
    out.push(`<text class="tick" x="${left - 12}" y="${top + r * cell + cell / 2 + 4}" text-anchor="end">${esc(row)}</text>`);
    c.cols.forEach((col, k) => {
      const v = c.values[r][k];
      const { fill, ink } = shade(v);
      const x = left + k * cell, y = top + r * cell;
      out.push(`<rect x="${x + 1}" y="${y + 1}" width="${cell - 2}" height="${cell - 2}" rx="4" style="fill:${fill}"><title>${esc(`${c.rowLabel} ${row}, ${c.colLabel} ${col}: ${c.format(v)}${c.note ? ` · ${c.note(r, k)}` : ''}`)}</title></rect>`);
      out.push(`<text x="${x + cell / 2}" y="${y + cell / 2 + (c.note ? 0 : 5)}" text-anchor="middle" style="fill:${ink};font-size:14px;font-weight:700">${esc(c.format(v))}</text>`);
      if (c.note) out.push(`<text x="${x + cell / 2}" y="${y + cell / 2 + 17}" text-anchor="middle" style="fill:${ink};font-size:10px">${esc(c.note(r, k))}</text>`);
    });
  });
  out.push('</svg>');
  return out.join('\n');
}

export interface Bar { label: string; value: number; slot: 1 | 2 | 3 | 0; text?: string }

/**
 * Horizontal bars for a comparison: OSO rows orange (slot 2), traditional blue (slot 1), others grey;
 * each value printed at the end of its bar, and a legend in colour.
 */
export function barChart(c: { title: string; bars: Bar[]; max?: number; format?: (v: number) => string; legend?: { name: string; slot: 1 | 2 | 3 | 0 }[] }): string {
  const fmt = c.format ?? ((v: number) => v.toFixed(1));
  const W = 620, rowH = 26, left = 230, right = 70, top = c.legend?.length ? 58 : 40, pw = W - left - right;
  const H = top + c.bars.length * rowH + 14;
  const max = c.max ?? Math.max(1e-9, ...c.bars.map((b) => b.value));
  const fill = (slot: number) => (slot ? `var(--s${slot})` : 'var(--dead)');
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(c.title)}">`);
  out.push(`<style>${STYLE}</style><rect class="bg" width="${W}" height="${H}" rx="8"/>`);
  out.push(`<text class="title" x="16" y="26">${esc(c.title)}</text>`);
  let lx = 16;
  for (const l of c.legend ?? []) {
    out.push(`<rect x="${lx}" y="38" width="12" height="10" rx="2" style="fill:${fill(l.slot)}"/><text class="label ${l.slot ? `t${l.slot}` : ''}" x="${lx + 17}" y="47">${esc(l.name)}</text>`);
    lx += 30 + l.name.length * 7;
  }
  c.bars.forEach((b, i) => {
    const y = top + i * rowH, w = Math.max(2, (b.value / max) * pw);
    out.push(`<text class="tick" x="${left - 8}" y="${y + 15}" text-anchor="end">${esc(b.label.length > 34 ? b.label.slice(0, 33) + '…' : b.label)}</text>`);
    out.push(`<rect x="${left}" y="${y + 4}" width="${w.toFixed(1)}" height="16" rx="3" style="fill:${fill(b.slot)}"><title>${esc(`${b.label}: ${b.text ?? fmt(b.value)}`)}</title></rect>`);
    out.push(`<text class="label ${b.slot ? `t${b.slot}` : ''}" x="${left + w + 6}" y="${y + 16}">${esc(b.text ?? fmt(b.value))}</text>`);
  });
  out.push('</svg>');
  return out.join('\n');
}

export interface ChainPoint { n: number; shared: number; sharedExact: number; hidden: number; hiddenExact: number }

/** The one-chain check: depth reached by number of agents, simulated (dots) against exact (dashed lines). */
export function chainFigure(pts: ChainPoint[], attempts?: number): string {
  const W = 640, H = 340, l = 60, rt = 150, tp = 40, bt = 46, pw = W - l - rt, ph = H - tp - bt;
  const nMax = Math.max(2, ...pts.map((p) => p.n));
  // Four round steps (multiples of 10) up to at least the highest value.
  const yStep = Math.max(10, Math.ceil(Math.max(...pts.map((p) => Math.max(p.shared, p.sharedExact, p.hidden, p.hiddenExact))) / 40) * 10), yMax = 4 * yStep;
  const sx = (n: number) => l + (Math.log2(n) / Math.log2(nMax)) * pw, sy = (v: number) => tp + ph - (v / yMax) * ph;
  const title = 'Deepest idea reached, by number of agents';
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">`);
  out.push(`<style>${STYLE}</style><rect class="bg" width="${W}" height="${H}" rx="8"/><text class="title" x="${l}" y="24">${esc(title)}</text>`);
  for (let k = 0; k <= 4; k++) { const v = (yMax * k) / 4; out.push(`<line class="grid" x1="${l}" x2="${l + pw}" y1="${sy(v)}" y2="${sy(v)}"/><text class="tick" x="${l - 8}" y="${sy(v) + 4}" text-anchor="end">${v}</text>`); }
  for (const p of pts) out.push(`<text class="tick" x="${sx(p.n)}" y="${tp + ph + 18}" text-anchor="middle">${p.n}</text>`);
  out.push(`<text class="axis" x="${l + pw / 2}" y="${H - 6}" text-anchor="middle">agents (log scale)${attempts ? `; same ${attempts} attempts in total` : ''}</text>`);
  // OSO orange (slot 2) for shared progress, traditional blue (slot 1) for hidden.
  for (const [sim, exact, slot, name] of [['shared', 'sharedExact', 2, 'shared'], ['hidden', 'hiddenExact', 1, 'hidden']] as const) {
    out.push(`<path class="line c${slot}" stroke-dasharray="6 4" d="${pts.map((p, k) => `${k ? 'L' : 'M'}${sx(p.n).toFixed(1)} ${sy(p[exact]).toFixed(1)}`).join(' ')}"/>`);
    for (const p of pts) out.push(`<circle class="dot f${slot}" cx="${sx(p.n).toFixed(1)}" cy="${sy(p[sim]).toFixed(1)}" r="5"><title>${name}, ${p.n} agents: simulated ${p[sim].toFixed(1)}, exact ${p[exact].toFixed(1)}</title></circle>`);
  }
  const ly = (k: number) => tp + 14 + k * 22, lx = l + pw + 14;
  out.push(`<circle class="f2" cx="${lx + 8}" cy="${ly(0) - 4}" r="5"/><text class="label t2" x="${lx + 18}" y="${ly(0)}">shared</text>`);
  out.push(`<circle class="f1" cx="${lx + 8}" cy="${ly(1) - 4}" r="5"/><text class="label t1" x="${lx + 18}" y="${ly(1)}">hidden</text>`);
  out.push(`<text class="sub" x="${lx}" y="${ly(2.4)}">dots: simulated</text><line class="base" stroke-width="2" stroke-dasharray="6 4" x1="${lx}" x2="${lx + 26}" y1="${ly(3.2) - 4}" y2="${ly(3.2) - 4}"/><text class="sub" x="${lx + 32}" y="${ly(3.2)}">exact</text>`);
  return out.join('') + '</svg>';
}
