export type HealthRating =
  | "very-unhealthy"
  | "unhealthy"
  | "neutral"
  | "healthy"
  | "very-healthy";

export type PortionSize = "small" | "just-right" | "large";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealEntry = {
  id: string;
  date: string;
  components: string[];
  healthRating: HealthRating;
  portionSize: PortionSize;
  mealType: MealType;
  userToken?: string;
};

export const HEALTH_RATING_OPTIONS: {
  value: HealthRating;
  label: string;
  color: string;
}[] = [
  { value: "very-unhealthy", label: "1", color: "bg-red-500" },
  { value: "unhealthy", label: "2", color: "bg-orange-500" },
  { value: "neutral", label: "3", color: "bg-yellow-500" },
  { value: "healthy", label: "4", color: "bg-green-500" },
  { value: "very-healthy", label: "5", color: "bg-emerald-500" },
];

export const PORTION_SIZE_OPTIONS: { value: PortionSize; label: string }[] = [
  { value: "small", label: "Moderat" },
  { value: "just-right", label: "Normal" },
  { value: "large", label: "Zviel" },
];

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
