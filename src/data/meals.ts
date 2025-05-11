export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPE_OPTIONS: {
  value: MealType;
  label: string;
  order: number;
}[] = [
  { value: "breakfast", label: "Zmorge", order: 1 },
  { value: "lunch", label: "Zmittag", order: 2 },
  { value: "dinner", label: "Znacht", order: 3 },
  { value: "snack", label: "Snack", order: 4 },
];

export const MEAL_TYPE_MAP: Record<
  MealType,
  (typeof MEAL_TYPE_OPTIONS)[number]
> = MEAL_TYPE_OPTIONS.reduce(
  (map, option) => {
    return { ...map, [option.value]: option };
  },
  {} as Record<MealType, (typeof MEAL_TYPE_OPTIONS)[number]>,
);
