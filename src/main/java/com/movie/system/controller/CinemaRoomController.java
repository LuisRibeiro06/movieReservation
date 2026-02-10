package com.movie.system.controller;

import com.movie.system.model.CinemaRoom;
import com.movie.system.service.CinemaRoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cinema-rooms")
public class CinemaRoomController {

    private final CinemaRoomService cinemaRoomService;

    public CinemaRoomController(CinemaRoomService cinemaRoomService) {
        this.cinemaRoomService = cinemaRoomService;
    }

    @GetMapping
    public ResponseEntity<List<CinemaRoom>> getAllCinemaRooms() {
        return ResponseEntity.ok(cinemaRoomService.getAllCinemaRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CinemaRoom> getCinemaRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(cinemaRoomService.getCinemaRoomById(id));
    }

    @PostMapping
    public ResponseEntity<CinemaRoom> createCinemaRoom(@RequestBody int capacity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cinemaRoomService.saveCinemaRoom(capacity));
    }
}

