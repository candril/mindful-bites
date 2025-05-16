import { snakeToCamel } from "@/lib/utils";
import { EntryDefinition } from "./EntryDefinition";

export function createNumberReplacer(
  definition: EntryDefinition,
  data: Record<string, unknown>,
) {
  return (key: string) => {
    const fieldName = snakeToCamel(key);
    const value = data[fieldName];
    const field = definition.fields.find((f) => f.name === fieldName);

    if (!field) {
      return 0;
    }

    switch (field.type) {
      case "choice":
        return field.choices?.find((c) => c.value === value)?.modifier ?? 0;
      case "boolean":
        return value ? 1 : 0;
      case "combo_multi_choice":
      case "multi_choice":
      case "checkbox":
      case "date":
      case "text":
        return 0;
    }
  };
}
