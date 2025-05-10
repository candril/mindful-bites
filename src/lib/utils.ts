import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a camelCase string to snake_case
 * @param camelCase - The camelCase string to convert
 * @returns The snake_case representation of the input string
 */
export function camelToSnake(camelCase: string): string {
  return camelCase.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/**
 * Converts a snake_case string to camelCase
 * @param snakeCase - The snake_case string to convert
 * @returns The camelCase representation of the input string
 */
export function snakeToCamel(snakeCase: string): string {
  return snakeCase.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}
