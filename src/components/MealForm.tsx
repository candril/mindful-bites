import React from "react";
import { useMealForm } from "./useMealForm";
import {
  HEALTH_RATING_OPTIONS,
  PORTION_SIZE_OPTIONS,
  MEAL_TYPE_OPTIONS,
  MealEntry,
} from "../data/meals";
import { OptionPicker } from "./OptionPicker";
import { ComponentPicker } from "./ComponentPicker";
import { Button } from "./ui/button";
import { SliderPicker } from "./SliderPicker";

export const MealForm: React.FC<{
  date: Date;
  entry?: MealEntry;
  commonComponents: string[];
  onSubmit: (data: MealEntry) => void;
}> = ({ onSubmit, date: inputDate, entry, commonComponents }) => {
  const {
    components,
    healthRating,
    setHealthRating,
    portionSize,
    setPortionSize,
    mealType,
    setMealType,
    addComponent,
    removeComponent,
    getFormData,
    resetForm,
  } = useMealForm(inputDate, entry);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(getFormData());
    resetForm();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col space-y-10 bg-white"
    >
      <div className="space-y-3">
        <label className="block text-sm font-bold opacity-60">
          What type of meal was it?
        </label>
        <OptionPicker
          options={MEAL_TYPE_OPTIONS}
          value={mealType}
          onChange={setMealType}
          columns={4}
          variant="dark"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold opacity-60">
          How much did you eat?
        </label>
        <OptionPicker
          options={PORTION_SIZE_OPTIONS}
          value={portionSize}
          onChange={setPortionSize}
          columns={3}
          variant="dark"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold opacity-60">
          What did you eat?
        </label>
        <ComponentPicker
          components={components}
          commonComponents={commonComponents}
          onAdd={addComponent}
          onRemove={removeComponent}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold opacity-60">
          How healthy was it?
        </label>

        <SliderPicker
          options={HEALTH_RATING_OPTIONS}
          onChange={setHealthRating}
          value={healthRating}
        />
      </div>

      <Button type="submit" className="self-end">
        Save Meal Entry
      </Button>
    </form>
  );
};
