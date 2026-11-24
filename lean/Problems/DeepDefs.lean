/-!
# OSO deep problem set ("Peano to Fermat"): definitions

Public to every agent in a run on the deep set. A number type of its own, `N`, built from zero and successor,
so that no tactic or library result about Lean's `Nat` applies: every fact has to be proved from these
definitions. Addition, multiplication and powers are by recursion on the second argument; order, divisibility,
primes, sums and binomial coefficients are defined from them. The order of the early results follows the
Natural Number Game (leanprover-community/NNG4, Apache-2.0); the later part is new.
-/

namespace OSO

inductive N where
  | zero : N
  | succ : N → N

namespace N

instance : OfNat N 0 := ⟨zero⟩
instance : OfNat N 1 := ⟨succ zero⟩

def add : N → N → N
  | a, zero => a
  | a, succ b => succ (add a b)

def mul : N → N → N
  | _, zero => zero
  | a, succ b => add (mul a b) a

def pow : N → N → N
  | _, zero => succ zero
  | a, succ b => mul (pow a b) a

instance : Add N := ⟨add⟩
instance : Mul N := ⟨mul⟩
instance : HPow N N N := ⟨pow⟩

/-- `a ≤ b`: some `c` has `b = a + c`. -/
instance : LE N := ⟨fun a b => ∃ c, b = a + c⟩
/-- `a < b`: `succ a ≤ b`. -/
instance : LT N := ⟨fun a b => succ a ≤ b⟩
/-- `a ∣ b`: some `c` has `b = a * c`. -/
instance : Dvd N := ⟨fun a b => ∃ c, b = a * c⟩

/-- A prime: more than 1, and its only divisors are 1 and itself. -/
def Prime (p : N) : Prop := 1 < p ∧ ∀ a, a ∣ p → a = 1 ∨ a = p

/-- `sum f n = f 0 + f 1 + … + f (n - 1)`. -/
def sum (f : N → N) : N → N
  | zero => zero
  | succ n => sum f n + f n

/-- Binomial coefficients, by Pascal's rule. -/
def choose : N → N → N
  | _, zero => succ zero
  | zero, succ _ => zero
  | succ n, succ k => choose n k + choose n (succ k)

/-- `a ≡ b (mod n)`: adding multiples of `n` to each makes them equal. -/
def ModEq (n a b : N) : Prop := ∃ x y, a + n * x = b + n * y

end N
end OSO
