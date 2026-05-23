package com.movie.system.service;

import com.movie.system.client.ImdbClient;
import com.movie.system.client.MovieClient;
import com.movie.system.dto.movieAPI.ImdbVideoApiResponse;
import com.movie.system.dto.movieAPI.OmdbMovieDetail;
import com.movie.system.exception.movie.DuplicateMovieException;
import com.movie.system.exception.movie.MovieNotFoundException;
import com.movie.system.model.Movie;
import com.movie.system.repository.MovieRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private ShowTimeRepository showTimeRepository;

    @Mock
    private MovieClient movieClient;

    @Mock
    private ImdbClient imdbClient;

    @InjectMocks
    private MovieService movieService;

    private Movie movie;
    private OmdbMovieDetail omdbMovieDetail;
    private ImdbVideoApiResponse imdbVideoApiResponse;

    @BeforeEach
    void setUp() {
        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Inception");
        movie.setImdbId("tt1375666");

        omdbMovieDetail = new OmdbMovieDetail();
        omdbMovieDetail.setTitle("Inception");
        omdbMovieDetail.setImdbID("tt1375666");
        omdbMovieDetail.setGenre("Sci-Fi");
        omdbMovieDetail.setRuntime("148 min");
        omdbMovieDetail.setPlot("A thief who steals corporate secrets through the use of dream-sharing technology...");
        omdbMovieDetail.setPoster("http://example.com/poster.jpg");
        omdbMovieDetail.setResponse("True");

        imdbVideoApiResponse = new ImdbVideoApiResponse(Collections.emptyList(), 0);
    }

    @Test
    void testSaveMovie_Success() {
        when(movieRepository.existsByImdbId(anyString())).thenReturn(false);
        when(movieClient.getMovieDetails(anyString(), any())).thenReturn(omdbMovieDetail);
        when(imdbClient.getMovieVideos(anyString())).thenReturn(imdbVideoApiResponse);
        when(movieRepository.save(any(Movie.class))).thenReturn(movie);

        Movie savedMovie = movieService.saveMovie("tt1375666");

        assertNotNull(savedMovie);
        assertEquals("Inception", savedMovie.getTitle());
        verify(movieRepository, times(1)).save(any(Movie.class));
    }

    @Test
    void testSaveMovie_WhenMovieAlreadyExists_ShouldThrowDuplicateMovieException() {
        when(movieRepository.existsByImdbId(anyString())).thenReturn(true);

        assertThrows(DuplicateMovieException.class, () -> {
            movieService.saveMovie("tt1375666");
        });

        verify(movieClient, never()).getMovieDetails(any(), anyString());
        verify(movieRepository, never()).save(any());
    }

    @Test
    void testDeleteMovie_Success() {
        when(movieRepository.existsById(1L)).thenReturn(true);
        doNothing().when(showTimeRepository).deleteAll(any());
        doNothing().when(movieRepository).deleteById(1L);

        assertDoesNotThrow(() -> movieService.deleteMovie(1L));

        verify(movieRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteMovie_WhenMovieNotFound_ShouldThrowMovieNotFoundException() {
        when(movieRepository.existsById(1L)).thenReturn(false);

        assertThrows(MovieNotFoundException.class, () -> {
            movieService.deleteMovie(1L);
        });

        verify(movieRepository, never()).deleteById(any());
    }
}
