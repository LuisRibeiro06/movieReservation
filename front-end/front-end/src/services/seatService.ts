import api from './api';
import type {SeatAvailability} from "../types";

export const getSeatsForShowTime = async (showTimeId: number): Promise<SeatAvailability[]> => {
    const response = await api.get(`/seats/availability`, {
        params: { showTimeId }
    });
    return response.data;

}