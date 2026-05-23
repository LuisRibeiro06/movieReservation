package com.movie.system.exception.reservation;

public class ReservationExpiredException extends RuntimeException {
    public ReservationExpiredException(String message) {
        super(message);
    }
}
