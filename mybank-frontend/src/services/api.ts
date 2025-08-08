// src/services/api.ts
import axios from 'axios';

// Base API Configuration - works for both Docker and native setups
const API_BASE_URL = import.meta.env.PROD
  ? '/api'  // In production, Nginx proxies /api to backend
  : 'http://localhost:8000/api';  // Development with Docker backend

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'mybank_token';
const USER_KEY = 'mybank_user';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Initialize token from localStorage on app start
const token = getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn('Authentication failed, clearing tokens');
      removeToken();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TypeScript interfaces
export interface Category {
  id?: number;
  title: string;
  user?: User;
}

export interface Operation {
  id?: number;
  label: string;
  amount: number;
  date: string;
  category: Category;
  user?: User;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// === OPERATION API ===

// Fetch all operations
export const getOperations = async (): Promise<Operation[]> => {
  const response = await api.get('/operations');
  // Handle JSON-LD collection format - extract from hydra:member array
  if (response.data && Array.isArray(response.data['hydra:member'])) {
    return response.data['hydra:member'];
  }
  // Fallback for simple array format
  return Array.isArray(response.data) ? response.data : [];
};

// Fetch a single operation by ID
export const getOperationById = async (id: number): Promise<Operation> => {
  const response = await api.get(`/operations/${id}`);
  return response.data;
};

// Create a new operation
export const createOperation = async (operation: {
  label: string;
  amount: number;
  date: string;
  category: number; // Category ID
}) => {
  // Normalize date to ISO 8601 format for API Platform datetime field
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(operation.date)
    ? `${operation.date}T00:00:00+00:00`
    : operation.date;
  
  // Convert to API Platform format
  const apiPlatformData = {
    label: operation.label,
    amount: operation.amount,
    date: normalizedDate,
    category: `/api/categories/${operation.category}` // IRI format for API Platform
  };
  
  console.log('API Debug - Sending API Platform data:', apiPlatformData);
  const response = await api.post('/operations', apiPlatformData, {
    headers: {
      'Content-Type': 'application/ld+json', // API Platform prefers JSON-LD
    },
  });
  return response.data;
};

// Update an operation
export const updateOperation = async (
  id: number,
  operation: {
    label?: string;
    amount?: number;
    date?: string;
    category?: number; // Category ID
  }
) => {
  const response = await api.put(`/operations/${id}`, operation);
  return response.data;
};

// Delete an operation
export const deleteOperation = async (id: number) => {
  const response = await api.delete(`/operations/${id}`);
  return response.data;
};

// === CATEGORY API ===

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('API Debug - Fetching categories from:', `${API_BASE_URL}/categories`);
    const response = await api.get('/categories');
    console.log('API Debug - Categories response:', response.data);
    console.log('API Debug - Response keys:', Object.keys(response.data || {}));
    
    // Handle JSON-LD collection format - extract from member array
    if (response.data && Array.isArray(response.data['member'])) {
      console.log('API Debug - Found member with', response.data['member'].length, 'categories');
      return response.data['member'];
    }
    // Fallback for simple array format
    if (Array.isArray(response.data)) {
      console.log('API Debug - Found simple array with', response.data.length, 'categories');
      return response.data;
    }
    console.log('API Debug - No categories found, returning empty array');
    return [];
  } catch (error) {
    console.error('API Debug - Categories fetch failed:', error);
    return [];
  }
};

// Fetch a single category by ID
export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create a new category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const response = await api.post('/categories', category);
  return response.data;
};

// Update a category
export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

// Delete a category
export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

// Authentication API functions
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  const authData = response.data;
  
  // Store token and user data
  setToken(authData.token);
  setCurrentUser(authData.user);
  
  return authData;
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData);
  const authData = response.data;
  
  // Store token and user data
  setToken(authData.token);
  setCurrentUser(authData.user);
  
  return authData;
};

export const logout = (): void => {
  removeToken();
};

export const getCurrentUserProfile = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

export const refreshToken = async (): Promise<string> => {
  const response = await api.post('/auth/refresh');
  const newToken = response.data.token;
  setToken(newToken);
  return newToken;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const token = getToken();
    const user = getCurrentUser();
    return token !== null && user !== null;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

export default api;