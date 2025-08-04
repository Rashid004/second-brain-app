import { randomBytes } from "crypto";

/**
 * Generate a random hash for share links
 * @param length - Length of the hash (default: 10)
 * @returns Random hex string
 */
export const generateShareHash = (length: number = 10): string => {
  return randomBytes(length).toString("hex");
};

/**
 * Generate a secure random hash with timestamp
 * @returns Unique hash with timestamp prefix
 */
export const generateUniqueHash = (): string => {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString("hex");
  return `${timestamp}-${random}`;
};