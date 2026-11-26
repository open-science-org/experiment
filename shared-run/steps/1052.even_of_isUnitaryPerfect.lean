-- The step plan for 1052.even_of_isUnitaryPerfect: the small steps (as posted in the .json beside this file,
-- left as `sorry`), S1 to S5 proved from them, and the target proved from S1 to S5.
-- `lake env lean steps/1052.even_of_isUnitaryPerfect.lean` in shared-run/ checks that the steps are enough.
-- Labs prove the steps; this file is not part of the library.
import Board
set_option autoImplicit false
open Erdos1052

-- S1 pieces
theorem S1a (n : ℕ) (hn : 0 < n) : n.divisors.filter (fun d => d.Coprime (n / d)) = insert n (properUnitaryDivisors n) := by sorry
theorem S1b (n : ℕ) : n ∉ properUnitaryDivisors n := by sorry
theorem S1 (n : ℕ) (hn : IsUnitaryPerfect n) : ∑ d ∈ n.divisors.filter (fun d => d.Coprime (n / d)), d = 2 * n := by
  rw [S1a n hn.2, Finset.sum_insert (S1b n), hn.1]; ring

-- S2 pieces
theorem S2a (a b d : ℕ) (h : a.Coprime b) (hd : d ∣ a * b) : d = Nat.gcd d a * Nat.gcd d b := by sorry
theorem S2b1 (a b d : ℕ) (h : a.Coprime b) (hd : d ∈ (a * b).divisors.filter (fun d => d.Coprime (a * b / d))) :
    Nat.gcd d a ∈ a.divisors.filter (fun d => d.Coprime (a / d)) ∧ Nat.gcd d b ∈ b.divisors.filter (fun d => d.Coprime (b / d)) := by sorry
theorem S2b2 (a b x y : ℕ) (h : a.Coprime b) (hx : x ∈ a.divisors.filter (fun d => d.Coprime (a / d)))
    (hy : y ∈ b.divisors.filter (fun d => d.Coprime (b / d))) : x * y ∈ (a * b).divisors.filter (fun d => d.Coprime (a * b / d)) := by sorry
theorem S2b (a b : ℕ) (h : a.Coprime b) : (a * b).divisors.filter (fun d => d.Coprime (a * b / d)) =
    Finset.image (fun x : ℕ × ℕ => x.1 * x.2) (a.divisors.filter (fun d => d.Coprime (a / d)) ×ˢ b.divisors.filter (fun d => d.Coprime (b / d))) := by
  ext d
  simp only [Finset.mem_image, Finset.mem_product, Prod.exists]
  constructor
  · intro hd
    exact ⟨Nat.gcd d a, Nat.gcd d b, S2b1 a b d h hd, (S2a a b d h (Nat.dvd_of_mem_divisors (Finset.mem_filter.mp hd).1)).symm⟩
  · rintro ⟨x, y, ⟨hx, hy⟩, rfl⟩
    exact S2b2 a b x y h hx hy
theorem S2c (a b : ℕ) (h : a.Coprime b) : Set.InjOn (fun x : ℕ × ℕ => x.1 * x.2) ↑(a.divisors ×ˢ b.divisors) := by sorry
theorem S2 (a b : ℕ) (h : a.Coprime b) : ∑ d ∈ (a * b).divisors.filter (fun d => d.Coprime (a * b / d)), d = (∑ d ∈ a.divisors.filter (fun d => d.Coprime (a / d)), d) * (∑ d ∈ b.divisors.filter (fun d => d.Coprime (b / d)), d) := by
  rw [S2b a b h, Finset.sum_image, Finset.sum_product, Finset.sum_mul_sum]
  intro x hx y hy hxy
  have hx' := Finset.mem_product.mp hx
  have hy' := Finset.mem_product.mp hy
  exact S2c a b h (Finset.mem_coe.mpr (Finset.mem_product.mpr ⟨(Finset.mem_filter.mp hx'.1).1, (Finset.mem_filter.mp hx'.2).1⟩))
    (Finset.mem_coe.mpr (Finset.mem_product.mpr ⟨(Finset.mem_filter.mp hy'.1).1, (Finset.mem_filter.mp hy'.2).1⟩)) hxy

-- S3 pieces
theorem S3a (p k d : ℕ) (hp : p.Prime) (hd : d ∣ p ^ k) (h1 : d ≠ 1) (h2 : d ≠ p ^ k) : ¬ d.Coprime (p ^ k / d) := by sorry
theorem S3b (p k : ℕ) (hp : p.Prime) (hk : 0 < k) : (p ^ k).divisors.filter (fun d => d.Coprime (p ^ k / d)) = {1, p ^ k} := by
  ext d
  simp only [Finset.mem_filter, Nat.mem_divisors, Finset.mem_insert, Finset.mem_singleton]
  constructor
  · rintro ⟨⟨hd, -⟩, hc⟩
    by_contra h
    push_neg at h
    exact S3a p k d hp hd h.1 h.2 hc
  · rintro (rfl | rfl)
    · exact ⟨⟨one_dvd _, pow_ne_zero _ hp.ne_zero⟩, by simp⟩
    · exact ⟨⟨dvd_refl _, pow_ne_zero _ hp.ne_zero⟩, by rw [Nat.div_self (pow_pos hp.pos k)]; exact Nat.coprime_one_right _⟩
theorem S3c (p k : ℕ) (hp : p.Prime) (hk : 0 < k) : (1 : ℕ) ≠ p ^ k := by sorry
theorem S3 (p k : ℕ) (hp : p.Prime) (hk : 0 < k) : ∑ d ∈ (p ^ k).divisors.filter (fun d => d.Coprime (p ^ k / d)), d = 1 + p ^ k := by
  rw [S3b p k hp hk, Finset.sum_pair (S3c p k hp hk)]

-- S4 pieces
theorem S4a (n : ℕ) (hn : 1 < n) : ∃ p, p.Prime ∧ p ∣ n := by sorry
theorem S4b (p n : ℕ) (hp : p.Prime) (hn : n ≠ 0) : (p ^ n.factorization p).Coprime (n / p ^ n.factorization p) := by sorry
theorem S4c (p n : ℕ) : p ^ n.factorization p * (n / p ^ n.factorization p) = n := by sorry
theorem S4d (p n : ℕ) (hp : p.Prime) (hn : n ≠ 0) (hd : p ∣ n) : 0 < n.factorization p := by sorry
theorem S4 (n : ℕ) (hn : 1 < n) : ∃ p k m : ℕ, p.Prime ∧ 0 < k ∧ (p ^ k).Coprime m ∧ n = p ^ k * m := by
  obtain ⟨p, hp, hpn⟩ := S4a n hn
  exact ⟨p, n.factorization p, n / p ^ n.factorization p, hp, S4d p n hp (by omega) hpn, S4b p n hp (by omega), (S4c p n).symm⟩

-- S5, now short
theorem S5 (m : ℕ) (hm : Odd m) (h1 : 1 < m) : Even (∑ d ∈ m.divisors.filter (fun d => d.Coprime (m / d)), d) := by
  obtain ⟨p, k, m', hp, hk, hcop, rfl⟩ := S4 m h1
  rw [S2 _ _ hcop, S3 p k hp hk]
  have he : Even (1 + p ^ k) := by
    obtain ⟨t, ht⟩ := (Nat.odd_mul.mp hm).1
    exact ⟨t + 1, by omega⟩
  exact he.mul_right _

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
