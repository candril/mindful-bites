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
      className="space-y-6 bg-white p-6 rounded-xl"
    >
      <div className="space-y-1.5">
        <label className="block text-sm text-gray-600">
          What type of meal was it?
        </label>
        <OptionPicker
          options={MEAL_TYPE_OPTIONS}
          value={mealType}
          onChange={setMealType}
          columns={4}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm text-gray-600">What did you eat?</label>
        <ComponentPicker
          components={components}
          commonComponents={commonComponents}
          onAdd={addComponent}
          onRemove={removeComponent}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm text-gray-600">
          How healthy was it?
        </label>
        <OptionPicker
          options={HEALTH_RATING_OPTIONS}
          value={healthRating}
          onChange={setHealthRating}
          columns={5}
          variant="color"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm text-gray-600">
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

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white 
          hover:bg-blue-700 transition-colors"
      >
        Save Meal Entry
      </button>
    </form>
  );
};
