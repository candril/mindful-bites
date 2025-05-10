import { getMealScore } from "@/data/getMealScore";
import { MealType, MEAL_TYPE_OPTIONS } from "@/data/meals";
import { Trash2 } from "lucide-react";
import { FunctionComponent } from "react";
import { Button } from "./ui/button";
import { Dot } from "./Dot";
import { Entry } from "@/data/useStorage";

function getMealTypeName(type: MealType): string | undefined {
  return MEAL_TYPE_OPTIONS.find((t) => t.value === type)?.label ?? "n/a";
}

function getComponentSummary(entry: Entry) {
  return entry.data.components?.slice(0, 3).join(", ") ?? "Just Something";
}

export const EntryTile: FunctionComponent<{
  meal: Entry;
  onClick?: () => void;
  onDeleteClick?: () => void;
}> = ({ meal: entry, onClick, onDeleteClick }) => {
  const typeName = getMealTypeName(entry.data.mealType);
  const summary = getComponentSummary(entry);
  const rating = getMealScore(entry);

  return (
    <div
      className="flex items-center justify-between p-4 bg-card text-card-foreground border border-input rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-semibold mr-2">{summary}</span>
          <Dot rating={rating} />
        </div>
        <span className="text-sm text-muted-foreground">{typeName}</span>
      </div>

      {onDeleteClick && (
        <Button
          variant="destructive"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
        >
          <Trash2 size={18} />
        </Button>
      )}
    </div>
  );
};
