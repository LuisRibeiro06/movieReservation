package com.movie.system.repository;

import com.movie.system.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    boolean existsByImdbId(String imdbId);

    Optional<Movie> findById(Long id);
}
