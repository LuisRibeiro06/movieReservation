import api from './api';
import type { User } from '../types';

export const getUserProfile = async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
};
