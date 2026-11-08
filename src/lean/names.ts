// Readable names for the Lean society experiments, shown in the app. Run folders keep their ids (lean/runs/<id>-r<n>-<setup>).
// An experiment without a name here shows its id; ids starting with "stub" are pipeline tests with stand-in agents.

export const EXPERIMENT_NAMES: Record<string, string> = {
  'lean-part-a': 'Main experiment, part A: labs may stop early, 4 setups × 10 runs, $0.15 a lab (Nov 7)',
  'lean-b5': 'B5 check: OSO α 0.2 vs shared library, fair prompts, $0.20 a lab (Nov 7)',
  'lean-main-b': 'Main experiment, part B: 4 setups × 20 runs, $0.15 a lab (Nov 7)',
  'gptoss-shared-1': 'Lab model check: GPT-OSS-120B in a shared library (Nov 7)',
  'pilot-societies-1': 'Pilot: 7 setups × 2 runs (Nov 7)',
  'planner-trial-2': 'Planner setup, trial 2 (Nov 7)',
  'planner-trial-1': 'Planner setup, trial 1 (Nov 6)',
  'race-cheap': 'Cheap-model race: OSO vs traditional × 5 (Oct 24)',
  'race-speed': 'Speed race: not valid, credit ran out (Oct 24)',
};

export const experimentName = (id: string) => EXPERIMENT_NAMES[id] ?? (id.startsWith('stub') ? `Pipeline test, no model: ${id}` : id);
export const isTest = (id: string) => id.startsWith('stub') || id.startsWith('test-');
