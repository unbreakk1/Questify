import axios, {AxiosError} from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/auth', // Base URL for the authentication APIs
    headers: {
        'Content-Type': 'application/json', // Backend expects URL-encoded form data
    },
    timeout: 5000, // Timeout after 5 seconds
});

const handleError = (error: AxiosError): void =>
{
    if (error.response)
    {
        // Backend responded with an error status
        console.error(`[API Error ${error.response.status}]: ${error.response.data}`);
    } else if (error.request)
    {
        // Request was sent but no response received
        console.error('[API Error]: No response received from the server.', error.request);
    } else
    {
        // Something went wrong in setting up the request
        console.error('[API Error]:', error.message);
    }
};

// Login user and return a JWT token
export const loginUser = async (username: string, password: string): Promise<string> =>
{
    try
    {
        const response = await apiClient.post(
            '/login',
            {username, password}, // Send JSON data directly
            {
                headers: {
                    'Content-Type': 'application/json', // Explicitly set JSON content type
                },
            }
        );

        // Extract token from backend response
        const {token} = response.data;
        return token; // Return the JWT token
    } catch (error)
    {
        handleError(error as AxiosError);
        throw error;
    }
};

// Register a new user and return a success message
export const registerUser = async (username: string, password: string): Promise<string> =>
{
    try
    {
        const response = await apiClient.post(
            '/register',
            {username, password}, // Send JSON data directly
            {
                headers: {
                    'Content-Type': 'application/json', // Explicitly set JSON content type
                },
            }
        );

        // Return a success message
        return response.data || 'Registration successful!';
    } catch (error)
    {
        handleError(error as AxiosError);
        throw error;
    }

};