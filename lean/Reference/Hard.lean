import Reference.A
import Reference.B
import Reference.C
import Reference.Cross

/-!
# Reference proofs, harder targets (candidates, 2026-11-08)

Hidden from agents. Separate from the main problem set: read only with OSO_PROBLEMS=hard.
-/

namespace OSO

open M2

/-- Shift formula over the integers. -/
theorem u_shift : ∀ k r : Nat, (u (k + r) : Int) = u k * u (r + 1) + ((u (k + 1) : Int) - 5 * u k) * u r
  | 0, r => by simp [u]
  | 1, r => by
    rw [show 1 + r = r + 1 by omega]
    simp [u]
  | k + 2, r => by
    have h1 := u_shift (k + 1) r
    have h0 := u_shift k r
    have e : k + 2 + r = (k + r) + 2 := by omega
    rw [e, u_succ_succ (k + r), show k + r + 1 = k + 1 + r by omega, u_succ_succ k, u_succ_succ (k + 1)]
    push_cast
    rw [h1, h0]
    grind [u_succ_succ]

/-- Catalan's identity for the sequence. -/
theorem catalan (n r : Nat) : (u (n + r) : Int) ^ 2 - u (n + 2 * r) * u n = (-3) ^ n * (u r : Int) ^ 2 := by
  have key : ∀ (A B p q X Y P Q E : Int), X = A * q + (B - 5 * A) * p → Y = A * Q + (B - 5 * A) * P →
      P = p * q + (q - 5 * p) * p → Q = q * q + 3 * p * p → B ^ 2 - (5 * B + 3 * A) * A = E →
      X ^ 2 - Y * A = E * p ^ 2 := by
    intro A B p q X Y P Q E hX hY hP hQ hE
    subst hX hY hP hQ hE
    grind
  have er : (u (r + 2) : Int) = 5 * u (r + 1) + 3 * u r := by rw [u_succ_succ]; push_cast; rfl
  have en : (u (n + 2) : Int) = 5 * u (n + 1) + 3 * u n := by rw [u_succ_succ]; push_cast; rfl
  have hP : (u (2 * r) : Int) = u r * u (r + 1) + ((u (r + 1) : Int) - 5 * u r) * u r := by
    rw [show 2 * r = r + r by omega]; exact u_shift r r
  have hQ : (u (2 * r + 1) : Int) = u (r + 1) * u (r + 1) + 3 * u r * u r := by
    rw [show 2 * r + 1 = r + 1 + r by omega, u_shift (r + 1) r, show r + 1 + 1 = r + 2 from rfl, er]
    grind
  have c := cassini n
  rw [en] at c
  exact key _ _ _ _ _ _ _ _ _ (u_shift n r) (u_shift n (2 * r)) hP hQ c

/-- Merging two merge sorts is a merge sort of the concatenation. -/
theorem merge_msort (a b : List Nat) : merge (msort a) (msort b) = msort (a ++ b) := by
  have ha := msort_pairwise a
  have hb := msort_pairwise b
  have hc := msort_pairwise (a ++ b)
  apply pairwise_unique _ _ (merge_pairwise _ _ ha.1 hb.1) hc.1
  intro x
  rw [cnt_merge, ha.2, hb.2, hc.2, cnt_append]

/-- A list is unchanged by merge sort exactly when it is sorted. -/
theorem msort_eq_self_iff (l : List Nat) : msort l = l ↔ Sorted l := by
  have h := msort_pairwise l
  constructor
  · intro e
    rw [e] at h
    exact (sorted_iff_pairwise _).mpr h.1
  · intro s
    exact pairwise_unique _ _ h.1 ((sorted_iff_pairwise _).mp s) h.2

/-- The even terms factor through the trace of a power of `U`. -/
theorem u_double (n : Nat) : (u (2 * (n + 1)) : Int) = u (n + 1) * tr (pow U (n + 1)) := by
  rw [U_pow n, show 2 * (n + 1) = n + 1 + n + 1 by omega, u_add (n + 1) n]
  simp only [tr]
  push_cast
  grind

end OSO
