import Problems.Defs

/-!
# OSO demo problem set: posted targets

Public to every agent. Each target is a statement with a depth and a bounty. The depth is measured
from the hidden reference proofs (reference-dag.md); the bounty is 4 · 2^(depth − 1). Intermediate lemmas are not posted: finding them is part
of the work. Lean core may be cited freely; Mathlib is not available.

Bounty by depth: 1 → 4, 2 → 8, 3 → 16, 4 → 32, 5 → 64, 7 → 256.
-/

namespace OSO
open M2

/-- **A3** · area A · depth 2 · bounty 8. -/
def target_A3 : Prop := ∀ m k : Nat, u m ∣ u (m * k)

/-- **A5** · area A · depth 7 · bounty 256: strong divisibility. -/
def target_A5 : Prop := ∀ m n : Nat, Nat.gcd (u m) (u n) = u (Nat.gcd m n)

/-- **B3** · area B · depth 4 · bounty 32: insertion sort is correct. -/
def target_B3 : Prop := ∀ l : List Nat, Sorted (isort l) ∧ ∀ a, cnt a (isort l) = cnt a l

/-- **B5** · area B · depth 5 · bounty 64: merge sort and insertion sort agree. -/
def target_B5 : Prop := ∀ l : List Nat, msort l = isort l

/-- **C3** · area C · depth 1 · bounty 4: the determinant is multiplicative. -/
def target_C3 : Prop := ∀ x y : M2, det (mul x y) = det x * det y

/-- **C4** · area C · depth 3 · bounty 16: powers of powers. -/
def target_C4 : Prop := ∀ (x : M2) (m n : Nat), pow x (m * n) = pow (pow x m) n

/-- **X1** · areas A + C · depth 3 · bounty 16: Cassini's identity. -/
def target_X1 : Prop := ∀ n : Nat, (u (n + 1) : Int) ^ 2 - u (n + 2) * u n = (-3) ^ n

/-- **X2** · areas A + B · depth 5 · bounty 64: the sequence is already sorted. -/
def target_X2 : Prop := ∀ n : Nat, isort ((List.range n).map u) = (List.range n).map u

end OSO
