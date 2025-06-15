import { useData } from "@/data/useData";
import { useToken } from "../AuthenticationContext";
import { ParsedExpression } from "@/lib/expressions";
import { EntryDefinition } from "@/data/EntryDefinition";

export function useEntryDefinitions() {
  const token = useToken();
  const { data, mutate } = useData<EntryDefinition[]>(
    `/api/users/${token}/definitions/`,
  );

  const definitions = data?.map((d) => ({
    ...d,
    parsedRatingExpression: new ParsedExpression(d.ratingExpression),
  }));

  return { definitions, mutate };
}

export function useFieldDefinitions(definitionId: string) {
  const { definitions } = useEntryDefinitions();

  const definition = definitions?.find((e) => e.id === definitionId);

  return definition?.fields.map((f) => ({ ...f, definitionId }));
}
