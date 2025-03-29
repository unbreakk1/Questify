import axios, {AxiosError} from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/auth', // Base URL for the authentication APIs
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Backend expects URL-encoded form data
    },
    timeout: 5000, // Timeout after 5 seconds
});

// Login user and return a JWT token
export const loginUser = async (username: string, password: string): Promise<string> =>
{
    try
    {
        const response = await apiClient.post('/login', new URLSearchParams({username, password}));

        // Extract token from backend response
        const {token} = response.data;
        return token; // Return the JWT token
    }
    catch (error)
    {
        handleError(error as AxiosError); // Explicitly cast to AxiosError
        throw error; // Propagate the error for handling in the calling component
    }
};

// Register a new user and return success message
export const registerUser = async (username: string, password: string): Promise<string> =>
{
    try
    {
        const response = await apiClient.post('/register', new URLSearchParams({username, password}));

        // Return a success message
        return response.data || 'Registration successful!';
    }
    catch (error)
    {
        handleError(error as AxiosError); // Explicitly cast to AxiosError
        throw error; // Propagate the error back to the calling component
    }
};

// Centralized error handler for Axios errors
const handleError = (error: AxiosError): void =>
{
    if (error.response)
    {
        // Backend responded with an error status
        console.error(`[API Error ${error.response.status}]: ${error.response.data}`);
    }
    else if (error.request)
    {
        // Request was sent but no response received
        console.error('[API Error]: No response received from the server.', error.request);
    }
    else
    {
        // Something went wrong in setting up the request
        console.error('[API Error]:', error.message);
    }
};