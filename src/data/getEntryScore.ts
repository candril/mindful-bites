import { ExpressionParser } from "@/lib/expressions";
import { RatingColor } from "../components/Dot";
import { Entry } from "./useStorage";
import { createNumberReplacer } from "./createNumberReplacer";

export const ratingColorMap: Record<RatingColor, string> = {
  bad: "bg-red-600",
  poor: "bg-orange-400",
  average: "bg-yellow-400",
  good: "bg-green-400",
  excellent: "bg-green-700",
};

const colorCoding: RatingColor[] = [
  "bad",
  "poor",
  "average",
  "good",
  "excellent",
];

export function getRating(score: number): RatingColor {
  if (score <= 0) {
    return "bad";
  } else if (score >= colorCoding.length) {
    return "excellent";
  } else {
    return colorCoding[score];
  }
}

export function getEnryScore(entry: Entry): RatingColor {
  const score = new ExpressionParser(
    entry.definition.parsedRatingExpression,
    createNumberReplacer(entry.definition, entry.data),
  ).evaluate();

  return getRating(score);
}
