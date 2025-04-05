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
    const trimmedComponent = component.trim();
    if (trimmedComponent && !components.includes(trimmedComponent)) {
      setComponents([...components, trimmedComponent]);
      setNewComponent("");
    }
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
      date,
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
