import React from "react";
import { MEAL_TYPE_OPTIONS, MealEntry, MealType } from "../data/meals";
import { Trash2, Plus } from "lucide-react";
import { Button } from "./ui/button";

export const MealPicker: React.FC<{
  meals: MealEntry[];
  onAddClick: () => void;
  onEntryClick: (entry: MealEntry) => void;
  onRemoveClick: (entry: MealEntry) => void;
}> = ({ meals, onAddClick, onEntryClick, onRemoveClick }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4">
        {meals.map((m) => {
          const typeName = getMealTypeName(m.mealType);
          const summary = getComponentSummary(m);
          return (
            <div
              key={m.id}
              className="flex items-center justify-between p-4 bg-card text-card-foreground border border-input rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer"
              onClick={() => onEntryClick(m)}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{typeName}</span>
                <span className="text-sm text-muted-foreground">{summary}</span>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveClick(m);
                }}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          );
        })}
      </div>
      <Button
        variant="default"
        size="default"
        className="mt-6 w-full"
        onClick={onAddClick}
      >
        <Plus size={18} />
        Add New
      </Button>
    </div>
  );
};

function getMealTypeName(type: MealType): string | undefined {
  return MEAL_TYPE_OPTIONS.find((t) => t.value === type)?.label ?? "n/a";
}

function getComponentSummary(entry: MealEntry) {
  return entry.components.slice(0, 3).join(", ");
}
