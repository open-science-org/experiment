import Problems.Defs

/-!
# Reference proofs, area B: sorting

Hidden from agents. These prove every area-B target is true and give the reference lemma DAG.
-/

namespace OSO

/-- Level 2: our `Sorted` is core's `Pairwise (· ≤ ·)`. -/
theorem sorted_iff_pairwise : ∀ l : List Nat, Sorted l ↔ l.Pairwise (· ≤ ·)
  | [] => by simp [Sorted]
  | [x] => by simp [Sorted]
  | x :: y :: ys => by
    have ih := sorted_iff_pairwise (y :: ys)
    rw [List.pairwise_cons, List.forall_mem_cons, ← ih]
    show (x ≤ y ∧ Sorted (y :: ys)) ↔ _
    constructor
    · rintro ⟨hxy, hs⟩
      have hp := ih.mp hs
      rw [List.pairwise_cons] at hp
      exact ⟨⟨hxy, fun z hz => Nat.le_trans hxy (hp.1 z hz)⟩, hs⟩
    · rintro ⟨⟨hxy, _⟩, hs⟩
      exact ⟨hxy, hs⟩

/-- Level 1. -/
theorem ins_length (x : Nat) : ∀ l, (ins x l).length = l.length + 1
  | [] => rfl
  | y :: ys => by
    unfold ins
    split
    · rfl
    · simp [ins_length x ys]

/-- Level 1. -/
theorem cnt_ins (a x : Nat) : ∀ l, cnt a (ins x l) = cnt a (x :: l)
  | [] => rfl
  | y :: ys => by
    unfold ins
    split
    · rfl
    · simp only [cnt, cnt_ins a x ys]
      omega

theorem mem_ins (x z : Nat) : ∀ l, z ∈ ins x l ↔ z = x ∨ z ∈ l
  | [] => by simp [ins]
  | y :: ys => by
    unfold ins
    split
    · simp
    · simp only [List.mem_cons, mem_ins x z ys]
      grind

/-- Level 2. -/
theorem ins_pairwise (x : Nat) : ∀ l : List Nat, l.Pairwise (· ≤ ·) → (ins x l).Pairwise (· ≤ ·)
  | [], _ => by simp [ins]
  | y :: ys, h => by
    rw [List.pairwise_cons] at h
    unfold ins
    split
    · rename_i hxy
      rw [List.pairwise_cons, List.forall_mem_cons]
      exact ⟨⟨hxy, fun z hz => Nat.le_trans hxy (h.1 z hz)⟩, List.pairwise_cons.mpr h⟩
    · rename_i hxy
      rw [List.pairwise_cons]
      refine ⟨fun z hz => ?_, ins_pairwise x ys h.2⟩
      rcases (mem_ins x z ys).mp hz with rfl | hz
      · omega
      · exact h.1 z hz

theorem ins_sorted (x : Nat) (l : List Nat) (h : Sorted l) : Sorted (ins x l) :=
  (sorted_iff_pairwise _).mpr (ins_pairwise x l ((sorted_iff_pairwise l).mp h))

/-- Level 3 (posted target, with `cnt_isort`). -/
theorem isort_sorted : ∀ l, Sorted (isort l)
  | [] => trivial
  | x :: xs => ins_sorted x _ (isort_sorted xs)

/-- Level 3 (posted target, with `isort_sorted`). -/
theorem cnt_isort (a : Nat) : ∀ l, cnt a (isort l) = cnt a l
  | [] => rfl
  | x :: xs => by
    show cnt a (ins x (isort xs)) = cnt a (x :: xs)
    rw [cnt_ins]
    simp only [cnt, cnt_isort a xs]

theorem cnt_pos_iff_mem (a : Nat) : ∀ l, 0 < cnt a l ↔ a ∈ l
  | [] => by simp [cnt]
  | x :: xs => by
    simp only [cnt, List.mem_cons, ← cnt_pos_iff_mem a xs]
    split <;> omega

