package com.movie.system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movie.system.dto.ReservationRequestDTO;
import com.movie.system.exception.reservation.SeatAlreadyReservedException;
import com.movie.system.model.Reservation;
import com.movie.system.model.ReservationStatus;
import com.movie.system.model.Seat;
import com.movie.system.service.ReservationService;
import com.movie.system.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
@WithMockUser(username = "testuser", roles = "USER")
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ReservationService reservationService;

    @MockitoBean
    private TokenService tokenService;

    private Reservation reservation;
    private ReservationRequestDTO reservationRequestDTO;
    private Seat seat;

    @BeforeEach
    void setUp() {
        seat = new Seat();
        seat.setId(1L);

        reservation = new Reservation();
        reservation.setId(1L);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setTotalPrice(BigDecimal.valueOf(10.0));

        reservationRequestDTO = new ReservationRequestDTO();
        reservationRequestDTO.setShowTimeId(1L);
        reservationRequestDTO.setSeatIds(Collections.singletonList(1L));
    }

    @Test
    void testCreateReservation_Success() throws Exception {
        when(reservationService.createReservation(any())).thenReturn(reservation);

        mockMvc.perform(post("/api/reservations").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservationRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void testCreateReservation_WhenSeatIsAlreadyReserved_ShouldThrowSeatAlreadyReservedException() throws Exception {
        when(reservationService.createReservation(any())).thenThrow(new SeatAlreadyReservedException("Seat already reserved"));

        mockMvc.perform(post("/api/reservations").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservationRequestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testConfirmPayment_Success() throws Exception {
        reservation.setStatus(ReservationStatus.CONFIRMED);
        when(reservationService.confirmPayment(1L)).thenReturn(reservation);

        mockMvc.perform(post("/api/reservations/1/checkout").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void testGetOccupiedSeats_ShouldReturnCorrectSeats() throws Exception {
        when(reservationService.getOccupiedSeatsByShowTime(1L)).thenReturn(Collections.singletonList(seat));

        mockMvc.perform(get("/api/reservations/occupied/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(1L));
    }
}
