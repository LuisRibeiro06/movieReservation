import api from './api';
import type {AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO} from '../types';

export const login = async (credentials: LoginRequestDTO): Promise<AuthResponseDTO> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userInfo: RegisterRequestDTO) => {
    const response = await api.post('/auth/register', userInfo);
    return response.data;
};