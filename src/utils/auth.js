/**
 * Global authentication fetch helper
 * Provides a standardized way to make authenticated API calls
 * Handles 401 (unauthorized) by logging out and redirecting
 * Handles 403 (forbidden) by throwing an error without logging out
 * 
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - Fetch response promise
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token")?.trim();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Always add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${localStorage.getItem("token")?.trim()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401: Token expired or invalid → logout and redirect
  if (response.status === 401) {
    // Clear authentication data
    localStorage.clear();
    
    // Show alert and redirect
    alert('Session expired. Please login again.');
    window.location.href = '/';
    
    // Return the response so calling code can handle it if needed
    return response;
  }

  // Handle 403: Forbidden → DO NOT LOGOUT, just throw error
  if (response.status === 403) {
    throw new Error('Forbidden');
  }

  return response;
};

/**
 * Base API URL constant
 */
export const API_BASE_URL = 'http://localhost:80';
