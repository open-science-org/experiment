// Library search for the labs (option librarySearch): a turn's prompt shows only part of the library, and a lab can
// ask for more with `ACTION: search <words>`. Plain word matching in code, so a search costs no model money; only the
// lab's next reply does.

/** The words of a name or statement: identifiers split at _ . and case changes, symbols kept as they are. */
export function words(s: string): string[] {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s_.,:()[\]{}]+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 0);
}

/** The best matches for a query among the entries' texts, best first: each query word scores by how rare it is in the
 *  library (common words such as N or = count little), the name's words count double. Ties keep the newest first. */
export function search<T>(query: string, entries: T[], text: (e: T) => { name: string; statement: string }, limit = 15): T[] {
  const q = [...new Set(words(query))];
  if (!q.length) return [];
  const docs = entries.map((e) => { const t = text(e); return { e, name: new Set(words(t.name)), all: new Set([...words(t.name), ...words(t.statement)]) }; });
  const df = new Map<string, number>();
  for (const d of docs) for (const w of d.all) df.set(w, (df.get(w) ?? 0) + 1);
  const idf = (w: string) => Math.log(1 + docs.length / (df.get(w) ?? docs.length + 1));
  return docs
    .map((d, k) => ({ d, k, score: q.reduce((s, w) => s + (d.all.has(w) ? idf(w) * (d.name.has(w) ? 2 : 1) : 0), 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.k - a.k)
    .slice(0, limit)
    .map((x) => x.d.e);
}

/** A lemma's statement with its variable names replaced by position, so `(n : N) : n + 0 = n` and `(m : N) : m + 0 = m` match. */
export function statementKey(sig: string) {
  const s = sig.replace(/\s+/g, ' ').trim(), names = new Map<string, string>();
  // Names bound by binders ((x y : T), {x : T}, [h : T]) and by ∀, ∃, fun, λ.
  for (const m of s.matchAll(/[({[]\s*([^():{}\[\]]+?)\s*:(?!=)/g)) for (const n of m[1].split(' ')) if (/^[\p{L}_][\p{L}\p{N}_'.]*$/u.test(n)) names.set(n, '');
  for (const m of s.matchAll(/(?:∀|∃|fun|λ)\s+([^,:=>]+?)\s*(?:,|:|=>)/g)) for (const n of m[1].split(/[\s()]+/)) if (/^[\p{L}_][\p{L}\p{N}_']*$/u.test(n)) names.set(n, '');
  let k = 0;
  for (const n of names.keys()) names.set(n, `v${++k}`);
  return s.replace(/[\p{L}_][\p{L}\p{N}_'.]*/gu, (w) => names.get(w) ?? w);
}
