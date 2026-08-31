// src/utils/jwt.ts
import { jwtDecode } from "jwt-decode";

export interface IJwtPayload {
  exp: number;
  sub: string;
  jti: string;
  [key: string]: unknown;
}

/**
 * Get token expiry from JWT
 * @param token - JWT token string
 * @returns Expiry timestamp in milliseconds, or null if invalid
 */
export const getTokenExpiry = (token: string): number | null => {
  try {
    const decoded = jwtDecode<IJwtPayload>(token);
    // JWT exp is in seconds, convert to milliseconds
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid
 */
export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return Date.now() > expiry;
};

/**
 * Get time until token expires in seconds
 * @param token - JWT token string
 * @returns Seconds until expiry, or null if invalid
 */
export const getTokenExpirySeconds = (token: string): number | null => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return null;
  return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
};

/**
 * Check if token is valid (not expired and has required fields)
 * @param token - JWT token string
 * @returns true if token is valid
 */
export const isValidToken = (token: string): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<IJwtPayload>(token);
    // Check if token has required fields
    if (!decoded.exp || !decoded.sub) return false;
    // Check if not expired
    return Date.now() < decoded.exp * 1000;
  } catch {
    return false;
  }
};
