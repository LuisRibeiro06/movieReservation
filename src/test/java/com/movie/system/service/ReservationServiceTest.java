package com.movie.system.service;

import com.movie.system.dto.ReservationRequestDTO;
import com.movie.system.exception.reservation.ReservationNotFoundException;
import com.movie.system.exception.reservation.SeatAlreadyReservedException;
import com.movie.system.model.*;
import com.movie.system.repository.ReservationRepository;
import com.movie.system.repository.SeatRepository;
import com.movie.system.repository.ShowTimeRepository;
import com.movie.system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ShowTimeRepository showTimeRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ReservationService reservationService;

    private User user;
    private ShowTime showTime;
    private Seat seat;
    private CinemaRoom cinemaRoom;
    private ReservationRequestDTO reservationRequestDTO;
    private Reservation reservation;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        cinemaRoom = new CinemaRoom();
        cinemaRoom.setId(1L);

        showTime = new ShowTime();
        showTime.setId(1L);
        showTime.setCinemaRoom(cinemaRoom);
        showTime.setPrice(BigDecimal.valueOf(10.0));

        seat = new Seat();
        seat.setId(1L);
        seat.setRoom(cinemaRoom);

        reservationRequestDTO = new ReservationRequestDTO();
        reservationRequestDTO.setShowTimeId(1L);
        reservationRequestDTO.setSeatIds(Collections.singletonList(1L));

        reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUser(user);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setExpiresAt(LocalDateTime.now().plusMinutes(10));
    }

    @Test
    void testCreateReservation_Success() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(showTimeRepository.findById(1L)).thenReturn(Optional.of(showTime));
        when(seatRepository.findAllById(Collections.singletonList(1L))).thenReturn(Collections.singletonList(seat));
        when(reservationRepository.existsByShowTimeAndSeats(1L, Collections.singletonList(1L))).thenReturn(false);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        Reservation createdReservation = reservationService.createReservation(reservationRequestDTO);

        assertNotNull(createdReservation);
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }

    @Test
    void testCreateReservation_WhenSeatIsAlreadyReserved_ShouldThrowSeatAlreadyReservedException() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(showTimeRepository.findById(1L)).thenReturn(Optional.of(showTime));
        when(seatRepository.findAllById(Collections.singletonList(1L))).thenReturn(Collections.singletonList(seat));
        when(reservationRepository.existsByShowTimeAndSeats(1L, Collections.singletonList(1L))).thenReturn(true);

        assertThrows(SeatAlreadyReservedException.class, () -> {
            reservationService.createReservation(reservationRequestDTO);
        });

        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    void testConfirmPayment_Success() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        Reservation confirmedReservation = reservationService.confirmPayment(1L);

        assertEquals(ReservationStatus.CONFIRMED, confirmedReservation.getStatus());
        verify(reservationRepository, times(1)).save(reservation);
    }

    @Test
    void testConfirmPayment_WhenReservationNotFound_ShouldThrowException() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ReservationNotFoundException.class, () -> {
            reservationService.confirmPayment(1L);
        });
    }
}
