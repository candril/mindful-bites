import { FC } from "react";

export type RatingColor = "bad" | "poor" | "average" | "good" | "excellent";

const ratingColorMap: Record<RatingColor, string> = {
  bad: "bg-red-600",
  poor: "bg-orange-400",
  average: "bg-yellow-400",
  good: "bg-green-400",
  excellent: "bg-green-700",
};

export const Dot: FC<{ rating: RatingColor }> = ({ rating = "bad" }) => (
  <div
    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${ratingColorMap[rating]}`}
  />
);
