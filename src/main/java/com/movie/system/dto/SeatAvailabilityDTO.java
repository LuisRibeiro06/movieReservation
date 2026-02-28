package com.movie.system.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SeatAvailabilityDTO {
    private Long id;
    private String seatRow;
    private Integer seatNumber;
    @JsonProperty("isAvailable")
    private boolean isAvailable;
}
