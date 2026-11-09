import Problems.Defs

/-!
# Reference proofs, area C: 2 × 2 integer matrices

Hidden from agents. These prove every area-C target is true and give the reference lemma DAG.
-/

namespace OSO.M2

/-- Level 1. -/
theorem one_mul (x : M2) : mul one x = x := by
  cases x; simp [mul, one]

/-- Level 1. -/
theorem mul_one (x : M2) : mul x one = x := by
  cases x; simp [mul, one]

/-- Level 2. -/
theorem mul_assoc (x y z : M2) : mul (mul x y) z = mul x (mul y z) := by
  cases x; cases y; cases z
  simp only [mul, M2.mk.injEq]
  refine ⟨?_, ?_, ?_, ?_⟩ <;> grind

/-- Level 3 (posted target). -/
theorem det_mul (x y : M2) : det (mul x y) = det x * det y := by
  cases x; cases y
  simp only [det, mul]
  grind

theorem det_one : det one = 1 := by decide

/-- Level 3: Cayley–Hamilton for 2 × 2 matrices. -/
theorem cayley_hamilton (x : M2) : mul x x = add (smul (tr x) x) (smul (-(det x)) one) := by
  cases x
  simp only [mul, add, smul, tr, det, one, M2.mk.injEq]
  refine ⟨?_, ?_, ?_, ?_⟩ <;> grind

/-- Level 4. -/
theorem det_pow (x : M2) : ∀ n, det (pow x n) = det x ^ n
  | 0 => by simp [pow, det_one]
  | n + 1 => by rw [pow, det_mul, det_pow x n, Int.pow_succ]

/-- Level 4 (posted target): every matrix satisfies its characteristic recurrence. -/
theorem pow_succ_succ (x : M2) (n : Nat) :
    pow x (n + 2) = add (smul (tr x) (pow x (n + 1))) (smul (-(det x)) (pow x n)) := by
  show mul (mul (pow x n) x) x = add (smul (tr x) (mul (pow x n) x)) (smul (-(det x)) (pow x n))
  generalize pow x n = p
  cases p; cases x
  simp only [mul, add, smul, tr, det, M2.mk.injEq]
  refine ⟨?_, ?_, ?_, ?_⟩ <;> grind

theorem pow_add (x : M2) (m : Nat) : ∀ n, pow x (m + n) = mul (pow x m) (pow x n)
  | 0 => by rw [Nat.add_zero, pow, mul_one]
  | n + 1 => by rw [← Nat.add_assoc, pow, pow_add x m n, pow, mul_assoc]

/-- Posted target: powers of powers. -/
theorem pow_mul (x : M2) (m : Nat) : ∀ n, pow x (m * n) = pow (pow x m) n
  | 0 => by rw [Nat.mul_zero, pow, pow]
  | n + 1 => by rw [Nat.mul_succ, pow_add, pow_mul x m n, pow]

end OSO.M2
