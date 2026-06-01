package com.movie.system.controller;

import com.movie.system.dto.SeatAvailabilityDTO;
import com.movie.system.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/availability")
    public ResponseEntity<List<SeatAvailabilityDTO>> getSeatsForShowTime(@RequestParam Long showTimeId) {
        return ResponseEntity.ok(seatService.getSeatsForShowTime(showTimeId));
    }
}