/-- Level 4: sorted lists with the same counts are equal. -/
theorem pairwise_unique : ∀ l₁ l₂ : List Nat, l₁.Pairwise (· ≤ ·) → l₂.Pairwise (· ≤ ·) →
    (∀ a, cnt a l₁ = cnt a l₂) → l₁ = l₂
  | [], [], _, _, _ => rfl
  | [], y :: ys, _, _, h => by
    have := h y
    simp [cnt] at this
    omega
  | x :: xs, [], _, _, h => by
    have := h x
    simp [cnt] at this
  | x :: xs, y :: ys, h₁, h₂, h => by
    rw [List.pairwise_cons] at h₁ h₂
    have xin : x ∈ y :: ys := (cnt_pos_iff_mem x _).mp (by rw [← h x]; simp [cnt]; omega)
    have yin : y ∈ x :: xs := (cnt_pos_iff_mem y _).mp (by rw [h y]; simp [cnt]; omega)
    have hyx : y ≤ x := by
      rcases List.mem_cons.mp xin with rfl | hx
      · exact Nat.le_refl _
      · exact h₂.1 x hx
    have hxy : x ≤ y := by
      rcases List.mem_cons.mp yin with rfl | hy
      · exact Nat.le_refl _
      · exact h₁.1 y hy
    have e : x = y := Nat.le_antisymm hxy hyx
    subst e
    have rest : ∀ a, cnt a xs = cnt a ys := by
      intro a
      have := h a
      simp only [cnt] at this
      omega
    rw [pairwise_unique xs ys h₁.2 h₂.2 rest]

theorem sorted_unique (l₁ l₂ : List Nat) (h₁ : Sorted l₁) (h₂ : Sorted l₂)
    (h : ∀ a, cnt a l₁ = cnt a l₂) : l₁ = l₂ :=
  pairwise_unique l₁ l₂ ((sorted_iff_pairwise _).mp h₁) ((sorted_iff_pairwise _).mp h₂) h

theorem mem_merge (z : Nat) (xs ys : List Nat) : z ∈ merge xs ys ↔ z ∈ xs ∨ z ∈ ys := by
  fun_induction merge xs ys with
  | case1 ys => simp
  | case2 x xs => simp
  | case3 x xs y ys _ ih => simp only [List.mem_cons, ih]; grind
  | case4 x xs y ys _ ih => simp only [List.mem_cons, ih]; grind

theorem cnt_merge (a : Nat) (xs ys : List Nat) : cnt a (merge xs ys) = cnt a xs + cnt a ys := by
  fun_induction merge xs ys <;> simp_all [cnt] <;> omega

theorem merge_pairwise (xs ys : List Nat) (hx : xs.Pairwise (· ≤ ·)) (hy : ys.Pairwise (· ≤ ·)) :
    (merge xs ys).Pairwise (· ≤ ·) := by
  fun_induction merge xs ys with
  | case1 ys => exact hy
  | case2 x xs => exact hx
  | case3 x xs y ys hxy ih =>
    rw [List.pairwise_cons] at hx ⊢
    refine ⟨fun z hz => ?_, ih hx.2 hy⟩
    rcases (mem_merge z xs (y :: ys)).mp hz with hz | hz
    · exact hx.1 z hz
    · rw [List.pairwise_cons] at hy
      rcases List.mem_cons.mp hz with rfl | hz
      · exact hxy
      · exact Nat.le_trans hxy (hy.1 z hz)
  | case4 x xs y ys hxy ih =>
    rw [List.pairwise_cons] at hy ⊢
    refine ⟨fun z hz => ?_, ih hx hy.2⟩
    rcases (mem_merge z (x :: xs) ys).mp hz with hz | hz
    · rw [List.pairwise_cons] at hx
      rcases List.mem_cons.mp hz with rfl | hz
      · omega
      · exact Nat.le_trans (by omega) (hx.1 z hz)
    · exact hy.1 z hz

theorem cnt_append (a : Nat) (xs ys : List Nat) : cnt a (xs ++ ys) = cnt a xs + cnt a ys := by
  induction xs with
  | nil => simp [cnt]
  | cons x xs ih => simp only [List.cons_append, cnt, ih]; omega

theorem msort_pairwise (l : List Nat) : (msort l).Pairwise (· ≤ ·) ∧ ∀ a, cnt a (msort l) = cnt a l := by
  fun_induction msort l with
  | case1 l h =>
    refine ⟨?_, fun _ => rfl⟩
    match l, h with
    | [], _ => simp
    | [x], _ => simp
  | case2 l h ih₁ ih₂ =>
    refine ⟨merge_pairwise _ _ ih₁.1 ih₂.1, fun a => ?_⟩
    rw [cnt_merge, ih₁.2, ih₂.2, ← cnt_append, List.take_append_drop]

/-- Level 5 (posted target). -/
theorem msort_eq_isort (l : List Nat) : msort l = isort l :=
  pairwise_unique _ _ (msort_pairwise l).1 ((sorted_iff_pairwise _).mp (isort_sorted l))
    (fun a => by rw [(msort_pairwise l).2, cnt_isort])

end OSO
