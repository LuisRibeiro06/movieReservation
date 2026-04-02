package com.movie.system.repository;

import com.movie.system.model.Reservation;
import com.movie.system.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
            "JOIN r.seats s " +
            "WHERE r.showTime.id = :showTimeId " +
            "AND s.id IN :seatIds " +
            "AND r.status <> 'CANCELLED'")
    boolean existsByShowTimeAndSeats(@Param("showTimeId") Long showTimeId, @Param("seatIds") List<Long> seatIds
    );


    @Query("SELECT s FROM Reservation r " +
            "JOIN r.seats s " +
            "WHERE r.showTime.id = :showTimeId " +
            "AND r.status <> 'CANCELLED'")
    List<Seat> findOccupiedSeatsByShowTime(@Param("showTimeId") Long showTimeId);

    @Query("SELECT r FROM Reservation r WHERE r.status = 'PENDING' AND r.expiresAt < :now")
    List<Reservation> findExpiredPendingReservations(@Param("now") LocalDateTime now);

    List<Reservation> findByUser_Id(Long userId);
}
