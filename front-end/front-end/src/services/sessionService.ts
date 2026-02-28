import api from './api';
import type { Session } from '../types';

export const getSessions = async (): Promise<Session[]> => {
    const response = await api.get('/showtimes');
    return response.data;
};

export const getSessionById = async (id: number): Promise<Session> => {
    const response = await api.get(`/showtimes/${id}`);
    return response.data;
}

export const getSessionsByMovieId = async (id: number): Promise<Session[]> => {
    const response = await api.get(`/showtimes/movie/${id}`);
    return response.data;
}

export const createSession = async (session: Omit<Session, 'id' | 'movieTitle' | 'roomName'>): Promise<Session> => {
    const response = await api.post('/showtimes', session);
    return response.data;
};

export const updateSession = async (id: number, session: Omit<Session, 'id' | 'movieTitle' | 'roomName'>): Promise<Session> => {
    const response = await api.put(`/showtimes/${id}`, session);
    return response.data;
};

export const deleteSession = async (id: number): Promise<void> => {
    await api.delete(`/showtimes/${id}`);
};
