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
  date: Date;
  components: string[];
  healthRating: HealthRating;
  portionSize: PortionSize;
  mealType: MealType;
  userToken: string;
};

export const HEALTH_RATING_OPTIONS: {
  value: HealthRating;
  label: string;
  color: string;
}[] = [
  { value: "very-unhealthy", label: "Very Unhealthy", color: "bg-red-500" },
  { value: "unhealthy", label: "Unhealthy", color: "bg-orange-500" },
  { value: "neutral", label: "Neutral", color: "bg-yellow-500" },
  { value: "healthy", label: "Healthy", color: "bg-green-500" },
  { value: "very-healthy", label: "Very Healthy", color: "bg-emerald-500" },
];

export const PORTION_SIZE_OPTIONS: { value: PortionSize; label: string }[] = [
  { value: "small", label: "Moderat" },
  { value: "just-right", label: "Normal" },
  { value: "large", label: "Zviel" },
];

export const MEAL_TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Zmorge" },
  { value: "lunch", label: "Zmittag" },
  { value: "dinner", label: "Znacht" },
  { value: "snack", label: "Snack" },
];
