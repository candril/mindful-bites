import React from "react";
import { MealEntry } from "../data/meals";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { MealTile } from "./MealTile";

export const MealPicker: React.FC<{
  meals: MealEntry[];
  onAddClick: () => void;
  onEntryClick: (entry: MealEntry) => void;
  onRemoveClick: (entry: MealEntry) => void;
}> = ({ meals, onAddClick, onEntryClick, onRemoveClick }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4">
        {meals.map((m) => (
          <MealTile
            key={m.id}
            meal={m}
            onDeleteClick={() => onRemoveClick(m)}
            onClick={() => onEntryClick(m)}
          />
        ))}
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
