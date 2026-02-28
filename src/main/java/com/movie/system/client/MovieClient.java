package com.movie.system.client;

import com.movie.system.dto.movieAPI.OmdbMovieDetail;
import com.movie.system.dto.movieAPI.OmdbSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "omdb-client", url = "http://www.omdbapi.com")
public interface MovieClient {

    @GetMapping
    OmdbSearchResponse searchMovie(
            @RequestParam("s") String title,
            @RequestParam("apikey") String apiKey
    );

    @GetMapping("/")
    OmdbMovieDetail getMovieDetails(
            @RequestParam("i") String imdbId,
            @RequestParam("apikey")String apiKey
    );
}
