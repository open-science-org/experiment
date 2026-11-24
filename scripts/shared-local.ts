// A lab in the shared run on a local model (Ollama):
//   node scripts/shared-local.ts <jobs.json> --lab <github user> [--model m] [--tries n] [--submit] [--issue n] [--fork]
// For testing the shared run end to end and for free, as join.txt describes for any agent: the model writes a proof for
// each job, scripts/shared.ts checks it (same checker as the pull request), and the first passing proof of each job is
// written to shared-run/submissions/ for a pull request. jobs.json lists what to try:
//   [{ "kind": "target", "target": "1052.even_of_isUnitaryPerfect" },
//    { "kind": "lemma", "name": "one_mem", "statement": "(n : ℕ) (hn : 1 < n) : 1 ∈ properUnitaryDivisors n", "open": ["Erdos1052"], "problem": "1052" }]
// Proofs only from the model; the statements of lemmas are the job file's. Without --submit nothing leaves this Mac.
// --submit: each passing proof goes straight into its own pull request (a branch from GitHub's master holding only
// that file, made in a separate worktree so this checkout is untouched), as join.txt asks. --issue n: the lab's join
// issue is edited to name the job being worked on, which keeps the lab shown as active. --fork: go through the user's fork even with write access to the shared repo
// (to test the path an outside lab takes).
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { board, checkOne, SOURCES, type Submission } from './shared.ts';

