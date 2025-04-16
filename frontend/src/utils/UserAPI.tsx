import apiClient from '../api/ApiClient';
import { decodeToken } from 'react-jwt';

/**
 * Extract the username from the user's JWT token.
 * @returns The username if available, null otherwise.
 */
export const getUsernameFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = decodeToken<{ sub?: string }>(token);
    return decoded?.sub || null; // Assuming `sub` contains the username.
};

/**
 * Fetch complete user information using their username.
 * Data includes level, XP, gold, badges, etc.
 * @param username The user's unique identifier (retrieved from JWT token).
 * @returns The user's complete information.
 */
export const getUserInfo = async (username: string) => {
    const response = await apiClient.get(`/api/users/info/${username}`);
    return response.data; // Includes { username, level, gold, xp, badges, ... }
};