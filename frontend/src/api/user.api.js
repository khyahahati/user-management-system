import apiClient from '../utils/axios';

export const updateProfile = (payload) => apiClient.put('/users/me', payload);

export const changePassword = (payload) => apiClient.put('/users/me/password', payload);
