import Problems.DeepDefs

/-!
# Reference proofs, deep set ("Peano to Fermat")

Hidden from agents. Each theorem is proved from the definitions and the theorems above it, so the chain from
`zero_add` to Fermat's little theorem is long; `levels.py deep` measures it. Lemmas proved by `rfl` are
definitional and count as depth 0.
-/

namespace OSO
open N

/-! ## Definitional lemmas (depth 0) -/

theorem zero_eq : zero = 0 := rfl
theorem one_eq : succ 0 = 1 := rfl
theorem add_zero (a : N) : a + 0 = a := rfl
theorem add_succ (a b : N) : a + succ b = succ (a + b) := rfl
theorem mul_zero (a : N) : a * 0 = 0 := rfl
theorem mul_succ (a b : N) : a * succ b = a * b + a := rfl
theorem pow_zero (a : N) : a ^ (0 : N) = 1 := rfl
theorem pow_succ (a b : N) : a ^ succ b = a ^ b * a := rfl
theorem succ_eq_add_one (a : N) : succ a = a + 1 := rfl

/-! ## Addition -/

theorem zero_add (a : N) : 0 + a = a := by
  induction a with
  | zero => rfl
  | succ a ih => rw [add_succ, ih]

theorem succ_add (a b : N) : succ a + b = succ (a + b) := by
  induction b with
  | zero => rfl
  | succ b ih => rw [add_succ, ih, add_succ]

theorem add_comm (a b : N) : a + b = b + a := by
  induction b with
  | zero => rw [zero_eq, add_zero, zero_add]
  | succ b ih => rw [add_succ, ih, succ_add]

theorem add_assoc (a b c : N) : a + b + c = a + (b + c) := by
  induction c with
  | zero => rfl
  | succ c ih => rw [add_succ, add_succ, add_succ, ih]

theorem add_right_comm (a b c : N) : a + b + c = a + c + b := by
  rw [add_assoc, add_comm b c, ← add_assoc]

theorem add_left_comm (a b c : N) : a + (b + c) = b + (a + c) := by
  rw [← add_assoc, add_comm a b, add_assoc]

theorem succ_inj {a b : N} (h : succ a = succ b) : a = b := N.succ.inj h

theorem add_right_cancel {a b c : N} (h : a + c = b + c) : a = b := by
  induction c with
  | zero => exact h
  | succ c ih => exact ih (succ_inj h)

theorem add_left_cancel {a b c : N} (h : c + a = c + b) : a = b := by
  rw [add_comm c a, add_comm c b] at h
  exact add_right_cancel h

theorem add_left_eq_self {a b : N} (h : a + b = a) : b = 0 := by
  have h' : a + b = a + 0 := h
  exact add_left_cancel h'

theorem left_zero_of_add_eq_zero {a b : N} (h : a + b = 0) : a = 0 := by
  cases b with
  | zero => exact h
  | succ b => exact N.noConfusion h

theorem succ_ne_zero (a : N) : succ a ≠ 0 := fun h => N.noConfusion h

theorem add_one_ne_zero (a : N) : a + 1 ≠ 0 := succ_ne_zero a

/-! ## Multiplication -/

theorem zero_mul (a : N) : 0 * a = 0 := by
  induction a with
  | zero => rfl
  | succ a ih => rw [mul_succ, ih]; rfl

theorem succ_mul (a b : N) : succ a * b = a * b + b := by
  induction b with
  | zero => rfl
  | succ b ih => rw [mul_succ, ih, mul_succ, add_succ, add_succ, add_right_comm]

theorem mul_comm (a b : N) : a * b = b * a := by
  induction b with
  | zero => rw [zero_eq, mul_zero, zero_mul]
  | succ b ih => rw [mul_succ, ih, succ_mul]

theorem mul_one (a : N) : a * 1 = a := by
  rw [← one_eq, mul_succ, mul_zero, zero_add]

theorem one_mul (a : N) : 1 * a = a := by rw [mul_comm, mul_one]

theorem mul_add (a b c : N) : a * (b + c) = a * b + a * c := by
  induction c with
  | zero => rfl
  | succ c ih => rw [add_succ, mul_succ, ih, mul_succ, add_assoc]

