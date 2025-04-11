import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Base URL for all API calls
    headers: {
        'Content-Type': 'application/json', // Default content type
    },
    timeout: 10000, // Set a timeout for requests (e.g., 10 seconds)
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
    (config) =>
    {
        const token = localStorage.getItem('token'); // Get the token
        // Only include the token for requests that aren't login or register
        if (token && !['/auth/login', '/auth/register'].some((url) => config.url?.includes(url))) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>
    {
        console.error('[ApiClient] Request error:', error);
        return Promise.reject(error);
    }
);


// Add a response interceptor for global error handling (optional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) =>
    {
        if (error.response)
        {
            console.error(`[ApiClient] Response error ${error.response.status}:`, error.response.data);
        }
        else
        {
            console.error('[ApiClient] No response from server:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;