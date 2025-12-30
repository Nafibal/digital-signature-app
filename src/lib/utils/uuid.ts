/**
 * UUID Validation Utilities
 */

/**
 * Simple UUID validation regex
 * Matches standard UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID
 * @param value - The string to validate
 * @returns true if the value is a valid UUID, false otherwise
 */
export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Validates if a string is a valid UUID and throws an error if not
 * @param value - The string to validate
 * @param paramName - The name of the parameter (for error message)
 * @throws Error if the value is not a valid UUID
 */
export function requireValidUuid(value: string, paramName: string): void {
  if (!isValidUuid(value)) {
    throw new Error(`Invalid ${paramName} format: expected UUID`);
  }
}
