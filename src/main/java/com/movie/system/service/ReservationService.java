package com.movie.system.service;

import com.movie.system.dto.AdminDashboardDTO;
import com.movie.system.dto.ReservationRequestDTO;
import com.movie.system.model.*;
import com.movie.system.repository.ReservationRepository;
import com.movie.system.repository.SeatRepository;
import com.movie.system.repository.ShowTimeRepository;
import com.movie.system.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final ShowTimeRepository showTimeRepository;

    public ReservationService(ReservationRepository reservationRepository, SeatRepository seatRepository, UserRepository userRepository, ShowTimeRepository showTimeRepository) {
        this.reservationRepository = reservationRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.showTimeRepository = showTimeRepository;
    }


    public List<Reservation> getAllUserReservations(Long userId){
        return reservationRepository.findByUser_Id(userId);
    }

    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long reservationId){
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    public AdminDashboardDTO getAdminDashboardData() {
        List<Reservation> allReservations = reservationRepository.findAll();
        long totalReservations = allReservations.size();
        BigDecimal totalRevenue = allReservations.stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .map(Reservation::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardDTO(allReservations, totalReservations, totalRevenue);
    }

    @Transactional
    public Reservation createReservation(ReservationRequestDTO request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ShowTime showTime = showTimeRepository.findById(request.getShowTimeId())
                .orElseThrow(() -> new RuntimeException("ShowTime not found"));


        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some seats not found");
        }

        boolean seatsInCorrectRoom = seats.stream().allMatch(seat -> seat.getRoom().getId().equals(showTime.getCinemaRoom().getId()));

        if (!seatsInCorrectRoom) {
            throw new RuntimeException("Some seats are not in the correct room");
        }

        boolean allSeatsAreOccupied = reservationRepository.existsByShowTimeAndSeats(request.getShowTimeId(), request.getSeatIds());

        if (allSeatsAreOccupied) {
            throw new RuntimeException("Some seats are already occupied");
        }

        BigDecimal totalPrice = showTime.getPrice().multiply(BigDecimal.valueOf(seats.size()));

        Reservation reservation = new Reservation();
        reservation.setShowTime(showTime);
        reservation.setUser(user);
        reservation.setSeats(seats);
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        return reservationRepository.save(reservation);
    }

    @Transactional
    public void cancelReservation(Long reservationId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("User is not the owner of this reservation");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation confirmPayment(Long reservationId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (!reservation.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Não autorizado");
        }

        if (reservation.getExpiresAt().isBefore(LocalDateTime.now()) || reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new RuntimeException("O tempo expirou. Os lugares foram libertados.");
        }

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            throw new RuntimeException("Esta reserva já foi paga.");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);

        return reservationRepository.save(reservation);
    }

    public List<Seat> getOccupiedSeatsByShowTime(Long showTimeId){
        showTimeRepository.findById(showTimeId)
                .orElseThrow(() -> new RuntimeException("ShowTime not found"));

        return reservationRepository.findOccupiedSeatsByShowTime(showTimeId);
    }

}
