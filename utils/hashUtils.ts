import { randomBytes } from "crypto";

/**
 * Generate a random hash for share links
 * @param length - Length of the hash (default: 10)
 * @returns Random hex string
 */

/**
 * Generate a secure random hash with timestamp
 * @returns Unique hash with timestamp prefix
 */
export const generateUniqueHash = (): string => {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString("hex");
  return `${timestamp}-${random}`;
};

import crypto from "crypto";

export function generateShareHash(): string {
  return crypto.randomBytes(6).toString("hex");
}
