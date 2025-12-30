import apiClient, { API_BASE_URL } from '../utils/axios';

export const getUsers = (params) => apiClient.get(`${API_BASE_URL}/admin/users`, { params });

export const activateUser = (userId) => apiClient.patch(`${API_BASE_URL}/admin/users/${userId}/activate`);

export const deactivateUser = (userId) => apiClient.patch(`${API_BASE_URL}/admin/users/${userId}/deactivate`);
