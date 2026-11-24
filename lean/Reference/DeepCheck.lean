import Reference.Deep
import Problems.DeepTargets

/-! The deep set's posted target is proved by the reference proofs. -/

namespace OSO

theorem check_P1 : target_P1 := fun _ a hp => fermat hp a

end OSO
