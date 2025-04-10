import apiClient from './ApiClient'; // Centralized Axios client

// Log in a user and return a JWT token
export const loginUser = async (username: string, password: string): Promise<string> =>
{
    const response = await apiClient.post('/auth/login', {username, password});
    const {token} = response.data; // Extract token from response
    return token; // Return the JWT token
};

// Register a new user and return a success message
export const registerUser = async (username: string, email: string, password: string): Promise<string> =>
{
    const response = await apiClient.post('/auth/register', {username, email, password});
    return response.data || 'Registration successful!'; // Return a success message
};
