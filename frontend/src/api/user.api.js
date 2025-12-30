import apiClient from '../utils/axios';

export const getProfile = () => apiClient.get('/users/me');

export const updateProfile = (payload) => apiClient.put('/users/me', payload);

export const changePassword = (payload) => apiClient.put('/users/me/password', payload);
