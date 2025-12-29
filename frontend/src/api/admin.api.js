import apiClient from '../utils/axios';

export const getUsers = (params) => apiClient.get('/admin/users', { params });

export const activateUser = (userId) => apiClient.patch(`/admin/users/${userId}/activate`);

export const deactivateUser = (userId) => apiClient.patch(`/admin/users/${userId}/deactivate`);
