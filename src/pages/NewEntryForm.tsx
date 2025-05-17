import { useToken } from "@/components/AuthenticationContext";
import { EntryForm } from "@/components/form/EntryForm";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { createDefaultEntry } from "@/data/createDefaultEntry";
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

  return (
    <EntryForm
      entry={createDefaultEntry(date, token, definition)}
      onSubmit={onSubmit}
    />
  );
};
