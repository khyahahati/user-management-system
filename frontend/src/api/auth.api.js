import apiClient from '../utils/axios';

export const login = (credentials) => apiClient.post('/auth/login', credentials);

export const signup = (payload) => apiClient.post('/auth/signup', payload);

export const getCurrentUser = () => apiClient.get('/auth/me');
