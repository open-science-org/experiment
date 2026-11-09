import Reference.Cross
import Problems.Targets

/-! Every posted target is proved by the reference proofs. -/

namespace OSO
open M2

theorem check_A3 : target_A3 := u_dvd_mul
theorem check_A5 : target_A5 := u_gcd
theorem check_B3 : target_B3 := fun l => ⟨isort_sorted l, fun a => cnt_isort a l⟩
theorem check_B5 : target_B5 := msort_eq_isort
theorem check_C3 : target_C3 := det_mul
theorem check_C4 : target_C4 := pow_mul
theorem check_X1 : target_X1 := cassini
theorem check_X2 : target_X2 := isort_u

end OSO
