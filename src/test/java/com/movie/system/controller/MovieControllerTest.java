package com.movie.system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movie.system.dto.movieAPI.OmdbSearchResult;
import com.movie.system.exception.movie.DuplicateMovieException;
import com.movie.system.exception.movie.MovieNotFoundException;
import com.movie.system.model.Movie;
import com.movie.system.service.MovieService;
import com.movie.system.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MovieController.class)
@WithMockUser(roles = "ADMIN")
class MovieControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private MovieService movieService;

    @MockitoBean
    private TokenService tokenService;

    private Movie movie;
    private OmdbSearchResult omdbMovieDetail;

    @BeforeEach
    void setUp() {
        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Inception");
        movie.setImdbId("tt1375666");

        omdbMovieDetail = new OmdbSearchResult();
        omdbMovieDetail.setTitle("Inception");
        omdbMovieDetail.setImdbID("tt1375666");
    }

    @Test
    void testSearchMovie_WithValidTitle_ShouldReturnResults() throws Exception {
        when(movieService.searchMovies("Inception")).thenReturn(( (List<OmdbSearchResult>) Collections.singletonList(omdbMovieDetail)));

        mockMvc.perform(get("/api/movies/search").with(csrf()).param("query", "Inception"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].Title").value("Inception"));
    }

    @Test
    void testImportMovie_Success() throws Exception {
        when(movieService.saveMovie(any())).thenReturn(movie);

        mockMvc.perform(post("/api/movies/import").with(csrf())
                        .param("imdbId", "tt1375666"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Inception"));
    }

    @Test
    void testImportMovie_WhenMovieAlreadyExists_ShouldThrowDuplicateMovieException() throws Exception {
        when(movieService.saveMovie(any())).thenThrow(new DuplicateMovieException("Movie already exists"));

        mockMvc.perform(post("/api/movies/import").with(csrf())
                        .param("imdbId", "tt1375666"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteMovie_Success() throws Exception {
        doNothing().when(movieService).deleteMovie(1L);

        mockMvc.perform(delete("/api/movies/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteMovie_WhenMovieNotFound_ShouldThrowMovieNotFoundException() throws Exception {
        doThrow(new MovieNotFoundException("Movie not found")).when(movieService).deleteMovie(1L);

        mockMvc.perform(delete("/api/movies/1").with(csrf()))
                .andExpect(status().isNotFound());
    }
}
