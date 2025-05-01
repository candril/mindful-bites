import { MealEntry } from "../data/meals";

export function getCommonComponents(allEntries: MealEntry[]): string[] {
  const allComponents = allEntries?.map((e) => e.components).flat(1);
  if (allComponents?.length === 0) {
    return ["Pizza", "Salat"];
  }

  const map =
    allComponents
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
