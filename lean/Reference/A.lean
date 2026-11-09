import Problems.Defs

/-!
# Reference proofs, area A: the sequence

Hidden from agents. These prove every area-A target is true and give the reference lemma DAG.
-/

namespace OSO

theorem u_succ_succ (n : Nat) : u (n + 2) = 5 * u (n + 1) + 3 * u n := rfl

/-- Level 1. -/
theorem u_pos : ∀ n, 0 < n → 0 < u n
  | 0, h => absurd h (Nat.lt_irrefl 0)
  | 1, _ => by decide
  | n + 2, _ => by
    have := u_pos (n + 1) (by omega)
    rw [u_succ_succ]
    omega

/-- Level 1. -/
theorem u_le_succ : ∀ n, u n ≤ u (n + 1)
  | 0 => by decide
  | n + 1 => by rw [u_succ_succ]; omega

/-- Level 2: the addition formula. -/
theorem u_add : ∀ m n, u (m + n + 1) = u (m + 1) * u (n + 1) + 3 * u m * u n
  | 0, n => by simp [u]
  | 1, n => by
    rw [show 1 + n + 1 = n + 2 by omega, u_succ_succ]
    simp [u]
  | m + 2, n => by
    have h1 := u_add (m + 1) n
    have h0 := u_add m n
    rw [show m + 2 + n + 1 = (m + n + 1) + 2 by omega, u_succ_succ,
      show m + n + 1 + 1 = m + 1 + n + 1 by omega, h1, h0,
      show m + 2 + 1 = (m + 1) + 2 by omega, u_succ_succ (m + 1), u_succ_succ m]
    grind

/-- Level 2 helper: modulo 3 the sequence alternates 1, 2, 1, 2, … from `u 1`. -/
theorem u_mod_three : ∀ n,
    (u (n + 1) % 3 = 1 ∧ u (n + 2) % 3 = 2) ∨ (u (n + 1) % 3 = 2 ∧ u (n + 2) % 3 = 1)
  | 0 => by decide
  | n + 1 => by
    have ih := u_mod_three n
    have e : u (n + 3) = 5 * u (n + 2) + 3 * u (n + 1) := u_succ_succ (n + 1)
    show (u (n + 2) % 3 = 1 ∧ u (n + 3) % 3 = 2) ∨ (u (n + 2) % 3 = 2 ∧ u (n + 3) % 3 = 1)
    omega

/-- Level 2. -/
theorem u_not_three_dvd (n : Nat) (h : 0 < n) : ¬ 3 ∣ u n := by
  obtain ⟨k, rfl⟩ : ∃ k, n = k + 1 := ⟨n - 1, by omega⟩
  have := u_mod_three k
  omega

theorem coprime_three_u (n : Nat) (h : 0 < n) : Nat.Coprime 3 (u n) := by
  have := u_not_three_dvd n h
  have hmod : u n % 3 = 1 ∨ u n % 3 = 2 := by omega
  unfold Nat.Coprime
  rw [Nat.gcd_rec]
  rcases hmod with h1 | h2
  · rw [h1]; decide
  · rw [h2]; decide

/-- Level 3 (posted target). -/
theorem u_dvd_mul (m : Nat) : ∀ k, u m ∣ u (m * k)
  | 0 => by simp [u]
  | k + 1 => by
    cases m with
    | zero => simp [u]
    | succ m' =>
      have ih := u_dvd_mul (m' + 1) k
      rw [show (m' + 1) * (k + 1) = (m' + 1) * k + m' + 1 by rw [Nat.mul_succ]; omega, u_add]
      exact Nat.dvd_add (Nat.dvd_mul_left _ _)
        (Nat.dvd_mul_right_of_dvd (Nat.dvd_mul_left_of_dvd ih 3) _)

/-- Level 3. -/
theorem u_coprime_succ : ∀ n, Nat.Coprime (u n) (u (n + 1))
  | 0 => by decide
  | n + 1 => by
    have ih := u_coprime_succ n
    show Nat.gcd (u (n + 1)) (u (n + 2)) = 1
    rw [u_succ_succ, show 5 * u (n + 1) + 3 * u n = 3 * u n + u (n + 1) * 5 by omega,
      Nat.gcd_add_mul_left_right, Nat.gcd_comm,
      Nat.Coprime.gcd_mul_left_cancel _ (coprime_three_u (n + 1) (by omega))]
    exact ih

/-- Level 4. -/
theorem u_gcd_add (m n : Nat) (hn : 0 < n) : Nat.gcd (u (m + n)) (u n) = Nat.gcd (u m) (u n) := by
  obtain ⟨n', rfl⟩ : ∃ n', n = n' + 1 := ⟨n - 1, by omega⟩
  rw [show m + (n' + 1) = m + n' + 1 by omega, u_add, Nat.gcd_comm,
    show u (m + 1) * u (n' + 1) + 3 * u m * u n' = 3 * u m * u n' + u (n' + 1) * u (m + 1) by grind,
    Nat.gcd_add_mul_left_right, Nat.gcd_comm,
    Nat.Coprime.gcd_mul_right_cancel _ (u_coprime_succ n'),
    Nat.Coprime.gcd_mul_left_cancel _ (coprime_three_u (n' + 1) (by omega))]

theorem u_gcd_add_mul (m r : Nat) (hm : 0 < m) : ∀ q, Nat.gcd (u (r + m * q)) (u m) = Nat.gcd (u r) (u m)
  | 0 => by simp
  | q + 1 => by
    rw [show r + m * (q + 1) = (r + m * q) + m by rw [Nat.mul_succ]; omega, u_gcd_add _ _ hm]
    exact u_gcd_add_mul m r hm q

/-- Level 5 (posted target): strong divisibility. -/
theorem u_gcd (m n : Nat) : Nat.gcd (u m) (u n) = u (Nat.gcd m n) := by
  induction m, n using Nat.gcd.induction with
  | H0 n => simp [u]
  | H1 m n hm ih =>
    have key : Nat.gcd (u n) (u m) = Nat.gcd (u (n % m)) (u m) := by
      have := u_gcd_add_mul m (n % m) hm (n / m)
      rwa [Nat.mod_add_div] at this
    calc Nat.gcd (u m) (u n) = Nat.gcd (u n) (u m) := Nat.gcd_comm _ _
      _ = Nat.gcd (u (n % m)) (u m) := key
      _ = u (Nat.gcd (n % m) m) := ih
      _ = u (Nat.gcd m n) := by rw [← Nat.gcd_rec]

end OSO
