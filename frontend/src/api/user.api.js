import apiClient, { API_BASE_URL } from '../utils/axios';

export const getProfile = () => apiClient.get(`${API_BASE_URL}/users/me`);

export const updateProfile = (payload) => apiClient.put(`${API_BASE_URL}/users/me`, payload);

export const changePassword = (payload) => apiClient.put(`${API_BASE_URL}/users/me/password`, payload);
