import apiClient, { API_BASE_URL } from '../utils/axios';

export const login = (credentials) => apiClient.post(`${API_BASE_URL}/auth/login`, credentials);

export const signup = (payload) => apiClient.post(`${API_BASE_URL}/auth/signup`, payload);

export const getCurrentUser = () => apiClient.get(`${API_BASE_URL}/auth/me`);
