export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface RegisterRequestDTO {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    token: string;
}

export interface Movie {
    id: number;
    title: string;
    genre: string;
    duration: number;
    description: string;
    posterImage: string;
    imdbId: string;
}

export interface CinemaRoom {
    id: number;
    name: string;
    capacity: number;
}

export interface Session {
    id: number;
    movieId: number;
    movieTitle: string;
    cinemaRoomId: number;
    roomName: string;
    date: string;
    price: number;
}

export interface SeatAvailability {
    id: number;
    seatRow: string;
    seatNumber: number;
}

export interface Reservation {
    id: number;
    user: { id: number; username: string; };
    showTime: Session;
    seats: SeatAvailability[];
    reservationTime: string;
}

export interface ReservationRequest {
    showTimeId: number;
    seatIds: number[];
}

export interface OmdbSearchResult {
    Title: string;
    Year: string;
    imdbID: string;
    Poster: string;
}

export interface AdminDashboard {
    allReservations: Reservation[];
    totalReservations: number;
    totalRevenue: number;
}