theorem add_mul (a b c : N) : (a + b) * c = a * c + b * c := by
  rw [mul_comm, mul_add, mul_comm c a, mul_comm c b]

theorem mul_assoc (a b c : N) : a * b * c = a * (b * c) := by
  induction c with
  | zero => rfl
  | succ c ih => rw [mul_succ, mul_succ, ih, mul_add]

theorem mul_left_comm (a b c : N) : a * (b * c) = b * (a * c) := by
  rw [← mul_assoc, mul_comm a b, mul_assoc]

theorem mul_right_comm (a b c : N) : a * b * c = a * c * b := by
  rw [mul_assoc, mul_comm b c, ← mul_assoc]

theorem two_mul (a : N) : (1 + 1) * a = a + a := by rw [add_mul, one_mul]

theorem mul_eq_zero {a b : N} (h : a * b = 0) : a = 0 ∨ b = 0 := by
  cases b with
  | zero => exact Or.inr rfl
  | succ b =>
    rw [mul_succ] at h
    exact Or.inl (by rw [add_comm] at h; exact left_zero_of_add_eq_zero h)

/-! ## Powers -/

theorem pow_one (a : N) : a ^ (1 : N) = a := by
  rw [← one_eq, pow_succ, pow_zero, one_mul]

theorem one_pow (n : N) : (1 : N) ^ n = 1 := by
  induction n with
  | zero => rfl
  | succ n ih => rw [pow_succ, ih, mul_one]

theorem zero_pow_succ (n : N) : (0 : N) ^ succ n = 0 := by rw [pow_succ, mul_zero]

theorem pow_add (a m n : N) : a ^ (m + n) = a ^ m * a ^ n := by
  induction n with
  | zero => rw [zero_eq, add_zero, pow_zero, mul_one]
  | succ n ih => rw [add_succ, pow_succ, ih, pow_succ, mul_assoc]

theorem mul_pow (a b n : N) : (a * b) ^ n = a ^ n * b ^ n := by
  induction n with
  | zero => rfl
  | succ n ih =>
    rw [pow_succ, ih, pow_succ, pow_succ, mul_assoc, mul_assoc, mul_left_comm (b ^ n) a b]

theorem pow_mul (a m n : N) : a ^ (m * n) = (a ^ m) ^ n := by
  induction n with
  | zero => rfl
  | succ n ih => rw [mul_succ, pow_add, ih, pow_succ]

/-! ## Order -/

theorem le_iff (a b : N) : a ≤ b ↔ ∃ c, b = a + c := Iff.rfl
theorem lt_iff (a b : N) : a < b ↔ succ a ≤ b := Iff.rfl

theorem le_refl (a : N) : a ≤ a := ⟨0, rfl⟩

theorem le_succ_self (a : N) : a ≤ succ a := ⟨1, rfl⟩

theorem zero_le (a : N) : 0 ≤ a := ⟨a, (zero_add a).symm⟩

theorem le_trans {a b c : N} (h1 : a ≤ b) (h2 : b ≤ c) : a ≤ c := by
  obtain ⟨x, hx⟩ := h1
  obtain ⟨y, hy⟩ := h2
  exact ⟨x + y, by rw [hy, hx, add_assoc]⟩

theorem le_antisymm {a b : N} (h1 : a ≤ b) (h2 : b ≤ a) : a = b := by
  obtain ⟨x, hx⟩ := h1
  obtain ⟨y, hy⟩ := h2
  rw [hx, add_assoc] at hy
  have h0 := left_zero_of_add_eq_zero (add_left_eq_self hy.symm)
  rw [hx, h0, add_zero]

theorem succ_le_succ {a b : N} (h : a ≤ b) : succ a ≤ succ b := by
  obtain ⟨c, hc⟩ := h
  exact ⟨c, by rw [hc, succ_add]⟩

theorem le_of_succ_le_succ {a b : N} (h : succ a ≤ succ b) : a ≤ b := by
  obtain ⟨c, hc⟩ := h
  exact ⟨c, by rw [succ_add] at hc; exact succ_inj hc⟩

