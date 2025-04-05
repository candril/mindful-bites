import { MealEntry } from "../data/meals";

export function getCommonComponents(allEntries: MealEntry[]): string[] {
  const map =
    allEntries
      ?.flatMap((e) => e.components)
      ?.reduce<Map<string, number>>((result, next) => {
        const currentValue = result.get(next);
        if (!currentValue) {
          result.set(next, 1);
        } else {
          result.set(next, currentValue + 1);
        }
        return result;
      }, new Map<string, number>())
      ?.entries() ?? [];

  return [...map].sort(([_, a], [__, b]) => b - a).map(([c]) => c);
}
