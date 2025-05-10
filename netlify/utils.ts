/**
 * Converts a camelCase string to snake_case
 * @param camelCase - The camelCase string to convert
 * @returns The snake_case representation of the input string
 */
function camelToSnake(camelCase: string): string {
  return camelCase.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}
