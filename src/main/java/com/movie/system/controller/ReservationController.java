package com.movie.system.controller;

import com.movie.system.dto.AdminDashboardDTO;
import com.movie.system.dto.ReservationRequestDTO;
import com.movie.system.model.Reservation;
import com.movie.system.model.Seat;
import com.movie.system.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboard() {
        return ResponseEntity.ok(reservationService.getAdminDashboardData());
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long reservationId) {
        System.out.println("Reservation ID: " + reservationId);
        return ResponseEntity.ok(reservationService.getReservationById(reservationId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Reservation>> getAllUserReservations() {
        return ResponseEntity.ok(reservationService.getAllUserReservations());
    }

    @GetMapping("/occupied/{showTimeId}")
    public ResponseEntity<List<Long>> getOccupiedSeats(@PathVariable Long showTimeId) {
        List<Seat> occupiedSeats = reservationService.getOccupiedSeatsByShowTime(showTimeId);
        List<Long> occupiedIds = occupiedSeats.stream().map(Seat::getId).toList();
        return ResponseEntity.ok(occupiedIds);
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody ReservationRequestDTO request) {
        Reservation reservation = reservationService.createReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @DeleteMapping("/{reservationId}/user/{userId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long reservationId) {
        reservationService.cancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reservationId}/checkout")
    public ResponseEntity<Reservation> checkout(@PathVariable Long reservationId) {
        Reservation confirmedReservation = reservationService.confirmPayment(reservationId);
        return ResponseEntity.ok(confirmedReservation);
    }
}
