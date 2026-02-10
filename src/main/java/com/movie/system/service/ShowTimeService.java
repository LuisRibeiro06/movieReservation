package com.movie.system.service;

import com.movie.system.dto.ShowTimeDTO;
import com.movie.system.model.CinemaRoom;
import com.movie.system.model.Movie;
import com.movie.system.model.ShowTime;
import com.movie.system.repository.CinemaRoomRepository;
import com.movie.system.repository.MovieRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowTimeService {

    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final ModelMapper modelMapper;


    public ShowTimeService(ShowTimeRepository showTimeRepository, MovieRepository movieRepository, CinemaRoomRepository cinemaRoomRepository, ModelMapper modelMapper) {
        this.showTimeRepository = showTimeRepository;
        this.movieRepository = movieRepository;
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.modelMapper = modelMapper;
    }

    public List<ShowTimeDTO> getAllShowTimes(){
        return showTimeRepository.findAll().stream()
                .map(showTime -> modelMapper.map(showTime, ShowTimeDTO.class))
                .toList();
    }

    public ShowTime saveShowTime(ShowTimeDTO showTimeDTO){
        Movie movie = movieRepository.findById(showTimeDTO.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        CinemaRoom cinemaRoom = cinemaRoomRepository.findById(showTimeDTO.getCinemaRoomId())
                .orElseThrow(() -> new RuntimeException("Cinema room not found"));

        ShowTime showTime = new ShowTime();
        showTime.setMovie(movie);
        showTime.setCinemaRoom(cinemaRoom);
        showTime.setDate(showTimeDTO.getDate());
        showTime.setPrice(showTimeDTO.getPrice());

        return showTimeRepository.save(showTime);
    }

    public void deleteShowTime(Long showTimeId){
        if (!showTimeRepository.existsById(showTimeId)){
            throw new RuntimeException("ShowTime not found");
        }

        showTimeRepository.deleteById(showTimeId);
    }

}
