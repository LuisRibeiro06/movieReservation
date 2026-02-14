package com.movie.system.controller;

import com.movie.system.dto.ReturnMovieDTO;
import com.movie.system.dto.UpdateMovieDTO;
import com.movie.system.dto.movieAPI.OmdbSearchResult;
import com.movie.system.model.Movie;
import com.movie.system.service.MovieService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<List<ReturnMovieDTO>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies().stream().map(movie -> new ReturnMovieDTO(movie.getId(), movie.getTitle(), movie.getGenre(), movie.getDuration(), movie.getDescription(), movie.getPosterImage(), movie.getImdbId())).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnMovieDTO> getMovieById(@PathVariable Long id){
        Movie movie = movieService.getMovieById(id);
        return ResponseEntity.ok(new ReturnMovieDTO(movie.getId(), movie.getTitle(), movie.getGenre(), movie.getDuration(), movie.getDescription(), movie.getPosterImage(), movie.getImdbId()));
    }

    @GetMapping("/playing")
    public ResponseEntity<List<Movie>> getMoviesPlayingFromDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ResponseEntity.ok(movieService.getMoviesPlayingFromDate(date));
    }

    @GetMapping("/search")
    public ResponseEntity<List<OmdbSearchResult>> search(@RequestParam String query) {
        return ResponseEntity.ok(movieService.searchMovies(query));
    }

    @PostMapping("/import")
    public ResponseEntity<ReturnMovieDTO> importMovie(@RequestParam String imdbId) {
        Movie savedMovie = movieService.saveMovie(imdbId);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ReturnMovieDTO(savedMovie.getId(), savedMovie.getTitle(), savedMovie.getGenre(), savedMovie.getDuration(), savedMovie.getDescription(), savedMovie.getPosterImage(), savedMovie.getImdbId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReturnMovieDTO> updateMovie(@PathVariable Long id, @RequestBody UpdateMovieDTO movieDetails) {
        Movie updatedMovie = movieService.updateMovie(id, movieDetails);
        return ResponseEntity.ok(new ReturnMovieDTO(updatedMovie.getId(), updatedMovie.getTitle(), updatedMovie.getGenre(), updatedMovie.getDuration(), updatedMovie.getDescription(), updatedMovie.getPosterImage(), updatedMovie.getImdbId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
