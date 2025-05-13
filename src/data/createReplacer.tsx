import { snakeToCamel } from "@/lib/utils";
import { EntryDefinition } from "./EntryDefinition";

export function createReplacer(
  definition: EntryDefinition,
  data: Record<string, unknown>,
): (key: string) => unknown {
  return (key: string) => {
    const fieldName = snakeToCamel(key);
    const value = data[fieldName];
    const field = definition.fields.find((f) => f.name === fieldName);

    if (!field) {
      return key;
    }

    switch (field.type) {
      case "choice":
        return (
          field.choices?.find((c) => c.value === value)?.title ?? "<unknown>"
        );
      case "combo_multi_choice":
        return (value as string[]).slice(0, 3).join(", ") ?? "Nothing";
      case "multi_choice":
      case "checkbox":
      case "date":
      case "text":
        return value;
    }
  };
}
