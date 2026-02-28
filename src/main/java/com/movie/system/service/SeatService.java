package com.movie.system.service;

import com.movie.system.dto.SeatAvailabilityDTO;
import com.movie.system.model.CinemaRoom;
import com.movie.system.model.Seat;
import com.movie.system.model.ShowTime;
import com.movie.system.repository.CinemaRoomRepository;
import com.movie.system.repository.ReservationRepository;
import com.movie.system.repository.SeatRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final ShowTimeRepository showTimeRepository;
    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;

    public SeatService(SeatRepository seatRepository, CinemaRoomRepository cinemaRoomRepository, ReservationRepository reservationRepository, ShowTimeRepository showTimeRepository) {
        this.seatRepository = seatRepository;
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.reservationRepository = reservationRepository;
        this.showTimeRepository = showTimeRepository;
        this.modelMapper = new ModelMapper();
    }

    public List<SeatAvailabilityDTO> getSeatsForShowTime(Long showTimeId){
        ShowTime showTime = showTimeRepository.findById(showTimeId)
                .orElseThrow(() -> new RuntimeException("ShowTime not found"));

        CinemaRoom cinemaRoom = showTime.getCinemaRoom();

        List<Seat> seats = seatRepository.findByRoom(cinemaRoom);

        List<Seat> reservatedSeats = reservationRepository.findOccupiedSeatsByShowTime(showTimeId);

        Set<Long> occupiedSeatIds = reservatedSeats.stream()
                .map(Seat::getId)
                .collect(Collectors.toSet());

        return seats.stream().map(seat -> {
            boolean isAvailable = !occupiedSeatIds.contains(seat.getId());
            SeatAvailabilityDTO dto = modelMapper.map(seat,SeatAvailabilityDTO.class);
            dto.setAvailable(isAvailable);
            return dto;
        }).collect(Collectors.toList());

    }


}
