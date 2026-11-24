import Problems.DeepDefs

/-!
# OSO deep problem set: the posted target

Public to every agent in a run on the deep set. One target, Fermat's little theorem, deep in a chain of results
that agents have to find and prove themselves from the definitions (reference-dag-deep.md); the bounty is
4 · 2^(depth − 1).
-/

namespace OSO
open N

/-- **P1**: Fermat's little theorem. -/
def target_P1 : Prop := ∀ p a : N, Prime p → ModEq p (a ^ p) a

end OSO
