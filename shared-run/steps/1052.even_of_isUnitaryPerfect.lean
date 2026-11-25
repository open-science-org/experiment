-- The step plan for 1052.even_of_isUnitaryPerfect: the five steps (as posted in the .json beside this file,
-- left as `sorry`) and a proof of the target from them. `lake env lean steps/1052.even_of_isUnitaryPerfect.lean`
-- in shared-run/ checks that the steps are enough. Labs prove the steps; this file is not part of the library.
import Board
set_option autoImplicit false
open Erdos1052

-- S1: A unitary perfect number's unitary divisors, n itself included, add up to 2n.
theorem S1 (n : ℕ) (hn : IsUnitaryPerfect n) : ∑ d ∈ n.divisors.filter (fun d => d.Coprime (n / d)), d = 2 * n := by sorry
-- S2: The sum of unitary divisors is multiplicative: for coprime a and b, σ*(ab) = σ*(a)·σ*(b). The hardest step.
theorem S2 (a b : ℕ) (h : a.Coprime b) : ∑ d ∈ (a * b).divisors.filter (fun d => d.Coprime (a * b / d)), d = (∑ d ∈ a.divisors.filter (fun d => d.Coprime (a / d)), d) * (∑ d ∈ b.divisors.filter (fun d => d.Coprime (b / d)), d) := by sorry
-- S3: A prime power p^k (k ≥ 1) has exactly two unitary divisors, 1 and p^k.
theorem S3 (p k : ℕ) (hp : p.Prime) (hk : 0 < k) : ∑ d ∈ (p ^ k).divisors.filter (fun d => d.Coprime (p ^ k / d)), d = 1 + p ^ k := by sorry
-- S4: Any n > 1 splits off one prime power: n = p^k·m with k ≥ 1 and p^k coprime to m.
theorem S4 (n : ℕ) (hn : 1 < n) : ∃ p k m : ℕ, p.Prime ∧ 0 < k ∧ (p ^ k).Coprime m ∧ n = p ^ k * m := by sorry
-- S5: An odd number above 1 has an even sum of unitary divisors.
theorem S5 (m : ℕ) (hm : Odd m) (h1 : 1 < m) : Even (∑ d ∈ m.divisors.filter (fun d => d.Coprime (m / d)), d) := by sorry

-- The target, from the steps.
example (n : ℕ) (hn : IsUnitaryPerfect n) : Even n := by
  by_contra hev
  have hodd : Odd n := Nat.not_even_iff_odd.mp hev
  have h1 : 1 < n := by
    rcases hn with ⟨hs, hpos⟩
    rcases Nat.lt_or_ge 1 n with h | h
    · exact h
    · exfalso
      have : n = 1 := by omega
      subst this
      simp [properUnitaryDivisors] at hs
  obtain ⟨p, k, m, hp, hk, hcop, rfl⟩ := S4 n h1
  have hS := S1 _ hn
  rw [S2 _ _ hcop, S3 p k hp hk] at hS
  have hpk : Odd (p ^ k) := (Nat.odd_mul.mp hodd).1
  have hmo : Odd m := (Nat.odd_mul.mp hodd).2
  rcases Nat.lt_or_ge 1 m with hm | hm
  · obtain ⟨r, hr⟩ := S5 m hmo hm
    obtain ⟨s, hs⟩ := hpk
    obtain ⟨u, hu⟩ := hodd
    rw [hr, hu] at hS
    rw [hs] at hS
    have : (1 + (2 * s + 1)) * (r + r) = 4 * ((s + 1) * r) := by ring
    rw [this] at hS
    omega
  · have hm1 : m = 1 := by
      rcases hmo with ⟨t, ht⟩; omega
    subst hm1
    have h1u : ∑ d ∈ (1 : ℕ).divisors.filter (fun d => d.Coprime (1 / d)), d = 1 := by decide
    rw [h1u] at hS
    have : 2 ≤ p ^ k := by
      calc 2 ≤ p := hp.two_le
        _ ≤ p ^ k := Nat.le_self_pow (by omega) p
    omega
