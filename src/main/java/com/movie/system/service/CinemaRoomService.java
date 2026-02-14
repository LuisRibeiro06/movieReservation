package com.movie.system.service;

import com.movie.system.model.CinemaRoom;
import com.movie.system.repository.CinemaRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaRoomService {

    private final CinemaRoomRepository cinemaRoomRepository;

    public CinemaRoomService(CinemaRoomRepository cinemaRoomRepository) {
        this.cinemaRoomRepository = cinemaRoomRepository;
    }


    public List<CinemaRoom> getAllCinemaRooms(){
        return cinemaRoomRepository.findAll();
    }

    public CinemaRoom getCinemaRoomById(Long id){
        return cinemaRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema room not found"));
    }

    public CinemaRoom saveCinemaRoom(CinemaRoom cinemaRoom){
        return cinemaRoomRepository.save(cinemaRoom);
    }

    public void deleteCinemaRoom(Long id) {
        if (!cinemaRoomRepository.existsById(id)) {
            throw new RuntimeException("Cinema room not found");
        }
        cinemaRoomRepository.deleteById(id);
    }
}
