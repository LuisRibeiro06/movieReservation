package com.movie.system.service;

import com.movie.system.dto.CreateCinemaRoomDTO;
import com.movie.system.exception.cinema_room.CinemaRoomIsNotEmptyException;
import com.movie.system.exception.cinema_room.CinemaRoomNotFound;
import com.movie.system.model.CinemaRoom;
import com.movie.system.model.ShowTime;
import com.movie.system.repository.CinemaRoomRepository;
import com.movie.system.repository.SeatRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CinemaRoomServiceTest {

    @Mock
    private CinemaRoomRepository cinemaRoomRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private ShowTimeRepository showTimeRepository;

    @InjectMocks
    private CinemaRoomService cinemaRoomService;

    private CinemaRoom cinemaRoom;
    private CinemaRoom cinemaRoom2;
    private ShowTime showTime;
    private CreateCinemaRoomDTO createCinemaRoomDTO;

    @BeforeEach
    void setUp() {
        cinemaRoom = new CinemaRoom();
        cinemaRoom.setId(1L);
        cinemaRoom.setName("Room 1");

        cinemaRoom2 = new CinemaRoom();
        cinemaRoom2.setId(2L);
        cinemaRoom2.setName("Room 2");

        showTime = new ShowTime();
        showTime.setCinemaRoom(cinemaRoom);

        createCinemaRoomDTO = new CreateCinemaRoomDTO("Room 1", 10, 10);
    }

    @Test
    void testCreateCinemaRoomAndSeats_Success() {
        when(cinemaRoomRepository.save(any(CinemaRoom.class))).thenReturn(cinemaRoom);

        CinemaRoom createdRoom = cinemaRoomService.createCinemaRoomAndSeats(createCinemaRoomDTO);

        assertNotNull(createdRoom);
        assertEquals("Room 1", createdRoom.getName());
        verify(seatRepository, times(1)).saveAll(any());
    }

    @Test
    void testDeleteCinemaRoom_Success() {
        when(cinemaRoomRepository.findById(2L)).thenReturn(Optional.of(cinemaRoom2));
        when(showTimeRepository.findByCinemaRoom(cinemaRoom2)).thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> cinemaRoomService.deleteCinemaRoom(2L));

        verify(cinemaRoomRepository, times(1)).delete(cinemaRoom2);
    }

    @Test
    void testDeleteCinemaRoom_WhenRoomHasShowTimes_ShouldThrowCinemaRoomIsNotEmptyException() {
        when(cinemaRoomRepository.findById(1L)).thenReturn(Optional.of(cinemaRoom));
        when(showTimeRepository.findByCinemaRoom(cinemaRoom)).thenReturn(Collections.singletonList(showTime));

        assertThrows(CinemaRoomIsNotEmptyException.class, () -> {
            cinemaRoomService.deleteCinemaRoom(1L);
        });

        verify(cinemaRoomRepository, never()).delete(any());
    }

    @Test
    void testDeleteCinemaRoom_WhenRoomNotFound_ShouldThrowCinemaRoomNotFoundException() {
        when(cinemaRoomRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CinemaRoomNotFound.class, () -> {
            cinemaRoomService.deleteCinemaRoom(1L);
        });

        verify(cinemaRoomRepository, never()).delete(any());
    }
}
