import { useToken } from "@/components/AuthenticationContext";
import { EntryForm } from "@/components/form/EntryForm";
import { useFieldDefinitions } from "@/components/form/useFieldDefinitions";
import { Entry } from "@/data/useStorage";
import { FC } from "react";

export const NewEntryForm: FC<{
  date: Date;
  onSubmit: (data: Entry) => Promise<boolean>;
}> = ({ date, onSubmit }) => {
  const token = useToken();
  const fields = useFieldDefinitions("26386876-5fd6-4a2d-8d03-064ddb3fd909");

  if (!fields || fields.length < 1) {
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
        definitionId: "26386876-5fd6-4a2d-8d03-064ddb3fd909",
        userToken: token,
      }}
      // commonComponents={commonComponents}
      onSubmit={onSubmit}
    />
  );
};
