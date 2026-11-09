// The public, read-only copy of the Lean results page: the app's page plus the numbers behind its graphs.
// No transcripts, and no server needed. Run with the viewer running: npm run site. Writes site/.
// Only experiments whose runs have all finished go in, so nobody reads partial results.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const VIEWER = process.env.VIEWER ?? 'http://127.0.0.1:8791', OUT = 'site', DOCS = ['docs/rounds-and-epochs.md'];
const get = async (path: string) => { const r = await fetch(VIEWER + path); if (!r.ok) throw new Error(`${path}: ${r.status}`); return r.json(); };
type Setup = { runs: number; done: number; series: unknown[] };
type Experiment = { id: string; name: string; test: boolean };

mkdirSync(join(OUT, 'data', 'lean'), { recursive: true });
mkdirSync(join(OUT, 'data', 'doc'), { recursive: true });
const first = await get('/api/lean');
const finished: { meta: Experiment; data: Record<string, unknown> }[] = [];
for (const meta of first.experiments as Experiment[]) {
  if (meta.test) continue;
  const data = await get(`/api/lean?exp=${encodeURIComponent(meta.id)}`), setups = data.setups as Setup[];
  if (setups.length && setups.some((s) => s.series.length) && setups.every((s) => s.done === s.runs)) finished.push({ meta, data });
}
if (!finished.length) throw new Error('no finished experiments');
const list = finished.map((x) => x.meta);
for (const { meta, data } of finished) writeFileSync(join(OUT, 'data', 'lean', `${meta.id}.json`), JSON.stringify({ ...data, experiments: list }));
writeFileSync(join(OUT, 'data', 'lean', 'default.json'), JSON.stringify({ ...finished[0].data, experiments: list }));
for (const set of ['main', 'hard']) writeFileSync(join(OUT, 'data', `problems-${set}.json`), JSON.stringify(await get(`/api/problems?set=${set}`)));
for (const path of DOCS) writeFileSync(join(OUT, 'data', 'doc', `${path.replace(/\W/g, '_')}.json`), JSON.stringify(await get(`/api/doc?path=${path}`)));
writeFileSync(join(OUT, 'index.html'), readFileSync('src/viewer/index.html', 'utf8').replace('<body>', '<body class="static">'));
writeFileSync(join(OUT, '.nojekyll'), '');
console.log(`${list.length} experiments: ${list.map((e) => e.id).join(', ')}`);
