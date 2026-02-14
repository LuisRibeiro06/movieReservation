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
import java.util.stream.Collectors;

@Service
public class ShowTimeService {

    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final ModelMapper modelMapper;


    public ShowTimeService(ShowTimeRepository showTimeRepository, MovieRepository movieRepository, CinemaRoomRepository cinemaRoomRepository) {
        this.showTimeRepository = showTimeRepository;
        this.movieRepository = movieRepository;
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.modelMapper =  new ModelMapper();
    }

    public List<ShowTimeDTO> getAllShowTimes(){
        return showTimeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ShowTimeDTO getShowTimeById(Long id){
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ShowTime not found"));
        return convertToDto(showTime);
    }

    public List<ShowTimeDTO> getShowTimesByMovieId(Long id){
        List<ShowTime> showTimes = showTimeRepository.getShowTimesByMovie_Id(id);
        return showTimes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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

    public ShowTime updateShowTime(Long id, ShowTimeDTO showTimeDTO) {
        ShowTime existingShowTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ShowTime not found"));

        Movie movie = movieRepository.findById(showTimeDTO.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        CinemaRoom cinemaRoom = cinemaRoomRepository.findById(showTimeDTO.getCinemaRoomId())
                .orElseThrow(() -> new RuntimeException("Cinema room not found"));

        existingShowTime.setMovie(movie);
        existingShowTime.setCinemaRoom(cinemaRoom);
        existingShowTime.setDate(showTimeDTO.getDate());
        existingShowTime.setPrice(showTimeDTO.getPrice());

        return showTimeRepository.save(existingShowTime);
    }

    public void deleteShowTime(Long showTimeId){
        if (!showTimeRepository.existsById(showTimeId)){
            throw new RuntimeException("ShowTime not found");
        }

        showTimeRepository.deleteById(showTimeId);
    }

    private ShowTimeDTO convertToDto(ShowTime showTime) {
        ShowTimeDTO dto = new ShowTimeDTO();
        dto.setId(showTime.getId());
        dto.setPrice(showTime.getPrice());
        dto.setDate(showTime.getDate());
        dto.setMovieId(showTime.getMovie().getId());
        dto.setMovieTitle(showTime.getMovie().getTitle());
        dto.setCinemaRoomId(showTime.getCinemaRoom().getId());
        dto.setRoomName(showTime.getCinemaRoom().getName());
        return dto;
    }
}
