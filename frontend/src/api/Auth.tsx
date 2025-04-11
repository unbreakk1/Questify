import apiClient from './ApiClient'; // Centralized Axios client

// Log in a user and return a JWT token
export const loginUser = async (username: string, password: string): Promise<string> =>
{
    try
    {
        const trimmedUsername = username.trim();
        const response = await apiClient.post('/auth/login', {username: trimmedUsername, password});
        const {token} = response.data;
        return token;
    }
    catch (error: unknown)
    {
        // Extract backend error message if it exists
        const errorMessage = (error instanceof Error && (error as { response?: { data?: { message?: string } } }).response?.data?.message) || 'Login failed. Please check your credentials.';
        throw new Error(errorMessage);
    }
};


// Register a new user and return a success message
export const registerUser = async (username: string, email: string, password: string): Promise<string> =>
{
    const response = await apiClient.post('/auth/register', {username, email, password});
    return response.data || 'Registration successful!'; // Return a success message
};
