import React from "react";
import { MEAL_TYPE_OPTIONS, MealEntry, MealType } from "../data/meals";
import { Trash2 } from "lucide-react";

export const MealPicker: React.FC<{
  meals: MealEntry[];
  onAddClick: () => void;
  onEntryClick: (entry: MealEntry) => void;
  onRemoveClick: (entry: MealEntry) => void;
}> = ({ meals, onAddClick, onEntryClick, onRemoveClick }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-1">
        {meals.map((m) => (
          <div
            className="flex border border-slate-300 rounded-md text-left"
            key={m.id}
          >
            <button
              className="flex-1 p-3 text-left"
              onClick={() => onEntryClick(m)}
            >
              {getMealTypeName(m.mealType)}: {getComponentSummary(m)}
            </button>
            <button className="pr-3" onClick={() => onRemoveClick(m)}>
              <Trash2 size={20} strokeWidth={0.75} />
            </button>
          </div>
        ))}
      </div>
      <button
        className="border text-white bg-blue-500 p-3 rounded-md mt-8"
        onClick={onAddClick}
      >
        Add New
      </button>
    </div>
  );
};

function getMealTypeName(type: MealType): string | undefined {
  return MEAL_TYPE_OPTIONS.find((t) => t.value === type)?.label ?? "n/a";
}

function getComponentSummary(entry: MealEntry) {
  return entry.components.slice(0, 3).join(", ");
}
