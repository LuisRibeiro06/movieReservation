package com.movie.system.exception.cinema_room;

public class CinemaRoomIsNotEmptyException extends RuntimeException {
    public CinemaRoomIsNotEmptyException(String message) {
        super(message);
    }
}
