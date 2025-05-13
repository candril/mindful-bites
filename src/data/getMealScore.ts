import { ExpressionParser } from "@/lib/expressions";
import { RatingColor } from "../components/Dot";
import { Entry } from "./useStorage";

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

new ExpressionParser(entry.definition.parsedRatingExpression, 



  let score = 3;

  switch (entry.data.portionSize) {
    case "large":
      score -= 1;
      break;
    case "small":
      score += 1;
      break;
  }

  switch (entry.data.healthRating) {
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
  } else if (score >= colorCoding.length) {
    return "excellent";
  } else {
    return colorCoding[score];
  }
}

export function getMealScore(entry: Entry): RatingColor {
  let score = 3;

  switch (entry.data.portionSize) {
    case "large":
      score -= 1;
      break;
    case "small":
      score += 1;
      break;
  }

  switch (entry.data.healthRating) {
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
  } else if (score >= colorCoding.length) {
    return "excellent";
  } else {
    return colorCoding[score];
  }
}
