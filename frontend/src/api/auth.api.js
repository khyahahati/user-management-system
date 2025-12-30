import apiClient, { buildApiUrl } from '../utils/axios';

export const login = (credentials) => apiClient.post(buildApiUrl('/auth/login'), credentials);

export const signup = (payload) => apiClient.post(buildApiUrl('/auth/signup'), payload);

export const getCurrentUser = () => apiClient.get(buildApiUrl('/auth/me'));