theorem le_total (a b : N) : a ≤ b ∨ b ≤ a := by
  induction b generalizing a with
  | zero => exact Or.inr (zero_le a)
  | succ b ih =>
    cases a with
    | zero => exact Or.inl (zero_le _)
    | succ a =>
      rcases ih a with h | h
      · exact Or.inl (succ_le_succ h)
      · exact Or.inr (succ_le_succ h)

theorem lt_irrefl (a : N) : ¬ a < a := by
  intro ⟨c, hc⟩
  rw [succ_add, ← add_succ] at hc
  exact succ_ne_zero c (add_left_eq_self hc.symm)

theorem not_succ_le_zero (a : N) : ¬ succ a ≤ 0 := by
  intro ⟨c, hc⟩
  rw [succ_add] at hc
  exact succ_ne_zero _ hc.symm

theorem le_zero {a : N} (h : a ≤ 0) : a = 0 := le_antisymm h (zero_le a)

theorem lt_of_lt_of_le {a b c : N} (h1 : a < b) (h2 : b ≤ c) : a < c := le_trans h1 h2

theorem lt_of_le_of_lt {a b c : N} (h1 : a ≤ b) (h2 : b < c) : a < c := le_trans (succ_le_succ h1) h2

theorem le_of_lt {a b : N} (h : a < b) : a ≤ b := le_trans (le_succ_self a) h

theorem lt_succ_self (a : N) : a < succ a := le_refl _

theorem lt_or_eq_of_le {a b : N} (h : a ≤ b) : a < b ∨ a = b := by
  obtain ⟨c, hc⟩ := h
  cases c with
  | zero => exact Or.inr hc.symm
  | succ c => exact Or.inl ⟨c, by rw [hc, succ_add, add_succ]⟩

