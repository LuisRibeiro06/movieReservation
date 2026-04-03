package com.movie.system.repository;

import com.movie.system.model.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {

    @Query("SELECT st FROM ShowTime st WHERE st.date > CURRENT_TIMESTAMP")
    List<ShowTime> getUpcomingShowTimes();

    List<ShowTime> findByDate(LocalDateTime date);

    List<ShowTime> findByMovie_Id(Long movieId);

    @Query("SELECT st FROM ShowTime st WHERE st.date > CURRENT_TIMESTAMP AND st.movie.id = :movieId")
    List<ShowTime> getShowTimesByMovie_Id(Long movieId);
}
