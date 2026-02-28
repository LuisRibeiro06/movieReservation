import api from './api';
import type { AdminDashboard, ReservationRequest } from '../types';

export const createReservation = async (reservationRequest: ReservationRequest) => {
    const response = await api.post('/reservations', reservationRequest);
    return response.data;
};

export const getOccupiedSeats = async (sessionId: number): Promise<number[]> => {
    const response = await api.get(`/reservations/occupied/${sessionId}`);
    return response.data;
}

export const cancelReservation = async (reservationId: number) => {
    await api.delete(`/reservations/${reservationId}`);
}

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
    const response = await api.get('/reservations/admin/dashboard');
    return response.data;
};
