interface TokenizerResult {
  tokens: Token[];
}

type TokenType =
  | "NUMBER"
  | "OPERATOR"
  | "VARIABLE"
  | "LEFT_PAREN"
  | "RIGHT_PAREN";

interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export class ExpressionParser {
  private tokens: Token[] = [];
  private position: number = 0;
  private variableResolver: (varName: string) => number;

  constructor(variableResolver: (varName: string) => number) {
    this.variableResolver = variableResolver;
  }

  parse(expression: string): number {
    this.tokens = this.tokenize(expression).tokens;
    this.position = 0;
    return this.parseExpression();
  }

  private tokenize(expression: string): TokenizerResult {
    const tokens: Token[] = [];
    let position = 0;

    while (position < expression.length) {
      const char = expression[position];

      // Skip whitespace
      if (/\s/.test(char)) {
        position++;
        continue;
      }

      // Parse numbers
      if (/[0-9]/.test(char)) {
        let value = "";
        const startPosition = position;

        while (
          position < expression.length &&
          /[0-9.]/.test(expression[position])
        ) {
          value += expression[position];
          position++;
        }

        tokens.push({ type: "NUMBER", value, position: startPosition });
        continue;
      }

      // Parse operators
      if (/[+\-*/]/.test(char)) {
        tokens.push({ type: "OPERATOR", value: char, position });
        position++;
        continue;
      }

      // Parse parentheses
      if (char === "(") {
        tokens.push({ type: "LEFT_PAREN", value: "(", position });
        position++;
        continue;
      }

      if (char === ")") {
        tokens.push({ type: "RIGHT_PAREN", value: ")", position });
        position++;
        continue;
      }

      // Parse variables
      if (/[a-zA-Z_]/.test(char)) {
        let value = "";
        const startPosition = position;

        while (
          position < expression.length &&
          /[a-zA-Z0-9_]/.test(expression[position])
        ) {
          value += expression[position];
          position++;
        }

        tokens.push({ type: "VARIABLE", value, position: startPosition });
        continue;
      }

      throw new Error(`Unexpected character at position ${position}: ${char}`);
    }

    return { tokens };
  }

  private parseExpression(): number {
    return this.parseAddSubtract();
  }

  private parseAddSubtract(): number {
    let result = this.parseMultiplyDivide();

    while (this.position < this.tokens.length) {
      const token = this.tokens[this.position];

      if (
        token.type !== "OPERATOR" ||
        (token.value !== "+" && token.value !== "-")
      ) {
        break;
      }

      this.position++;
      const right = this.parseMultiplyDivide();

      if (token.value === "+") {
        result += right;
      } else {
        result -= right;
      }
    }

    return result;
  }

  private parseMultiplyDivide(): number {
    let result = this.parseTerm();

    while (this.position < this.tokens.length) {
      const token = this.tokens[this.position];

      if (
        token.type !== "OPERATOR" ||
        (token.value !== "*" && token.value !== "/")
      ) {
        break;
      }

      this.position++;
      const right = this.parseTerm();

      if (token.value === "*") {
        result *= right;
      } else {
        if (right === 0) {
          throw new Error("Division by zero");
        }
        result /= right;
      }
    }

    return result;
  }

  private parseTerm(): number {
    const token = this.tokens[this.position];

    if (!token) {
      throw new Error("Unexpected end of expression");
    }

    if (token.type === "NUMBER") {
      this.position++;
      return parseFloat(token.value);
    }

    if (token.type === "VARIABLE") {
      this.position++;
      return this.variableResolver(token.value);
    }

    if (token.type === "LEFT_PAREN") {
      this.position++;
      const result = this.parseExpression();

      if (
        this.position >= this.tokens.length ||
        this.tokens[this.position].type !== "RIGHT_PAREN"
      ) {
        throw new Error("Missing closing parenthesis");
      }

      this.position++; // Skip the closing parenthesis
      return result;
    }

    if (token.type === "OPERATOR" && token.value === "-") {
      this.position++;
      return -this.parseTerm();
    }

    throw new Error(
      `Unexpected token at position ${token.position}: ${token.value}`,
    );
  }
}
