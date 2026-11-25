// Readable names for the Lean society experiments, shown in the app. Run folders keep their ids (lean/runs/<id>-r<n>-<setup>).
// An experiment without a name here shows its id; ids starting with "stub" are pipeline tests with stand-in agents.

export const EXPERIMENT_NAMES: Record<string, string> = {
  'lean-hard': 'Pilot: harder targets, stage 1, 4 setups × 2 runs, $0.20 a lab (Nov 9), left out',
  'lean-hard-2': 'Harder targets: money to reach them, 5 runs per setup, $0.40 a lab (Nov 9)',
  'lean-part-a': 'May quit: labs may stop early, 4 setups × 10 runs, $0.15 a lab (Nov 7)',
  'm3-smoke': 'Labs choose what to publish: smoke test, 1 run at α 0.2, $0.05 a lab (Nov 7)',
  'lean-m3': 'Labs choose what to publish: α 1, 0.8, 0.2 × 10 runs, $0.15 a lab (Nov 8)',
  'lean-m3-off': 'Labs choose, knowledge reward off: α 1, 0.8, 0.2 × 10 runs, $0.15 a lab (Nov 9)',
  'deep-fermat-choose-1': "Does credit flowing back make labs share on Fermat? Labs choose: α 1 against α 0.2, nothing public unless a lab publishes it, 5 runs each, 4 labs, $0.80 a lab, 100 rounds (Nov 25)",
  'deep-fermat-2': "Fermat from scratch, working alone vs sharing vs OSO: traditional, shared library and OSO α 0.2, one run each, 4 labs, $2 a lab, 100 rounds (Nov 25)",
  'deep-fermat-trad-1': "Fermat from scratch, working alone vs OSO: one traditional run beside the earlier OSO α 0.2 run, 4 labs, $2 a lab, 100 rounds (Nov 24)",
  'lean-e1': "Why OSO labs prove more lemmas, the reward or the prompt?: shared (told to prove), shared (told to earn), OSO α 0.2, OSO α 0.2 with earnings hidden × 5 runs, 27 problems, $0.40 a lab (Nov 24)",
  'deep-fermat-1': "Can cheap AI labs under OSO prove Fermat from scratch?: Fermat's little theorem, depth 11, one OSO α 0.2 run, 4 labs, $2 a lab, 100 rounds (Nov 23)",
  'lean-big-1': "Does credit flowing back make labs share? 27 problems, labs choose: traditional, α 1, α 0.2 × 5 runs, $0.40 a lab (Nov 22)",
  'lean-b5': 'Fair-prompt check: OSO α 0.2 vs shared library, $0.20 a lab (Nov 7)',
  'lean-main-b': 'Spend all: labs must spend all their money, 4 setups × 20 runs, $0.15 a lab (Nov 7)',
  'gptoss-shared-1': 'Lab model check: GPT-OSS-120B in a shared library (Nov 7)',
  'pilot-societies-1': 'Pilot: 7 setups × 2 runs (Nov 7)',
  'planner-trial-2': 'Planner setup, trial 2 (Nov 7)',
  'planner-trial-1': 'Planner setup, trial 1 (Nov 6)',
  'race-cheap': 'Cheap-model race: OSO vs traditional × 5 (Oct 24)',
  'race-speed': 'Speed race: not valid, credit ran out (Oct 24)',
};

/** The question each experiment asks, in plain words: one piece of OSO's central question (which organizational
 *  structure gets the most out of a group). The letter is the core experiment it belongs to (A scaling, B incentives). */
export const EXPERIMENT_QUESTIONS: Record<string, string> = {
  'deep-fermat-choose-1': "When labs choose for each lemma whether to publish it or keep it, does credit flowing back (α 0.2) make them share more than when the author keeps all the credit (α 1), and does that get them further into Fermat's little theorem? [A]",
  'deep-fermat-2': "On a deep problem, Fermat's little theorem built from scratch, which way of organizing four labs gets furthest for the same money: each keeps its work private until the theorem is proved (traditional), all share at once (shared library), or all share at once and credit flows back (OSO, α 0.2)? One run each: a first look. [A]",
  'deep-fermat-trad-1': "On one deep problem, Fermat's little theorem built from scratch, do labs get further for the same money when they share every result at once and credit flows back (OSO, α 0.2), or when each keeps its work private until it has proved the theorem (traditional)? One run each: a first look, not a test. [A]",
  'deep-fermat-1': "Can four cheap AI labs prove Fermat's little theorem from scratch, 95 hidden steps deep, when they share every result at once and credit flows back (OSO, α 0.2)?",
  'lean-e1': 'Under OSO, labs lay more groundwork. Is that the reward itself, the instruction to earn, or seeing the earnings? Four setups change one of these at a time. [B]',
  'lean-hard-2': 'On harder targets, which structure reaches them for the least money: keeping work private, a shared library, OSO credit, or one lab planning for the rest? [A]',
  'lean-big-1': 'When labs choose what to publish and when, does credit flowing back make them share more, and does the community prove more? [B]',
};

export const experimentName = (id: string) => EXPERIMENT_NAMES[id] ?? (id.startsWith('stub') ? `Pipeline test, no model: ${id}` : id);
export const isTest = (id: string) => id.startsWith('stub') || id.startsWith('test-');
