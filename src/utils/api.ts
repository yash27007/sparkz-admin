import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000';
// export const API_BASE_URL = 'https://sparkz-backend-6kv6.onrender.com';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No JWT token found');
  }
  console.log('JWT',token)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // console.log(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

/**
 * Create an Axios instance with an interceptor to handle JWT authorization dynamically.
 */
export const axiosWithAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor to include the token in the header dynamically before each request
axiosWithAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  // Handle error if necessary
  return Promise.reject(error);
});