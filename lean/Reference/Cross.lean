import Reference.A
import Reference.B
import Reference.C

/-!
# Reference proofs, cross-area targets

Hidden from agents. Each target needs results from two areas.
-/

namespace OSO

open M2

/-- Level 4 (A + C): the powers of `U = [[5, 3], [1, 0]]` are made of the sequence. -/
theorem U_pow : ∀ n, pow U (n + 1) = ⟨u (n + 2), 3 * u (n + 1), u (n + 1), 3 * u n⟩
  | 0 => by decide
  | n + 1 => by
    rw [pow, U_pow n]
    simp only [mul, U, M2.mk.injEq]
    have e₁ : u (n + 1 + 2) = 5 * u (n + 1 + 1) + 3 * u (n + 1) := u_succ_succ (n + 1)
    have e₂ : u (n + 2) = 5 * u (n + 1) + 3 * u n := u_succ_succ n
    have e₃ : u (n + 1 + 1) = u (n + 2) := rfl
    refine ⟨?_, ?_, ?_, ?_⟩ <;> push_cast <;> omega

/-- Level 5 (posted target, A + C): Cassini's identity for the sequence. -/
theorem cassini (n : Nat) : (u (n + 1) : Int) ^ 2 - u (n + 2) * u n = (-3) ^ n := by
  have h := det_pow U (n + 1)
  rw [U_pow n] at h
  simp only [det, U] at h
  rw [Int.pow_succ] at h
  push_cast at h
  grind

theorem u_mono {i j : Nat} (h : i ≤ j) : u i ≤ u j := by
  induction h with
  | refl => exact Nat.le_refl _
  | step _ ih => exact Nat.le_trans ih (u_le_succ _)

/-- Level 4 (posted target, A + B): sorting the first `n` terms of the sequence changes nothing. -/
theorem isort_u (n : Nat) : isort ((List.range n).map u) = (List.range n).map u := by
  have hp : ((List.range n).map u).Pairwise (· ≤ ·) := by
    rw [List.pairwise_map]
    exact List.pairwise_lt_range.imp (fun h => u_mono (Nat.le_of_lt h))
  exact pairwise_unique _ _ ((sorted_iff_pairwise _).mp (isort_sorted _)) hp (fun a => cnt_isort a _)

end OSO
