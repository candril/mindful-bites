import { RatingColor } from "../components/Dot";
import { MealEntry } from "../data/meals";

export const ratingColorMap: Record<RatingColor, string> = {
  bad: "bg-red-600",
  poor: "bg-orange-400",
  average: "bg-yellow-400",
  good: "bg-green-400",
  excellent: "bg-green-700",
};

const mealColorCoding: RatingColor[] = [
  "bad",
  "poor",
  "average",
  "good",
  "excellent",
];

export function getMealScore(entry: MealEntry): RatingColor {
  let score = 3;

  switch (entry.portionSize) {
    case "large":
      score -= 1;
      break;
    case "small":
      score += 1;
      break;
  }

  switch (entry.healthRating) {
    case "very-unhealthy":
      score -= 2;
      break;
    case "unhealthy":
      score -= 1;
      break;
    case "neutral":
      break;
    case "healthy":
      score += 1;
      break;
    case "very-healthy":
      score += 2;
      break;
  }

  if (score <= 0) {
    return "bad";
  } else if (score >= mealColorCoding.length) {
    return "excellent";
  } else {
    return mealColorCoding[score];
  }
}
