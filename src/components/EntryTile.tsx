import { getRating } from "@/data/getMealScore";
import { Trash2 } from "lucide-react";
import { FunctionComponent } from "react";
import { Button } from "./ui/button";
import { Dot } from "./Dot";
import { Entry } from "@/data/useStorage";
import { evaluate } from "@/lib/templates";
import { ExpressionParser } from "@/lib/expressions";
import { createNumberReplacer } from "@/data/createNumberReplacer";
import { createReplacer } from "@/data/createReplacer";

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
