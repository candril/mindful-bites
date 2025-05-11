import { getRating } from "@/data/getMealScore";
import { Trash2 } from "lucide-react";
import { FunctionComponent } from "react";
import { Button } from "./ui/button";
import { Dot } from "./Dot";
import { Entry } from "@/data/useStorage";
import { evaluate } from "@/lib/templates";
import { EntryDefinition } from "./form/useFieldDefinitions";
import { snakeToCamel } from "@/lib/utils";
import { ExpressionParser } from "@/lib/expressions";

function createNumberReplacer(
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
      case "combo_multi_choice":
      case "multi_choice":
      case "checkbox":
      case "date":
      case "text":
        return 0;
    }
  };
}
function createReplacer(
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

export const EntryTile: FunctionComponent<{
  entry: Entry;
  onClick?: () => void;
  onDeleteClick?: () => void;
}> = ({ entry, onClick, onDeleteClick }) => {
  const textReplacer = createReplacer(entry.definition, entry.data);
  const numberReplacer = createNumberReplacer(entry.definition, entry.data);
  const title = evaluate(entry.definition.titleTemplate, textReplacer);
  const subTitle = evaluate(entry.definition.subtitleTemplate, textReplacer);

  const expr = new ExpressionParser(
    entry.definition.parsedRatingExpression,
    numberReplacer,
  );

  const score = expr.evaluate();
  const colorCoded = getRating(score);

  return (
    <div
      className="flex items-center justify-between p-4 bg-card text-card-foreground border border-input rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-semibold mr-2">{title}</span>
          <Dot rating={colorCoded} />
        </div>
        <span className="text-sm text-muted-foreground">{subTitle}</span>
      </div>

      {onDeleteClick && (
        <Button
          variant="destructive"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
        >
          <Trash2 size={18} />
        </Button>
      )}
    </div>
  );
};
