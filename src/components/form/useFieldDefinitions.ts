import { useData } from "@/data/useData";
import { useToken } from "../AuthenticationContext";
import { ParsedExpression } from "@/lib/expressions";
import { EntryDefinition } from "@/data/EntryDefinition";

export function useEntryDefinitions() {
  const token = useToken();
  const { data } = useData<EntryDefinition[]>(
    `/api/users/${token}/definitions/`,
  );

  return data?.map((d) => ({
    ...d,
    parsedRatingExpression: new ParsedExpression(d.ratingExpression),
  }));
}

export function useFieldDefinitions(definitionId: string) {
  const entryDefinitions = useEntryDefinitions();

  const definition = entryDefinitions?.find((e) => e.id === definitionId);

  return definition?.fields.map((f) => ({ ...f, definitionId }));
}
