-- The trusted half of each Lean check (a copy of bench/Axcheck.lean). The agent's file is compiled first; this program then loads
-- the compiled module at run time and reads the theorem's axioms from the environment itself. Nothing in
-- the agent's text runs here, so a macro that rewrites `#print axioms` in its file cannot fake this report.
-- lake env lean --run Axcheck.lean <module> <theorem>   prints: THEOREM <axiom> <axiom> ...  (or MISSING / NOT_A_THEOREM)
import Lean
open Lean

unsafe def main (args : List String) : IO UInt32 := do
  let [mod, thm] := args | IO.eprintln "usage: Axcheck <module> <theorem>"; return 2
  initSearchPath (← findSysroot)
  enableInitializersExecution
  let env ← importModules #[{ module := mod.toName }] {} (trustLevel := 0)
  let n := thm.toName
  match env.find? n with
  | none => IO.println "MISSING"
  | some (.thmInfo _) =>
    let (axs, _) ← (collectAxioms n : CoreM (Array Name)).toIO { fileName := "<axcheck>", fileMap := default } { env }
    IO.println s!"THEOREM {" ".intercalate (axs.toList.map toString)}"
  | some _ => IO.println "NOT_A_THEOREM"
  return 0
