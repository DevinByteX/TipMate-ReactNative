/**
 * Generates a unique ID using a timestamp and random alphanumeric suffix.
 * Format: `${timestamp}-${9-char random string}`
 */
export const generateId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
