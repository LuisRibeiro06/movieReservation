package com.movie.system.ai.tools;

import com.movie.system.dto.ShowTimeDTO;
import com.movie.system.model.Movie;
import com.movie.system.service.MovieService;
import com.movie.system.service.ShowTimeService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class CinemaxAiTools {

    private final ShowTimeService showTimeService;
    private final MovieService movieService; // <-- 1. Declaramos o MovieService aqui

    // 2. Injetamos ambos os services pelo construtor do Spring
    public CinemaxAiTools(ShowTimeService showTimeService, MovieService movieService) {
        this.showTimeService = showTimeService;
        this.movieService = movieService;
    }

    @Tool(description = "Search for available movies and showtimes. Always use this function when the user asks about movie schedules, showtimes, or sessions.")
    public String findSessions() {
        try {
            List<ShowTimeDTO> sessoes = showTimeService.getAllShowTimes();

            if (sessoes == null || sessoes.isEmpty()) {
                return "Não existem sessões ou filmes disponíveis no momento.";
            }

            return sessoes.stream()
                    .map(st -> String.format("Filme: %s, Hora: %s, Sala: %s",
                            st.getMovieTitle(), st.getDate(), st.getRoomName()))
                    .collect(Collectors.joining(" | "));

        } catch (Exception e) {
            e.printStackTrace();
            return "Ocorreu um erro interno ao tentar obter as sessões de cinema.";
        }
    }

    @Tool(description = "Fetch movie details (synopsis, duration, genre) by its ID. Use this function when the user asks about movie details.")
    public String buscarDetalhesFilme(Long movieId) {
        try {
            Movie filme = movieService.getMovieById(movieId);

            return String.format("Título: %s | Género: %s | Duração: %d min | Sinopse: %s",
                    filme.getTitle(), filme.getGenre(), filme.getDuration(), filme.getDescription());
        } catch (Exception e) {
            return "Não foi possível encontrar os detalhes do filme com o ID informado.";
        }
    }
}