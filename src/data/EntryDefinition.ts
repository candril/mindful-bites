import { ParsedExpression } from "@/lib/expressions";

export type ChoiceItem = {
  key: string;
  title: string;
  value: unknown;
  color?: Colors;
  modifier?: number;
};

type Colors = "red" | "orange" | "yellow" | "green" | "emerald";

export type FieldType =
  | "text"
  | "checkbox"
  | "date"
  | "choice"
  | "multi_choice"
  | "combo_multi_choice"
  | "boolean";

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
  iconName?: string;
  fields: FieldDefinition[];
  titleTemplate: string;
  subtitleTemplate: string;
  ratingExpression: string;
  parsedRatingExpression: ParsedExpression;
};
