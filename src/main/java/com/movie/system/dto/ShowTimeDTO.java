package com.movie.system.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ShowTimeDTO {
    private BigDecimal price;
    private LocalDateTime date;
    private Long movieId;
    private Long cinemaRoomId;
}
