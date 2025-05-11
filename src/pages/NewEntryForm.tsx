import { useToken } from "@/components/AuthenticationContext";
import { EntryForm } from "@/components/form/EntryForm";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { Entry } from "@/data/useStorage";
import { FC } from "react";
const MEAL_DEFINITION = "26386876-5fd6-4a2d-8d03-064ddb3fd909";
export const NewEntryForm: FC<{
  date: Date;
  onSubmit: (data: Entry) => Promise<boolean>;
}> = ({ date, onSubmit }) => {
  const token = useToken();
  const definitions = useEntryDefinitions();

  const definition = definitions?.find((d) => d.id === MEAL_DEFINITION);
  const fields = definition?.fields;

  if (!definition || !fields || fields.length < 1) {
    return null;
  }

  const initialData = fields.reduce<Record<string, unknown>>(
    (current, next) => ({ ...current, [next.name]: next.defaultValue }),
    {} as Record<string, unknown>,
  );

  return (
    <EntryForm
      entry={{
        id: crypto.randomUUID(),
        data: initialData,
        date: date.toISOString(),
        definitionId: MEAL_DEFINITION,
        definition,
        userToken: token,
      }}
      // commonComponents={commonComponents}
      onSubmit={onSubmit}
    />
  );
};
