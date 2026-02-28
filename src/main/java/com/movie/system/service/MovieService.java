package com.movie.system.service;

import com.movie.system.client.MovieClient;
import com.movie.system.dto.UpdateMovieDTO;
import com.movie.system.dto.movieAPI.OmdbMovieDetail;
import com.movie.system.dto.movieAPI.OmdbSearchResponse;
import com.movie.system.dto.movieAPI.OmdbSearchResult;
import com.movie.system.model.Movie;
import com.movie.system.model.ShowTime;
import com.movie.system.repository.MovieRepository;
import com.movie.system.repository.ShowTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowTimeRepository showTimeRepository;
    private final MovieClient movieClient;

    @Value("${omdb.api.key}")
    private String apiKey;

    public MovieService(MovieRepository movieRepository, ShowTimeRepository showTimeRepository, MovieClient movieClient) {
        this.movieRepository = movieRepository;
        this.showTimeRepository = showTimeRepository;
        this.movieClient = movieClient;
    }

    public List<Movie> getAllMovies(){
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id){
        return movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<OmdbSearchResult> searchMovies(String query){
        OmdbSearchResponse searchResults = movieClient.searchMovie(query, apiKey);

        if (searchResults.getSearch() == null || searchResults.getSearch().isEmpty() || "False".equals(searchResults.getResponse())){
            return List.of();
        }

        return searchResults.getSearch();
    }

    public Movie saveMovie(String imdbId){

        if (movieRepository.existsByImdbId(imdbId)) {
            throw new RuntimeException("Movie already exists");
        }

        OmdbMovieDetail omdbMovieDetail = movieClient.getMovieDetails(imdbId, apiKey);

        if (omdbMovieDetail.getResponse() == null || "False".equals(omdbMovieDetail.getResponse())) {
            throw new RuntimeException("Movie not found");
        }

        Movie movie = new Movie();
        movie.setTitle(omdbMovieDetail.getTitle());
        movie.setImdbId(omdbMovieDetail.getImdbID());
        movie.setGenre(omdbMovieDetail.getGenre());
        movie.setDuration(parseRuntime(omdbMovieDetail.getRuntime()));
        movie.setDescription(omdbMovieDetail.getPlot());
        movie.setPosterImage(omdbMovieDetail.getPoster());

        String plot = "N/A".equals(omdbMovieDetail.getPlot()) ? "No plot available." : omdbMovieDetail.getPlot();
        if (plot.length() > 4000) {
            plot = plot.substring(0, 3997) + "...";
        }
        movie.setDescription(plot);

        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, UpdateMovieDTO movieDetails) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id " + id));

        if (movieDetails.getTitle() != null) {
            movie.setTitle(movieDetails.getTitle());
        }
        if (movieDetails.getGenre() != null) {
            movie.setGenre(movieDetails.getGenre());
        }
        if (movieDetails.getDuration() != null) {
            movie.setDuration(movieDetails.getDuration());
        }
        if (movieDetails.getDescription() != null) {
            movie.setDescription(movieDetails.getDescription());
        }
        if (movieDetails.getPosterImage() != null) {
            movie.setPosterImage(movieDetails.getPosterImage());
        }

        return movieRepository.save(movie);
    }

    public void deleteMovie(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new RuntimeException("Movie not found");
        }
        movieRepository.deleteById(movieId);
    }

    private Integer parseRuntime(String runtimeStr) {
        if (runtimeStr == null || "N/A".equalsIgnoreCase(runtimeStr)) {
            return 0;
        }
        try {
            return Integer.parseInt(runtimeStr.replace("min", "").trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public List<Movie> getMoviesPlayingFromDate(LocalDateTime date){
        List<ShowTime> AllshowTimes= showTimeRepository.findByDate(date);

        List<Movie> movies= new ArrayList<>();

        for (ShowTime allshowTimes : AllshowTimes){
            movies.add(allshowTimes.getMovie());
        }

        return movies;
    }


}
