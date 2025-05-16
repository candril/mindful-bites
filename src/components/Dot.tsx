import { ratingColorMap } from "@/data/getEntryScore";
import { FC } from "react";

export type RatingColor = "bad" | "poor" | "average" | "good" | "excellent";

export const Dot: FC<{ rating: RatingColor }> = ({ rating = "bad" }) => (
  <div
    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${ratingColorMap[rating]}`}
  />
);
