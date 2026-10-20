/-!
# OSO demo problem set: definitions

Public to every agent. Three areas, defined from scratch on top of Lean core (no Mathlib):

* **A. A sequence:** `u 0 = 0`, `u 1 = 1`, `u (n + 2) = 5 * u (n + 1) + 3 * u n`.
* **B. Sorting:** insertion sort and merge sort with our own `Sorted` and `cnt`.
* **C. 2 × 2 integer matrices:** product, identity, determinant, trace, powers.
-/

namespace OSO

/-! ## A. The sequence -/

/-- `0, 1, 5, 28, 155, 859, 4760, …` -/
def u : Nat → Nat
  | 0 => 0
  | 1 => 1
  | n + 2 => 5 * u (n + 1) + 3 * u n

/-! ## B. Sorting -/

/-- Insert into a sorted list. -/
def ins (x : Nat) : List Nat → List Nat
  | [] => [x]
  | y :: ys => if x ≤ y then x :: y :: ys else y :: ins x ys

def isort : List Nat → List Nat
  | [] => []
  | x :: xs => ins x (isort xs)

/-- Each element is at most the next. -/
def Sorted : List Nat → Prop
  | [] => True
  | [_] => True
  | x :: y :: ys => x ≤ y ∧ Sorted (y :: ys)

/-- Number of occurrences of `a`. -/
def cnt (a : Nat) : List Nat → Nat
  | [] => 0
  | x :: xs => (if x = a then 1 else 0) + cnt a xs

def merge : List Nat → List Nat → List Nat
  | [], ys => ys
  | x :: xs, [] => x :: xs
  | x :: xs, y :: ys => if x ≤ y then x :: merge xs (y :: ys) else y :: merge (x :: xs) ys

def msort (l : List Nat) : List Nat :=
  if h : l.length < 2 then l
  else merge (msort (l.take (l.length / 2))) (msort (l.drop (l.length / 2)))
termination_by l.length
decreasing_by
  all_goals simp only [List.length_take, List.length_drop]
  all_goals omega

/-! ## C. 2 × 2 integer matrices -/

/-- The matrix `[[a, b], [c, d]]`. -/
structure M2 where
  a : Int
  b : Int
  c : Int
  d : Int
deriving DecidableEq, Repr

namespace M2

def mul (x y : M2) : M2 :=
  ⟨x.a * y.a + x.b * y.c, x.a * y.b + x.b * y.d, x.c * y.a + x.d * y.c, x.c * y.b + x.d * y.d⟩

def add (x y : M2) : M2 := ⟨x.a + y.a, x.b + y.b, x.c + y.c, x.d + y.d⟩

def smul (k : Int) (x : M2) : M2 := ⟨k * x.a, k * x.b, k * x.c, k * x.d⟩

def one : M2 := ⟨1, 0, 0, 1⟩

def det (x : M2) : Int := x.a * x.d - x.b * x.c

def tr (x : M2) : Int := x.a + x.d

def pow (x : M2) : Nat → M2
  | 0 => one
  | n + 1 => mul (pow x n) x

end M2

/-- The matrix that generates `u`. -/
def U : M2 := ⟨5, 3, 1, 0⟩

end OSO