theorem lt_or_ge (a b : N) : a < b ∨ b ≤ a := by
  rcases le_total (succ a) b with h | h
  · exact Or.inl h
  · rcases lt_or_eq_of_le h with h' | h'
    · exact Or.inr (le_of_succ_le_succ h')
    · rw [h']; exact Or.inl (lt_succ_self a)

theorem not_lt_of_le {a b : N} (h : a ≤ b) : ¬ b < a := fun h' => lt_irrefl a (lt_of_le_of_lt h h')

theorem lt_succ_iff {a b : N} : a < succ b ↔ a ≤ b := ⟨le_of_succ_le_succ, succ_le_succ⟩

theorem pos_of_ne_zero {a : N} (h : a ≠ 0) : 0 < a := by
  cases a with
  | zero => exact absurd rfl h
  | succ a => exact succ_le_succ (zero_le a)

theorem add_le_add_left {a b : N} (h : a ≤ b) (c : N) : c + a ≤ c + b := by
  obtain ⟨d, hd⟩ := h
  exact ⟨d, by rw [hd, add_assoc]⟩

theorem le_add_right (a b : N) : a ≤ a + b := ⟨b, rfl⟩

theorem le_mul_of_pos {a b : N} (h : 0 < b) : a ≤ a * b := by
  obtain ⟨c, hc⟩ := h
  rw [hc, succ_add, zero_add, mul_succ, add_comm]
  exact le_add_right a _

theorem lt_one {a : N} (h : a < 1) : a = 0 := le_zero (le_of_succ_le_succ h)

theorem one_lt_succ_succ (a : N) : 1 < succ (succ a) := succ_le_succ (succ_le_succ (zero_le a))

theorem eq_one_of_lt_two {a : N} (h0 : 0 < a) (h : a < succ 1) : a = 1 :=
  le_antisymm (le_of_succ_le_succ h) h0

theorem mul_le_mul_left {a b : N} (h : a ≤ b) (c : N) : c * a ≤ c * b := by
  obtain ⟨d, hd⟩ := h
  exact ⟨c * d, by rw [hd, mul_add]⟩

theorem lt_of_mul_lt_mul_left {a b c : N} (h : c * a < c * b) : a < b := by
  rcases lt_or_ge a b with h' | h'
  · exact h'
  · exact absurd h (not_lt_of_le (mul_le_mul_left h' c))

/-- Strong induction. -/
theorem strong_induction (P : N → Prop) (h : ∀ n, (∀ m, m < n → P m) → P n) (n : N) : P n := by
  have key : ∀ n, ∀ m, m < n → P m := by
    intro n
    induction n with
    | zero => intro m hm; exact absurd hm (not_succ_le_zero m)
    | succ n ih =>
      intro m hm
      rcases lt_or_eq_of_le (le_of_succ_le_succ hm) with h' | h'
      · exact ih m h'
      · rw [h']; exact h n ih
  exact key (succ n) n (lt_succ_self n)

/-! ## Divisibility -/

theorem dvd_iff (a b : N) : a ∣ b ↔ ∃ c, b = a * c := Iff.rfl

theorem dvd_refl (a : N) : a ∣ a := ⟨1, (mul_one a).symm⟩

theorem dvd_zero (a : N) : a ∣ 0 := ⟨0, rfl⟩

theorem one_dvd (a : N) : 1 ∣ a := ⟨a, (one_mul a).symm⟩

theorem dvd_mul_right (a b : N) : a ∣ a * b := ⟨b, rfl⟩

theorem dvd_mul_left (a b : N) : a ∣ b * a := ⟨b, mul_comm b a⟩

theorem dvd_trans {a b c : N} (h1 : a ∣ b) (h2 : b ∣ c) : a ∣ c := by
  obtain ⟨x, hx⟩ := h1
  obtain ⟨y, hy⟩ := h2
  exact ⟨x * y, by rw [hy, hx, mul_assoc]⟩

theorem dvd_mul_of_dvd_left {a b : N} (h : a ∣ b) (c : N) : a ∣ b * c := dvd_trans h (dvd_mul_right b c)

theorem dvd_add {a b c : N} (h1 : a ∣ b) (h2 : a ∣ c) : a ∣ b + c := by
  obtain ⟨x, hx⟩ := h1
  obtain ⟨y, hy⟩ := h2
  exact ⟨x + y, by rw [hx, hy, mul_add]⟩

theorem dvd_add_right {a b c : N} (h1 : a ∣ b) (h2 : a ∣ b + c) : a ∣ c := by
  obtain ⟨x, hx⟩ := h1
  obtain ⟨y, hy⟩ := h2
  rcases le_total x y with ⟨d, hd⟩ | ⟨d, hd⟩
  · rw [hx, hd, mul_add] at hy
    exact ⟨d, add_left_cancel hy⟩
  · rw [hx, hd, mul_add, add_assoc] at hy
    have hc : c = 0 := by
      have := add_left_eq_self hy
      rw [add_comm] at this
      exact left_zero_of_add_eq_zero this
    rw [hc]; exact dvd_zero a

theorem le_of_dvd {a b : N} (hb : 0 < b) (h : a ∣ b) : a ≤ b := by
  obtain ⟨c, hc⟩ := h
  rw [hc]
  cases c with
  | zero => rw [hc] at hb; exact absurd hb (lt_irrefl 0)
  | succ c => exact le_mul_of_pos (succ_le_succ (zero_le c))

theorem not_dvd_of_pos_of_lt {a b : N} (hb : 0 < b) (h : b < a) : ¬ a ∣ b :=
  fun h' => not_lt_of_le (le_of_dvd hb h') h

/-! ## Division with remainder -/

theorem div_mod (a b : N) (hb : 0 < b) : ∃ q r, a = b * q + r ∧ r < b := by
  induction a with
  | zero => exact ⟨0, 0, rfl, hb⟩
  | succ a ih =>
    obtain ⟨q, r, h, hr⟩ := ih
    rcases lt_or_eq_of_le hr with h' | h'
    · exact ⟨q, succ r, by rw [h, add_succ], h'⟩
    · exact ⟨succ q, 0, by rw [h, ← add_succ, h', mul_succ]; rfl, hb⟩

/-! ## Primes and Euclid's lemma -/

theorem prime_one_lt {p : N} (hp : Prime p) : 1 < p := hp.1

theorem prime_pos {p : N} (hp : Prime p) : 0 < p := le_trans (le_succ_self 1) hp.1

theorem prime_ne_one {p : N} (hp : Prime p) : p ≠ 1 := fun h => lt_irrefl 1 (h ▸ hp.1)

/-- A number strictly between 0 and `p` that `p` divides a multiple of: `p` divides the other factor. -/
theorem prime_dvd_of_lt {p b : N} (hp : Prime p) : ∀ x, 0 < x → x < p → p ∣ x * b → p ∣ b := by
  intro x
  induction x using strong_induction with
  | h x ih =>
    intro hx0 hxp hdvd
    obtain ⟨q, r, hq, hr⟩ := div_mod p x hx0
    rcases lt_or_eq_of_le (zero_le r) with hr0 | hr0
    · -- p b = x b q + r b, so p ∣ r b
      have hpb : p ∣ x * b * q + r * b := by
        have : p * b = x * b * q + r * b := by
          rw [hq, add_mul, mul_right_comm]
        exact this ▸ dvd_mul_right p b
      have hrb := dvd_add_right (dvd_mul_of_dvd_left hdvd q) hpb
      exact ih r hr hr0 (lt_of_lt_of_le hr (le_of_lt hxp)) hrb
    · -- r = 0: x divides p, so x = 1
      rw [← hr0, add_zero] at hq
      rcases hp.2 x ⟨q, hq⟩ with h1 | h1
      · rw [h1, one_mul] at hdvd; exact hdvd
      · exact absurd (h1 ▸ hxp) (lt_irrefl p)

/-- Euclid's lemma. -/
theorem prime_dvd_mul {p a b : N} (hp : Prime p) (h : p ∣ a * b) : p ∣ a ∨ p ∣ b := by
  obtain ⟨q, r, hq, hr⟩ := div_mod a p (prime_pos hp)
  rcases lt_or_eq_of_le (zero_le r) with hr0 | hr0
  · have hab : a * b = p * q * b + r * b := by rw [hq, add_mul]
    have hrb := dvd_add_right (dvd_mul_of_dvd_left (dvd_mul_right p q) b) (hab ▸ h)
    exact Or.inr (prime_dvd_of_lt hp r hr0 hr hrb)
  · rw [← hr0, add_zero] at hq
    exact Or.inl ⟨q, hq⟩

theorem exists_eq_succ_of_pos {a : N} (h : 0 < a) : ∃ m, a = succ m := by
  cases a with
  | zero => exact absurd h (lt_irrefl 0)
  | succ m => exact ⟨m, rfl⟩

/-! ## Sums -/

theorem sum_zero (f : N → N) : sum f 0 = 0 := rfl
theorem sum_succ (f : N → N) (n : N) : sum f (succ n) = sum f n + f n := rfl

theorem sum_ext {f g : N → N} {n : N} (h : ∀ k, k < n → f k = g k) : sum f n = sum g n := by
  induction n with
  | zero => rfl
  | succ n ih =>
    rw [sum_succ, sum_succ, ih (fun k hk => h k (le_trans hk (le_succ_self n))), h n (lt_succ_self n)]

theorem sum_add (f g : N → N) (n : N) : sum (fun k => f k + g k) n = sum f n + sum g n := by
  induction n with
  | zero => rfl
  | succ n ih =>
    rw [sum_succ, ih, sum_succ, sum_succ]
    simp only [add_assoc, add_comm, add_left_comm]

theorem mul_sum (c : N) (f : N → N) (n : N) : c * sum f n = sum (fun k => c * f k) n := by
  induction n with
  | zero => rfl
  | succ n ih => rw [sum_succ, mul_add, ih, sum_succ]

theorem sum_shift (f : N → N) (n : N) : sum f (succ n) = f 0 + sum (fun k => f (succ k)) n := by
  induction n with
  | zero => show 0 + f 0 = f 0 + 0; rw [zero_add]; rfl
  | succ n ih => rw [sum_succ, ih, sum_succ, add_assoc]

theorem dvd_sum {d : N} {f : N → N} {n : N} (h : ∀ k, k < n → d ∣ f k) : d ∣ sum f n := by
  induction n with
  | zero => exact dvd_zero d
  | succ n ih => exact dvd_add (ih (fun k hk => h k (le_trans hk (le_succ_self n)))) (h n (lt_succ_self n))

/-! ## Binomial coefficients -/

theorem choose_zero_right (n : N) : choose n 0 = 1 := by cases n <;> rfl
theorem choose_zero_succ (k : N) : choose 0 (succ k) = 0 := rfl
theorem choose_succ_succ (n k : N) : choose (succ n) (succ k) = choose n k + choose n (succ k) := rfl

theorem choose_eq_zero_of_lt : ∀ {n k : N}, n < k → choose n k = 0 := by
  intro n
  induction n with
  | zero =>
    intro k hk
    cases k with
    | zero => exact absurd hk (lt_irrefl 0)
    | succ k => rfl
  | succ n ih =>
    intro k hk
    cases k with
    | zero => exact absurd hk (not_succ_le_zero _)
    | succ k =>
      have h1 : n < k := le_of_succ_le_succ hk
      rw [choose_succ_succ, ih h1, ih (le_trans h1 (le_succ_self k))]; rfl

theorem choose_self (n : N) : choose n n = 1 := by
  induction n with
  | zero => rfl
  | succ n ih => rw [choose_succ_succ, ih, choose_eq_zero_of_lt (lt_succ_self n)]; rfl

theorem choose_one_right (n : N) : choose n 1 = n := by
  induction n with
  | zero => rfl
  | succ n ih =>
    show choose n 0 + choose n 1 = succ n
    rw [ih, choose_zero_right, add_comm]; rfl

theorem succ_mul_choose : ∀ n k : N, succ k * choose (succ n) (succ k) = succ n * choose n k := by
  intro n
  induction n with
  | zero => intro k; cases k <;> rfl
  | succ n ih =>
    intro k
    cases k with
    | zero =>
      show succ 0 * (choose (succ n) 0 + choose (succ n) 1) = succ (succ n) * choose (succ n) 0
      rw [choose_one_right, choose_zero_right, one_eq, one_mul, mul_one, add_comm]; rfl
    | succ j =>
      rw [choose_succ_succ (succ n) (succ j), mul_add, ih (succ j), succ_mul (succ j), ih j,
        succ_mul (succ n), choose_succ_succ n j, mul_add]
      simp only [add_assoc, add_comm, add_left_comm]

/-- The binomial theorem, for `(a + 1) ^ n`. -/
theorem add_one_pow (a n : N) : (a + 1) ^ n = sum (fun k => choose n k * a ^ k) (succ n) := by
  induction n with
  | zero => rfl
  | succ n ih =>
    rw [pow_succ, ih, mul_add, mul_one]
    have hsplit : sum (fun k => choose (succ n) k * a ^ k) (succ (succ n))
        = 1 + (sum (fun k => choose n k * a ^ k * a) (succ n)
          + sum (fun k => choose n (succ k) * a ^ succ k) (succ n)) := by
      rw [sum_shift (fun k => choose (succ n) k * a ^ k) (succ n), ← sum_add]
      congr 1
      apply sum_ext
      intro k _
      show (choose n k + choose n (succ k)) * a ^ succ k = choose n k * a ^ k * a + choose n (succ k) * a ^ succ k
      rw [add_mul, pow_succ, mul_assoc]
    have hS : sum (fun k => choose n k * a ^ k) (succ n) = 1 + sum (fun k => choose n (succ k) * a ^ succ k) n := by
      rw [sum_shift (fun k => choose n k * a ^ k) n]
      show choose n 0 * 1 + _ = _
      rw [choose_zero_right]; rfl
    have hT : sum (fun k => choose n (succ k) * a ^ succ k) (succ n) = sum (fun k => choose n (succ k) * a ^ succ k) n := by
      rw [sum_succ]
      show _ + choose n (succ n) * _ = _
      rw [choose_eq_zero_of_lt (lt_succ_self n), zero_mul]; rfl
    have ha : sum (fun k => choose n k * a ^ k * a) (succ n) = sum (fun k => choose n k * a ^ k) (succ n) * a := by
      rw [mul_comm, mul_sum]
      exact sum_ext (fun k _ => mul_comm _ _)
    rw [hsplit, hT, ha, hS]
    simp only [add_assoc, add_comm, add_left_comm]

theorem prime_dvd_choose {p k : N} (hp : Prime p) (hk0 : 0 < k) (hk : k < p) : p ∣ choose p k := by
  obtain ⟨m, hm⟩ := exists_eq_succ_of_pos (prime_pos hp)
  obtain ⟨j, hj⟩ := exists_eq_succ_of_pos hk0
  have h := succ_mul_choose m j
  rw [← hm, ← hj] at h
  have hd : p ∣ k * choose p k := h ▸ dvd_mul_right p _
  rcases prime_dvd_mul hp hd with h1 | h1
  · exact absurd h1 (not_dvd_of_pos_of_lt hk0 hk)
  · exact h1

/-- `(a + 1) ^ p` is `a ^ p + 1` plus a multiple of `p`. -/
theorem add_one_pow_prime {p : N} (hp : Prime p) (a : N) : ∃ s, (a + 1) ^ p = a ^ p + 1 + p * s := by
  obtain ⟨m, hm⟩ := exists_eq_succ_of_pos (prime_pos hp)
  have hd : p ∣ sum (fun k => choose p (succ k) * a ^ succ k) m :=
    dvd_sum (fun k hk => dvd_mul_of_dvd_left
      (prime_dvd_choose hp (succ_le_succ (zero_le k)) (hm ▸ succ_le_succ hk)) _)
  obtain ⟨s, hs⟩ := hd
  refine ⟨s, ?_⟩
  rw [add_one_pow, hm, sum_shift (fun k => choose (succ m) k * a ^ k) (succ m), sum_succ]
  show choose (succ m) 0 * 1 + (sum (fun k => choose (succ m) (succ k) * a ^ succ k) m
    + choose (succ m) (succ m) * a ^ succ m) = a ^ succ m + 1 + succ m * s
  rw [← hm, hs, hm, choose_zero_right, choose_self, one_mul, one_mul]
  simp only [add_assoc, add_comm, add_left_comm]

/-! ## Congruences -/

theorem modEq_refl (n a : N) : ModEq n a a := ⟨0, 0, rfl⟩

theorem modEq_symm {n a b : N} (h : ModEq n a b) : ModEq n b a := by
  obtain ⟨x, y, h⟩ := h
  exact ⟨y, x, h.symm⟩

theorem modEq_trans {n a b c : N} (h1 : ModEq n a b) (h2 : ModEq n b c) : ModEq n a c := by
  obtain ⟨x, y, hxy⟩ := h1
  obtain ⟨u, v, huv⟩ := h2
  refine ⟨x + u, y + v, ?_⟩
  rw [mul_add, mul_add, ← add_assoc, hxy, add_right_comm, huv]
  simp only [add_assoc, add_comm, add_left_comm]

theorem modEq_add_right {n a b : N} (h : ModEq n a b) (c : N) : ModEq n (a + c) (b + c) := by
  obtain ⟨x, y, h⟩ := h
  exact ⟨x, y, by rw [add_right_comm, h, add_right_comm]⟩

theorem modEq_add_mul (n a s : N) : ModEq n (a + n * s) a := ⟨0, s, rfl⟩

/-- Fermat's little theorem: the target. -/
theorem fermat {p : N} (hp : Prime p) (a : N) : ModEq p (a ^ p) a := by
  induction a with
  | zero =>
    obtain ⟨m, hm⟩ := exists_eq_succ_of_pos (prime_pos hp)
    show ModEq p (0 ^ p) 0
    rw [hm, zero_pow_succ]
    exact modEq_refl _ _
  | succ a ih =>
    obtain ⟨s, hs⟩ := add_one_pow_prime hp a
    rw [succ_eq_add_one, hs]
    exact modEq_trans (modEq_add_mul p _ s) (modEq_add_right ih 1)

end OSO
