import {jwtDecode} from 'jwt-decode';

interface JwtPayload
{
    sub: string;   // User identifier (e.g., username)
    iat?: number;  // Issued at timestamp
    exp?: number;  // Expiration timestamp
}

/**
 * Decode a JWT token to extract payload.
 * @param token - JWT token string.
 * @returns JwtPayload or null if decoding fails.
 */
export const decodeToken = (token: string): JwtPayload | null =>
{
    try
    {
        return jwtDecode<JwtPayload>(token);
    } catch (error)
    {
        console.error('Failed to decode JWT token:', error);
        return null;
    }
};

/**
 * Check if a JWT token is expired.
 * @param token - JWT token string.
 * @returns True if expired, otherwise false.
 */
export const isTokenExpired = (token: string): boolean =>
{
    const decoded = decodeToken(token);
    if (decoded?.exp)
    {
        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        return decoded.exp < now;
    }
    return true; // Treat invalid/undecodable tokens as expired
};

/**
 * Safely retrieve and decode the stored token from local storage.
 * @returns Decoded token payload or null if the token is missing/invalid.
 */
export const getDecodedToken = (): JwtPayload | null =>
{
    const token = localStorage.getItem('token');
    if (!token) return null;
    return decodeToken(token);
};


