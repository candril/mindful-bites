import { useData } from "@/data/useData";
import { useToken } from "../AuthenticationContext";
import { ParsedExpression } from "@/lib/expressions";

export type ChoiceItem = {
  key: string;
  title: string;
  value: unknown;
  color?: string;
  modifier?: number;
};

export type FieldType =
  | "text"
  | "checkbox"
  | "date"
  | "choice"
  | "multi_choice"
  | "combo_multi_choice";

export type FieldDefinition = {
  id: string;
  name: string;
  type: FieldType;
  isRequired: boolean;
  label: string;
  description: string;
  choices?: ChoiceItem[];
  order: number;
  defaultValue: string;
  definitionId: string;
};

export type EntryDefinition = {
  id: string;
  name: string;
  description: string;
  fields: FieldDefinition[];
  titleTemplate: string;
  subtitleTemplate: string;
  ratingExpression: string;
  parsedRatingExpression: ParsedExpression;
};

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
