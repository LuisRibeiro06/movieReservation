package com.movie.system.service;

import com.movie.system.model.Reservation;
import com.movie.system.model.ReservationStatus;
import com.movie.system.repository.ReservationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationCleanupService {

    private final ReservationRepository reservationRepository;

    public ReservationCleanupService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> expiredReservations = reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() == ReservationStatus.PENDING)
                .filter(r -> r.getExpiresAt() != null && r.getExpiresAt().isBefore(now))
                .toList();

        for (Reservation r : expiredReservations) {
            r.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(r);
            System.out.println(">>> Reserva expirada cancelada: ID " + r.getId() + ". Lugares libertados!");
        }
    }
}