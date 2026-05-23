package com.movie.system.service;

import com.movie.system.dto.CreateCinemaRoomDTO;
import com.movie.system.exception.cinema_room.CinemaRoomIsNotEmptyException;
import com.movie.system.exception.cinema_room.CinemaRoomNotFound;
import com.movie.system.model.CinemaRoom;
import com.movie.system.model.Seat;
import com.movie.system.model.ShowTime;
import com.movie.system.repository.CinemaRoomRepository;
import com.movie.system.repository.SeatRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CinemaRoomService {

    private final CinemaRoomRepository cinemaRoomRepository;
    private final SeatRepository seatRepository;
    private final ShowTimeRepository showTimeRepository;

    public CinemaRoomService(CinemaRoomRepository cinemaRoomRepository, SeatRepository seatRepository, ShowTimeRepository showTimeRepository) {
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.seatRepository = seatRepository;
        this.showTimeRepository = showTimeRepository;
    }


    public List<CinemaRoom> getAllCinemaRooms(){
        return cinemaRoomRepository.findAll();
    }

    public CinemaRoom getCinemaRoomById(Long id){
        return cinemaRoomRepository.findById(id)
                .orElseThrow(() -> new CinemaRoomNotFound("Cinema room not found"));
    }

    public CinemaRoom createCinemaRoomAndSeats(CreateCinemaRoomDTO cinemaRoomDTO){
        CinemaRoom cinemaRoom = new CinemaRoom();
        cinemaRoom.setName(cinemaRoomDTO.getName());
        cinemaRoom.setCapacity(cinemaRoomDTO.getNumberOfRows() * cinemaRoomDTO.getSeatsPerRow());
        cinemaRoom = cinemaRoomRepository.save(cinemaRoom);

        List<Seat> seats = new ArrayList<>();

        for (int row = 0; row < cinemaRoomDTO.getNumberOfRows(); row++) {
            for (int seatNum = 1; seatNum <= cinemaRoomDTO.getSeatsPerRow(); seatNum++) {
                Seat seat = new Seat();
                char rowLetter = (char) ('A' + row);
                seat.setSeatRow(String.valueOf(rowLetter));
                seat.setSeatNumber(seatNum);
                seat.setRoom(cinemaRoom);
                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);

        return cinemaRoom;
    }

    @Transactional
    public void deleteCinemaRoom(Long id) {
        CinemaRoom cinemaRoom = cinemaRoomRepository.findById(id)
                .orElseThrow(() -> new CinemaRoomNotFound("Cinema room not found"));

        List<ShowTime> showTimes = showTimeRepository.findByCinemaRoom(cinemaRoom);
        if (!showTimes.isEmpty()) {
            throw new CinemaRoomIsNotEmptyException("Cannot delete a cinema room with scheduled showtimes.");
        }

        cinemaRoomRepository.delete(cinemaRoom);
    }
}
