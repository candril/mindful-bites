import { EntryDefinition } from "./EntryDefinition";

export function createDefaultEntry(
  date: Date,
  token: string,
  definition: EntryDefinition,
) {
  const initialData = definition.fields.reduce<Record<string, unknown>>(
    (current, next) => ({ ...current, [next.name]: next.defaultValue }),
    {} as Record<string, unknown>,
  );

  return {
    id: crypto.randomUUID(),
    data: initialData,
    date: date.toISOString(),
    definitionId: definition.id,
    definition,
    userToken: token,
  };
}
