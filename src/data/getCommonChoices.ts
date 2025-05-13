import { FieldDefinition } from "./EntryDefinition";
import { Entry } from "./useStorage";

export function getCommonChoices(
  field: FieldDefinition,
  allEntries: Entry[],
): string[] {
  const allComponents = allEntries
    ?.map((e) => e.data[field.name] as string[])
    .flat(1);

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

  return [...map].sort(([, a], [, b]) => b - a).map(([c]) => c);
}
