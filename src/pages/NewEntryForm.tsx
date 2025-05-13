import { useToken } from "@/components/AuthenticationContext";
import { EntryForm } from "@/components/form/EntryForm";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { Entry } from "@/data/useStorage";
import { FC } from "react";

export const NewEntryForm: FC<{
  date: Date;
  definitionId: string;
  onSubmit: (data: Entry) => Promise<boolean>;
}> = ({ date, definitionId, onSubmit }) => {
  const token = useToken();
  const definitions = useEntryDefinitions();

  const definition = definitions?.find((d) => d.id === definitionId);
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
        definitionId,
        definition,
        userToken: token,
      }}
      onSubmit={onSubmit}
    />
  );
};
