package com.movie.system.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReservationRequestDTO {
    private Long showTimeId;
    private List<Long> seatIds;
}
