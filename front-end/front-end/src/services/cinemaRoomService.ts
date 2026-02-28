import api from './api';
import type { CinemaRoom } from '../types';

export const getAllCinemaRooms = async (): Promise<CinemaRoom[]> => {
    const response = await api.get('/cinema-rooms');
    return response.data;
};

export const getCinemaRoomById = async (id: number): Promise<CinemaRoom> => {
    const response = await api.get(`/cinema-rooms/${id}`);
    return response.data;
};

export const createCinemaRoom = async (cinemaRoom: Omit<CinemaRoom, 'id'>): Promise<CinemaRoom> => {
    const response = await api.post('/cinema-rooms', cinemaRoom);
    return response.data;
};

export const deleteCinemaRoom = async (id: number): Promise<void> => {
    await api.delete(`/cinema-rooms/${id}`);
};
