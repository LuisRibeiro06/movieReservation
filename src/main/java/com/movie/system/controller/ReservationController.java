package com.movie.system.controller;

import com.movie.system.dto.AdminDashboardDTO;
import com.movie.system.dto.ReservationRequestDTO;
import com.movie.system.model.Reservation;
import com.movie.system.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getAllUserReservations(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getAllUserReservations(userId));
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequestDTO request) {
        Reservation reservation = reservationService.createReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @DeleteMapping("/{reservationId}/user/{userId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long reservationId, @PathVariable Long userId) {
        reservationService.cancelReservation(reservationId, userId);
        return ResponseEntity.noContent().build();
    }
}
