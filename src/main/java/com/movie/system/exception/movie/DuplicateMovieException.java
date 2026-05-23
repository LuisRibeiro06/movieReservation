package com.movie.system.exception.movie;

public class DuplicateMovieException extends RuntimeException {
    public DuplicateMovieException(String message) {
        super(message);
    }
}
