import Lean
import Reference.Check

/-!
Prints the reference lemma DAG: for each theorem stated in the reference proofs, the other
reference theorems its proof uses. Run: `lake env lean Reference/DAG.lean`.

Recursive proofs compile to auxiliary definitions (`._f`, `.match_1`, `._proof_1`, …), so uses are
followed through any auxiliary constant from the reference modules. Equation and induction lemmas
that Lean generates are skipped.
-/

open Lean Elab Command

private def body? : ConstantInfo → Option Expr
  | .thmInfo t => some t.value
  | .defnInfo d => some d.value
  | _ => none

private def generated (n : Name) : Bool :=
  match n with
  | .str _ s => s.startsWith "eq_" || s == "eq_def" || s.startsWith "induct" || (s.splitOn "congr").length > 1
  | _ => false

run_cmd do
  let env ← getEnv
  let fromRef (n : Name) : Bool :=
    match env.getModuleIdxFor? n with
    | some i => (env.header.moduleNames[i.toNat]!).toString.startsWith "Reference."
    | none => false
  let isThm (ci : ConstantInfo) : Bool := match ci with | .thmInfo _ => true | _ => false
  let ours := env.constants.toList.filterMap fun (n, ci) =>
    let s := n.toString
    if fromRef n && isThm ci && !n.isInternal && !generated n && !s.startsWith "OSO.check_"
      && (s.splitOn "match_").length == 1 && (s.splitOn "_proof_").length == 1 then some n else none
  let set := ours.foldl (fun s n => s.insert n) NameSet.empty
  for n in ours.toArray.qsort (fun a b => a.toString < b.toString) do
    let some ci := env.find? n | continue
    -- Walk the proof, descending into auxiliary constants from the reference modules.
    let mut deps : NameSet := {}
    let mut seen : NameSet := ({} : NameSet).insert n
    let mut stack : Array Expr := #[(body? ci).getD (mkConst ``True)]
    while h : stack.size > 0 do
      let e := stack[stack.size - 1]
      stack := stack.pop
      for c in e.getUsedConstants do
        if seen.contains c then continue
        seen := seen.insert c
        if set.contains c then
          deps := deps.insert c
        else if fromRef c && !generated c then
          if let some ai := env.find? c then
            if let some b := body? ai then stack := stack.push b
    let names := deps.toList.map toString |>.toArray.qsort (· < ·)
    IO.println s!"{n} <- {", ".intercalate names.toList}"
