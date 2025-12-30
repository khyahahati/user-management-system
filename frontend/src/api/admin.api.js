import apiClient, { buildApiUrl } from '../utils/axios';

export const getUsers = (params) => apiClient.get(buildApiUrl('/admin/users'), { params });

export const activateUser = (userId) => apiClient.patch(buildApiUrl(`/admin/users/${userId}/activate`));

export const deactivateUser = (userId) => apiClient.patch(buildApiUrl(`/admin/users/${userId}/deactivate`));
