package com.movie.system.dto;

import lombok.Data;

@Data
public class UpdateMovieDTO {
    private String title;
    private String genre;
    private Integer duration;
    private String description;
    private String posterImage;
}
