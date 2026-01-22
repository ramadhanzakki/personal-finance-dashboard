import axios from 'axios';

/**
 * Parse error response from FastAPI backend
 * @param {Error} error - Axios error object
 * @returns {string} - Human-readable error message
 */
export const parseApiError = (error) => {
    // Check if it's an Axios error with a response
    if (error.response) {
        const { status, data } = error.response;

        // Handle validation errors (422 Unprocessable Entity)
        if (status === 422) {
            // FastAPI sends validation errors as an array in data.detail
            if (Array.isArray(data.detail)) {
                // Extract the first validation error message
                const firstError = data.detail[0];
                if (firstError?.msg) {
                    const field = firstError.loc?.slice(-1)[0] || 'field';
                    return `${field}: ${firstError.msg}`;
                }
            }
            return 'Please check your input fields.';
        }

        // Handle standard FastAPI error responses (string detail)
        if (typeof data.detail === 'string') {
            return data.detail; // e.g., "Email already registered"
        }

        // Handle other structured error responses
        if (data.message) {
            return data.message;
        }

        // Handle known HTTP status codes
        if (status === 401) return 'Invalid email or password.';
        if (status === 403) return 'You do not have permission to perform this action.';
        if (status === 404) return 'The requested resource was not found.';
        if (status === 500) return 'Server error. Please try again later.';
    }

    // Handle network errors (no response received)
    if (error.request) {
        return 'Network error. Please check your connection.';
    }

    // Fallback for unexpected errors
    return error.message || 'An unexpected error occurred.';
};

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - Clear token and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            // Optionally trigger a redirect or state update here
        }
        return Promise.reject(error);
    }
);

// ==================== Auth API Functions ====================

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 */
export const registerUser = async (email, password, fullName) => {
    const response = await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
    });
    return response.data;
};

/**
 * Login user and get access token
 * @param {string} email - User's email (sent as 'username' for OAuth2 compatibility)
 * @param {string} password - User's password
 */
export const loginUser = async (email, password) => {
    // OAuth2PasswordRequestForm expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

/**
 * Get current user's profile
 */
export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

/**
 * Logout user - Clear token from storage
 */
export const logout = () => {
    localStorage.removeItem('access_token');
};

// ==================== Transaction API Functions ====================

/**
 * Fetch all transactions for the authenticated user
 * @param {number} limit - Optional limit on number of transactions
 */
export const fetchTransactions = async (limit = null) => {
    const params = limit ? { limit } : {};
    const response = await api.get('/transactions/', { params });
    return response.data;
};

/**
 * Create a new transaction
 * @param {Object} data - Transaction data: { amount, category, type, date, note }
 */
export const addTransaction = async (data) => {
    const response = await api.post('/transactions/', data);
    return response.data;
};

/**
 * Delete a transaction by ID
 * @param {number} id - Transaction ID
 */
export const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
};

export default api;
