import apiClient, { buildApiUrl } from '../utils/axios';

export const getProfile = () => apiClient.get(buildApiUrl('/users/me'));

export const updateProfile = (payload) => apiClient.put(buildApiUrl('/users/me'), payload);

export const changePassword = (payload) => apiClient.put(buildApiUrl('/users/me/password'), payload);
