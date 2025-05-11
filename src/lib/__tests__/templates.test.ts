import { describe, it, expect } from "vitest";
import { evaluate } from "../templates.ts";

const testCases = [
  {
    template: "Hello how are you my {friend_name} today?",
    replace: () => "John",
    expected: "Hello how are you my John today?",
  },
  {
    template: "The weather is {weather} and temperature is {temp}°C",
    // replace: () => "Foo",
    replace: (key: string) => {
      switch (key) {
        case "weather":
          return "sunny";
        case "temp":
          return 25;
        default:
          return "never";
      }
    },
    expected: "The weather is sunny and temperature is 25°C",
  },
  {
    template: "Incomplete key {still works",
    replace: () => "",
    expected: "Incomplete key {still works",
  },
];

describe("Template evaluation", () => {
  it.each<{
    template: string;
    replace: (key: string) => unknown;
    expected: string;
  }>(testCases)(
    'evaluates "$template" with provided data to get "$expected"',
    ({ template, replace, expected }) => {
      const result = evaluate(template, replace);
      expect(result).toBe(expected);
    },
  );
});
