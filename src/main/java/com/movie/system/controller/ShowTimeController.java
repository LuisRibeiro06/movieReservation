package com.movie.system.controller;

import com.movie.system.dto.ShowTimeDTO;
import com.movie.system.model.ShowTime;
import com.movie.system.service.ShowTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")

public class ShowTimeController {

    private final ShowTimeService showTimeService;

    public ShowTimeController(ShowTimeService showTimeService) {
        this.showTimeService = showTimeService;
    }

    @GetMapping()
    public ResponseEntity<List<ShowTimeDTO>> getAllShowTimes(){
        return ResponseEntity.ok(showTimeService.getAllShowTimes());
    }

    @PostMapping()
    public ResponseEntity<ShowTime> saveShowTime(ShowTimeDTO showTimeDTO){
        return ResponseEntity.ok(showTimeService.saveShowTime(showTimeDTO));
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteShowTime(Long showTimeId){
        showTimeService.deleteShowTime(showTimeId);
        return ResponseEntity.noContent().build();
    }

}
