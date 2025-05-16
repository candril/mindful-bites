export function evaluate(
  template: string,
  replace: (key: string) => unknown,
): string {
  if (!template) {
    return template;
  }

  let result = "";
  let index = 0;

  while (index < template.length) {
    // Check if we've found an opening brace
    if (template[index] === "{") {
      const startBrace = index;
      index++;

      // Collect the key inside the braces
      let key = "";
      while (index < template.length && template[index] !== "}") {
        key += template[index];
        index++;
      }

      // If we found a closing brace, replace with data value
      if (index < template.length && template[index] === "}") {
        const value = replace(key);
        result += value;
        index++; // Move past closing brace
      } else {
        // No closing brace found, treat as literal text
        result += template.substring(startBrace, index);
      }
    } else {
      // Regular character, just append to result
      result += template[index];
      index++;
    }
  }

  return result;
}
