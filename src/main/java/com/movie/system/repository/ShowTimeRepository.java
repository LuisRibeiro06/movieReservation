package com.movie.system.repository;

import com.movie.system.model.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    List<ShowTime> findByDate(LocalDateTime date);

    Arrays findByMovie_Id(Long movieId);

    List<ShowTime> getShowTimesByMovie_Id(Long movieId);
}
