package com.movie.system.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ReservationRequestDTO {
    @NotNull
    private Long showTimeId;
    @NotNull
    @Size(min = 1, message = "At least one seat must be selected")
    private List<Long> seatIds;
}
