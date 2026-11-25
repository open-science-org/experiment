import Problems.DeepDefs

/-!
# OSO QR problem set ("Peano to quadratic reciprocity"): definitions

Public to every agent in a run on the QR set. The deep set's numbers `N` and everything defined there
(addition, multiplication, powers, order, divisibility, primes, sums, binomial coefficients, congruences),
plus what quadratic reciprocity needs: products over a range, remainders and quotients, counting, and
"is a square mod p". Remainder and quotient are defined by counting up, so they compute on small numbers.
-/

namespace OSO
namespace N

deriving instance DecidableEq for N

/-- Two. -/
def two : N := succ 1

/-- `prod f n = f 0 * f 1 * … * f (n - 1)`. -/
def prod (f : N → N) : N → N
  | zero => succ zero
  | succ n => prod f n * f n

/-- `a % n`, counting up from 0: the remainder goes back to 0 each time it reaches `n` (`a % 0 = a`). -/
def mod : N → N → N
  | zero, _ => zero
  | succ a, n => if succ (mod a n) = n then zero else succ (mod a n)

/-- `a / n`, counting up with `mod`: it goes up by one each time the remainder goes back to 0 (`a / 0 = 0`). -/
def div : N → N → N
  | zero, _ => zero
  | succ a, n => if succ (mod a n) = n then succ (div a n) else div a n

/-- `ble a b`: whether `a ≤ b`, as a computation. -/
def ble : N → N → Bool
  | zero, _ => true
  | succ _, zero => false
  | succ a, succ b => ble a b

/-- `count t n`: how many `k < n` pass the test `t`. -/
def count (t : N → Bool) : N → N
  | zero => zero
  | succ n => if t n then succ (count t n) else count t n

/-- `a` is a square mod `p`: some `x` has `x * x ≡ a (mod p)`. -/
def IsSq (p a : N) : Prop := ∃ x, ModEq p (x * x) a

end N
end OSO
