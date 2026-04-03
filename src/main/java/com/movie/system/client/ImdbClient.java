package com.movie.system.client;

import com.movie.system.dto.movieAPI.ImdbVideoApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "imdb-client", url = "https://api.imdbapi.dev")
public interface ImdbClient {

    @GetMapping("/titles/{imdbId}/videos")
    ImdbVideoApiResponse getMovieVideos(@PathVariable("imdbId") String imdbId);
}