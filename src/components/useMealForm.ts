import { useState } from "react";
import { HealthRating, PortionSize, MealEntry, MealType } from "../data/meals";

export function useMealForm(inputDate: Date, entry?: MealEntry) {
  const [date, setDate] = useState<Date>(inputDate);
  const [components, setComponents] = useState<string[]>(
    entry?.components ?? [],
  );
  const [healthRating, setHealthRating] = useState<HealthRating>(
    entry?.healthRating ?? "neutral",
  );
  const [portionSize, setPortionSize] = useState<PortionSize>(
    entry?.portionSize ?? "just-right",
  );
  const [mealType, setMealType] = useState<MealType>(
    entry?.mealType ?? "lunch",
  );

  const [newComponent, setNewComponent] = useState("");

  const addComponent = (component: string) => {
    const new_components = component
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length);

    if (new_components.length === 0) {
      setNewComponent("");
      return;
    }

    const existingComponents = new Set(components);
    const merged_components = [...components];
    for (const c of new_components) {
      if (!existingComponents.has(c)) {
        merged_components.push(c);
        existingComponents.add(c);
      }
    }

    setComponents(merged_components);
    setNewComponent("");
  };

  const removeComponent = (component: string) => {
    setComponents(components.filter((c) => c !== component));
  };

  const resetForm = () => {
    setComponents([]);
    setHealthRating("neutral");
    setPortionSize("just-right");
    setMealType("lunch");
  };

  const getFormData = (): MealEntry => {
    const updatedEntry: MealEntry = {
      ...(entry ?? { id: crypto.randomUUID() }),
      date: date.toISOString(),
      components,
      healthRating,
      portionSize,
      mealType,
    };

    return updatedEntry;
  };

  return {
    date,
    setDate,
    components,
    healthRating,
    setHealthRating,
    portionSize,
    setPortionSize,
    mealType,
    setMealType,
    newComponent,
    setNewComponent,
    addComponent,
    removeComponent,
    getFormData,
    resetForm,
  };
}
