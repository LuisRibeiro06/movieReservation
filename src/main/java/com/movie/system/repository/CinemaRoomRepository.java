package com.movie.system.repository;

import com.movie.system.model.CinemaRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CinemaRoomRepository extends JpaRepository<CinemaRoom, Long> {
    Optional<CinemaRoom> findById(Long id);
}
