import Problems.QrDefs

/-!
# OSO QR problem set: the posted target

Public to every agent in a run on the QR set. One target, the law of quadratic reciprocity, deep in a chain of
results that agents have to find and prove themselves from the definitions; the bounty is 4 · 2^(depth − 1).

Without integers or the Legendre symbol, the law reads: for distinct odd primes `p` and `q`, `q` is a square
mod `p` exactly when `p` is a square mod `q`, unless both are 3 mod 4, when exactly one of them is.
-/

namespace OSO
open N

/-- **Q1**: quadratic reciprocity. -/
def target_Q1 : Prop :=
  ∀ p q : N, Prime p → Prime q → p ≠ q → two < p → two < q →
    ((IsSq p q ↔ IsSq q p) ↔ (ModEq (two * two) p 1 ∨ ModEq (two * two) q 1))

end OSO
