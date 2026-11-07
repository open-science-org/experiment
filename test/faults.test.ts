// Fault tests for the Phase 0 runner: a fake model server (Ollama and OpenRouter) fails in each way a
// real one can, and the runner must stop, or score, exactly as it should. No model and no Lean are used.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Mode = 'ok-noproof' | 'http500' | 'stall' | 'stream-error' | 'or-402' | 'or-nocost' | 'or-costly' | 'or-cut-once';
let mode: Mode = 'ok-noproof', creditLeft = 100, calls = 0;
let server: Server, url = '';
const out = mkdtempSync(join(tmpdir(), 'oso-faults-'));

before(async () => {
  server = createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      if (req.url === '/key') return res.end(JSON.stringify({ data: { limit_remaining: 100 } }));
      // The account can be emptier than the key's limit: the run must read both.
      if (req.url === '/credits') return res.end(JSON.stringify({ data: { total_credits: 50, total_usage: 50 - creditLeft } }));
      if (req.url?.startsWith('/models/')) return res.end(JSON.stringify({ data: { endpoints: [] } }));
      calls++;
      if (req.url === '/api/chat') {
        if (mode === 'http500') { res.statusCode = 500; return res.end('model crashed'); }
        res.write(JSON.stringify({ message: { content: 'I think ' } }) + '\n');
        if (mode === 'stall') return; // headers and one chunk, then nothing, forever
        if (mode === 'stream-error') return res.end(JSON.stringify({ error: 'out of memory' }) + '\n');
        return res.end(JSON.stringify({ message: { content: 'the answer is clear.' }, done: true, done_reason: 'stop', prompt_eval_count: 100, eval_count: 50 }) + '\n');
      }
      if (req.url === '/chat/completions') {
        // Half a reply, then the connection drops: like OpenRouter's "terminated". The next call is whole.
        if (mode === 'or-cut-once' && calls === 1) { res.write('{"provider":"Fake","choices":[{"mess'); return res.socket?.destroy(); }
        if (mode === 'or-402') { res.statusCode = 402; return res.end(JSON.stringify({ error: { message: 'Insufficient credits' } })); }
        const usage = { prompt_tokens: 100, completion_tokens: 50, ...(mode === 'or-nocost' ? {} : { cost: mode === 'or-costly' ? 0.5 : 0.001 }) };
        return res.end(JSON.stringify({ provider: 'Fake', choices: [{ message: { content: 'No code here.' }, finish_reason: 'stop' }], usage }));
      }
      res.statusCode = 404; res.end('{}');
    });
  });
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', () => ok()));
  const a = server.address(); url = `http://127.0.0.1:${typeof a === 'object' && a ? a.port : 0}`;
});
after(() => { server.closeAllConnections(); server.close(); });

const ids = 'omni_theorem_3018,omni_theorem_3054';
function bench(run: string, extra: string[], env: Record<string, string> = {}) {
  calls = 0;
  return new Promise<{ code: number; stdout: string; summary: string }>((ok) =>
    execFile('node', ['src/bench/run.ts', '--only', ids, '--repairs', '1', '--run', run, ...extra], {
      env: { ...process.env, OLLAMA_URL: url, OPENROUTER_URL: url, BENCH_OUT: out, LOCAL_IDLE_MS: '1500', ...env }, timeout: 60_000,
    }, (err, stdout, stderr) => {
      const f = join(out, run, 'summary.md');
      ok({ code: (err as { code?: number } | null)?.code ?? 0, stdout: stdout + stderr, summary: existsSync(f) ? readFileSync(f, 'utf8') : '' });
    }));
}
const local = ['--provider', 'local'], remote = ['--provider', 'openrouter'], key = { OPENROUTER_API_KEY: 'test' };

test('a model that answers without a proof is scored as failed, and the run goes on', async () => {
  mode = 'ok-noproof';
  const r = await bench('noproof', local);
  assert.equal(r.code, 0, r.stdout);
  assert.match(r.summary, /One agent \(first attempt\) \| 0 of 2/);
  assert.match(r.summary, /no proof in the reply 2/);
  assert.equal(calls, 4); // two problems, a first try and one repair each
});

test('a server error stops the run instead of counting failures', async () => {
  mode = 'http500';
  const r = await bench('http500', local);
  assert.equal(r.code, 2, r.stdout);
  assert.match(r.summary, /Stopped early \(a model call failed: Ollama 500/);
  assert.match(r.summary, /0 of 2 problems tried/);
  assert.equal(calls, 1);
});

test('a local model that stops sending is abandoned, not waited on forever', async () => {
  mode = 'stall';
  const t0 = Date.now();
  const r = await bench('stall', local);
  assert.equal(r.code, 2, r.stdout);
  assert.match(r.summary, /stuck/);
  assert.ok(Date.now() - t0 < 30_000);
});

test('an error inside the stream stops the run', async () => {
  mode = 'stream-error';
  const r = await bench('stream-error', local);
  assert.equal(r.code, 2);
  assert.match(r.summary, /out of memory/);
});

test('an account without enough credit refuses to start, though the key has money under its limit', async () => {
  mode = 'ok-noproof'; creditLeft = 1;
  const r = await bench('lowcredit', remote, key);
  creditLeft = 100;
  assert.equal(r.code, 1);
  assert.match(r.stdout, /has \$1\.00 left/);
  assert.equal(calls, 0);
});

test('running out of credit midway stops the run', async () => {
  mode = 'or-402';
  const r = await bench('or402', remote, key);
  assert.equal(r.code, 2);
  assert.match(r.summary, /Stopped early \(out of credit \(OpenRouter 402: Insufficient credits/);
  assert.equal(calls, 1);
});

test('a call with no reported cost stops the run rather than counting $0', async () => {
  mode = 'or-nocost';
  const r = await bench('nocost', remote, key);
  assert.equal(r.code, 2);
  assert.match(r.summary, /no cost/);
});

test('the run stops at its budget, and money already spent is counted', async () => {
  mode = 'or-costly';
  const r = await bench('budget', remote, { ...key });
  // default budget is $30; set a small one
  const s = await bench('budget-small', [...remote, '--budget', '0.9'], key);
  assert.equal(r.code, 0);
  assert.equal(s.code, 2, s.stdout);
  assert.match(s.summary, /budget of \$0\.9 spent/);
  assert.match(s.summary, /\*\*Cost:\*\* \$1\.00/); // one problem: two calls at $0.50, then the stop
});

test('a reply cut off partway is asked for again, not lost', async () => {
  mode = 'or-cut-once'; calls = 0;
  process.env.OPENROUTER_URL = url; process.env.OPENROUTER_API_KEY = 'test'; process.env.OPENROUTER_RETRY_MS = '50';
  const { openRouterChat } = await import('../src/lean/agent.ts');
  const reply = await openRouterChat({ provider: 'openrouter', model: 'fake/model', effort: 'low', maxTokens: 100 } as never)('system', [{ role: 'user', content: 'hi' }]);
  assert.equal(reply.text, 'No code here.');
  assert.equal(calls, 2);
});
