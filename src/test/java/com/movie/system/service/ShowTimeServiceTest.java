package com.movie.system.service;

import com.movie.system.dto.ShowTimeDTO;
import com.movie.system.exception.movie.MovieNotFoundException;
import com.movie.system.exception.session.SessionNotFoundException;
import com.movie.system.model.CinemaRoom;
import com.movie.system.model.Movie;
import com.movie.system.model.ShowTime;
import com.movie.system.repository.CinemaRoomRepository;
import com.movie.system.repository.MovieRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShowTimeServiceTest {

    @Mock
    private ShowTimeRepository showTimeRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private CinemaRoomRepository cinemaRoomRepository;

    @InjectMocks
    private ShowTimeService showTimeService;

    private ShowTime showTime;
    private ShowTimeDTO showTimeDTO;
    private Movie movie;
    private CinemaRoom cinemaRoom;

    @BeforeEach
    void setUp() {
        movie = new Movie();
        movie.setId(1L);

        cinemaRoom = new CinemaRoom();
        cinemaRoom.setId(1L);

        showTime = new ShowTime();
        showTime.setId(1L);
        showTime.setMovie(movie);
        showTime.setCinemaRoom(cinemaRoom);
        showTime.setDate(LocalDateTime.now());

        showTimeDTO = new ShowTimeDTO();
        showTimeDTO.setMovieId(1L);
        showTimeDTO.setCinemaRoomId(1L);
        showTimeDTO.setDate(LocalDateTime.now());
    }

    @Test
    void testCreateShowTime_Success() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(cinemaRoomRepository.findById(1L)).thenReturn(Optional.of(cinemaRoom));
        when(showTimeRepository.save(any(ShowTime.class))).thenReturn(showTime);

        ShowTime createdShowTime = showTimeService.saveShowTime(showTimeDTO);

        assertNotNull(createdShowTime);
        verify(showTimeRepository, times(1)).save(any(ShowTime.class));
    }

    @Test
    void testCreateShowTime_WhenMovieNotFound_ShouldThrowException() {
        when(movieRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(MovieNotFoundException.class, () -> {
            showTimeService.saveShowTime(showTimeDTO);
        });
    }

    @Test
    void testUpdateShowTime_Success() {
        when(showTimeRepository.findById(1L)).thenReturn(Optional.of(showTime));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(cinemaRoomRepository.findById(1L)).thenReturn(Optional.of(cinemaRoom));
        when(showTimeRepository.save(any(ShowTime.class))).thenReturn(showTime);

        ShowTime updatedShowTime = showTimeService.updateShowTime(1L, showTimeDTO);

        assertNotNull(updatedShowTime);
        verify(showTimeRepository, times(1)).save(any(ShowTime.class));
    }

    @Test
    void testUpdateShowTime_WhenSessionNotFound_ShouldThrowException() {
        when(showTimeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(SessionNotFoundException.class, () -> {
            showTimeService.updateShowTime(1L, showTimeDTO);
        });
    }

    @Test
    void testDeleteShowTime_Success() {
        when(showTimeRepository.existsById(1L)).thenReturn(true);
        doNothing().when(showTimeRepository).deleteById(1L);

        assertDoesNotThrow(() -> showTimeService.deleteShowTime(1L));

        verify(showTimeRepository, times(1)).deleteById(1L);
    }
}
