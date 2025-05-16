import { describe, it, expect } from "vitest";
import { ExpressionParser, ParsedExpression } from "../expressions";
import { evaluate } from "../templates.ts";

const testCases = [
  {
    template: "The value is {12 + 3 + pansen}! Congratulations",
    replace: (expression: string) =>
      new ExpressionParser(new ParsedExpression(expression), () => 8)
        .evaluate()
        .toString(),
    expected: "The value is 23! Congratulations",
  },
];

describe("Template evaluation", () => {
  it.each<{
    template: string;
    replace: (key: string) => string;
    expected: string;
  }>(testCases)(
    'evaluates "$template" with provided data to get "$expected"',
    ({ template, replace, expected }) => {
      const result = evaluate(template, replace);
      expect(result).toBe(expected);
    },
  );
});
