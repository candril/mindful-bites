import { describe, it, expect } from "vitest";
import { ExpressionParser, ParsedExpression } from "../expressions";

const testCases = [
  {
    expression: "12 + 3",
    replace: () => 0,
    expected: 15,
  },
  {
    expression: "12 + 3 * 5",
    replace: () => 0,
    expected: 27,
  },

  {
    expression: "pansen + fisch + 13",
    replace: (variable: string) => {
      switch (variable) {
        case "pansen":
          return 33;
        case "fisch":
          return 44;
        default:
          return 0;
      }
    },
    expected: 90,
  },
];

describe("Template evaluation", () => {
  it.each<{
    expression: string;
    replace: (key: string) => number;
    expected: number;
  }>(testCases)(
    'evaluates "$expression" to "$expected"',
    ({ expression, replace, expected }) => {
      const parsed = new ParsedExpression(expression);
      const parser = new ExpressionParser(parsed, replace);
      const result = parser.evaluate();
      expect(result).toBe(expected);
    },
  );
});