interface Job { kind: 'target' | 'lemma'; target?: string; name?: string; statement?: string; open?: string[]; problem?: string }
const args = process.argv.slice(2);
const flag = (k: string, d: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const jobs: Job[] = JSON.parse(readFileSync(args[0], 'utf8'));
const submit = args.includes('--submit'), viaFork = args.includes('--fork'), issue = flag('--issue', '');
const lab = flag('--lab', ''), model = flag('--model', 'hf.co/mradermacher/Goedel-Prover-V2-8B-GGUF:Q4_K_M'), tries = Number(flag('--tries', '3'));
if (!lab) throw new Error('--lab <github user> is required');
const work = join('shared-run', '.local-lab'), out = join('shared-run', 'submissions');
mkdirSync(work, { recursive: true });

/** The problem file's definitions, without its theorems: the context the model needs to read the statement. */
function context(problem: string) {
  const text = readFileSync(join(SOURCES, `${problem}.lean`), 'utf8');
  const body = text.slice(text.indexOf('namespace'));
  // Keep definitions; drop every theorem or lemma (with its proof) up to the next blank line before a declaration.
  return body.split(/\n(?=@\[|\/--|theorem |lemma |def |noncomputable |abbrev |end )/).filter((b) => !/^(@\[[^\]]*\]\s*)?(theorem|lemma) |^@\[category/.test(b.replace(/^\/--[\s\S]*?-\/\s*/, ''))).join('\n')
    .replace(/\nend \S+\s*$/, '').trim();
}

/** The public library's lemmas on this problem, as the model sees them: already proved, to cite by name (OSO.L1, …).
 *  Read from GitHub before each job, so proofs accepted during the run are in it. */
async function libraryFor(ns: string) {
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${REPO}/master/shared-run/state/library.json?t=${Date.now()}`, { cache: 'no-store' });
    const lib = (await r.json()) as { name: string; statement: string; open: string[]; kind: string }[];
    const mine = lib.filter((e) => e.kind === 'lemma' && e.open.includes(ns));
    return mine.length ? `-- Already proved in the shared library; use them by name.\n${mine.map((e) => `theorem ${e.name} ${/^[:({]/.test(e.statement.trim()) ? e.statement.trim() : `: ${e.statement.trim()}`} := by\n  sorry`).join('\n\n')}` : '';
  } catch { return ''; }
}

async function ask(prompt: string) {
  // Streamed, so the reply starts at once: a long reasoning reply can take many minutes, longer than Node waits for
  // the first byte of a reply that is not streamed. Ollama returns a reasoning model's thinking apart from its
  // answer; the Lean block can be in either.
  const r = await fetch('http://localhost:11434/api/generate', { method: 'POST', body: JSON.stringify({ model, prompt, stream: true, options: { num_predict: 12000, temperature: 0.6 } }) });
  let thinking = '', response = '', rest = '';
  for await (const chunk of r.body!.pipeThrough(new TextDecoderStream())) {
    const lines = (rest + chunk).split('\n');
    rest = lines.pop() ?? '';
    for (const l of lines.filter(Boolean)) { const d = JSON.parse(l) as { thinking?: string; response?: string }; thinking += d.thinking ?? ''; response += d.response ?? ''; }
  }
  return `${thinking}\n${response}`;
}

/** The proof after `:= by` in the model's last Lean block for this theorem. */
function proofOf(reply: string, name: string) {
  const blocks = [...reply.matchAll(/```lean4?\n([\s\S]*?)```/g)].map((m) => m[1]);
  for (const b of blocks.reverse()) {
    const i = b.indexOf(`theorem ${name}`);
    if (i < 0) continue;
    const j = b.indexOf(':= by', i);
    if (j < 0) continue;
    const rest = b.slice(j + ':= by'.length).split(/\n(?=\S)/)[0];
    if (rest.trim()) return ':= by' + rest.replace(/\s+$/, '');
  }
  return null;
}

// Keep the Mac awake (not the screen) for as long as this lab runs: a try takes minutes and sleep would stop it.
if (process.platform === 'darwin') spawn('caffeinate', ['-i', '-w', String(process.pid)], { detached: true, stdio: 'ignore' }).unref();

const sh = (cmd: string, a: string[], cwd?: string) => execFileSync(cmd, a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const REPO = 'open-science-org/experiment';
let pushTo: { url: string; owner: string } | undefined;
/** Where this lab's branches go: the shared repo if the user may push to it, otherwise their own fork (made once). */
function destination() {
  if (pushTo) return pushTo;
  if (!viaFork && sh('gh', ['api', `repos/${REPO}`, '--jq', '.permissions.push']) === 'true') return (pushTo = { url: `https://github.com/${REPO}.git`, owner: '' });
  const owner = sh('gh', ['api', 'user', '--jq', '.login']);
  sh('gh', ['repo', 'fork', REPO, '--clone=false']);
  const fork = sh('gh', ['api', `repos/${REPO}/forks`, '--paginate', '--jq', `.[] | select(.owner.login == "${owner}") | .full_name`]).split('\n')[0];
  if (!fork) throw new Error(`no fork of ${REPO} found for ${owner}`);
  return (pushTo = { url: `https://github.com/${fork}.git`, owner });
}

/** One pull request for one passing proof: a fresh branch from the shared repo's master with only that file, pushed to
 *  the shared repo or, for a lab without write access, to the lab's fork. */
function openPullRequest(file: string, label: string, sub: Submission) {
  const branch = `shared-${lab}-${label.replace(/[^A-Za-z0-9_-]+/g, '-')}-${Date.now().toString(36)}`, tree = join(work, 'tree');
  const to = destination();
  sh('git', ['fetch', '-q', `https://github.com/${REPO}.git`, 'master']);
  sh('git', ['worktree', 'add', '-q', '-B', branch, tree, 'FETCH_HEAD']);
  try {
    mkdirSync(join(tree, out), { recursive: true });
    copyFileSync(file, join(tree, out, file.split('/').pop()!));
    sh('git', ['add', join(out, file.split('/').pop()!)], tree);
    sh('git', ['commit', '-q', '-m', `Shared run: ${sub.kind} ${label}`], tree);
    // The GitHub CLI's login, so this works whether the clone uses SSH or HTTPS.
    sh('git', ['-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', 'push', '-q', to.url, branch], tree);
    const what = sub.kind === 'target' ? `target ${sub.target}` : `lemma ${label}: ${sub.statement}`;
    return sh('gh', ['pr', 'create', '--repo', REPO, '--base', 'master', '--head', to.owner ? `${to.owner}:${branch}` : branch, '--title', `Shared run: ${sub.kind} ${label}`, '--body', `Lab ${lab}: ${what}. Proof by ${model.split('/').pop()} on a local Mac (scripts/shared-local.ts); it passed \`node scripts/shared.ts check\` before submitting.`], tree).split('\n').pop();
  } finally {
    sh('git', ['worktree', 'remove', '--force', tree]);
  }
}

/** Keep the lab's join issue saying what it is working on (and the lab active). */
function working(on: string) {
  if (!issue) return;
  try { sh('gh', ['issue', 'edit', issue, '--repo', 'open-science-org/experiment', '--title', `Lab: working on ${on}`, '--body', `Target: ${on}\nAgent: ${model.split('/').pop()} on a local Mac (scripts/shared-local.ts)\nPlan: small lemmas toward the target, then the target`]); } catch (e) { console.log(`could not edit issue ${issue}: ${String(e).slice(0, 120)}`); }
}

const targets = board();
for (const job of jobs) {
  const t = job.kind === 'target' ? targets.find((x) => x.id === job.target) : undefined;
  if (job.kind === 'target' && !t) { console.log(`skip: no target ${job.target}`); continue; }
  const problem = t?.problem ?? job.problem!, ns = `Erdos${problem}`;
  const label = job.kind === 'target' ? job.target! : job.name!;
  working(job.kind === 'target' ? job.target! : `1052 lemma ${job.name}`);
  const sig = job.kind === 'target' ? t!.statement : job.statement!;
  const head = sig.trim().startsWith(':') || /^[({]/.test(sig.trim()) ? sig.trim() : `: ${sig.trim()}`;
  const known = await libraryFor(ns);
  const prompt = `Complete the following Lean 4 code:\n\n\`\`\`lean4\nimport Mathlib\nimport Aesop\n\nset_option maxHeartbeats 400000\n\n${context(problem)}\n\n${known}\n\ntheorem attempt ${head} := by\n  sorry\n\`\`\`\n\nBefore producing the Lean 4 code to formally prove the given theorem, provide a detailed proof plan outlining the main proof steps and strategies.\nThe plan should highlight key ideas, intermediate lemmas, and proof structures that will guide the construction of the final formal proof.`;
  for (let k = 1; k <= tries; k++) {
    const t0 = Date.now();
    const reply = await ask(prompt);
    writeFileSync(join(work, `${label}-${k}.txt`), reply);
    const proof = proofOf(reply, 'attempt');
    if (!proof) { console.log(`${label} try ${k}: no proof in the reply (${Math.round((Date.now() - t0) / 1000)} s)`); continue; }
    const sub: Submission = job.kind === 'target'
      ? { kind: 'target', target: job.target, proof, open: [ns], note: `local model ${model.split('/').pop()}` }
      : { kind: 'lemma', statement: job.statement, proof, open: job.open ?? [ns], note: `${label}; local model ${model.split('/').pop()}` };
    const file = join(work, `${label}-${k}.json`);
    writeFileSync(file, JSON.stringify(sub, null, 1) + '\n');
    const v = await checkOne(file);
    console.log(`${label} try ${k}: ${v.ok ? 'PASS' : 'FAIL'} (${Math.round((Date.now() - t0) / 1000)} s)${v.ok ? '' : ' ' + v.errors[0]?.split('\n')[0].slice(0, 160)}`);
    if (v.ok) {
      const saved = join(work, `${lab}-${label.replace(/[^A-Za-z0-9_]+/g, '-')}.json`);
      writeFileSync(saved, JSON.stringify(sub, null, 1) + '\n');
      if (submit) { try { console.log(`${label}: pull request ${openPullRequest(saved, label, sub)}`); } catch (e) { console.log(`${label}: could not open the pull request: ${String(e).slice(0, 200)}`); } }
      break;
    }
  }
}
