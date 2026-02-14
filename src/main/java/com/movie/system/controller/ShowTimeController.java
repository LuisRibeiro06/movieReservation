package com.movie.system.controller;

import com.movie.system.dto.ShowTimeDTO;
import com.movie.system.model.ShowTime;
import com.movie.system.service.ShowTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public ResponseEntity<ShowTimeDTO> getShowTimeById(@PathVariable Long id){
        return ResponseEntity.ok(showTimeService.getShowTimeById(id));
    }

    @GetMapping("/movie/{id}")
    public ResponseEntity<List<ShowTimeDTO>> getShowTimesByMovieId(@PathVariable Long id){
        return ResponseEntity.ok(showTimeService.getShowTimesByMovieId(id));
    }

    @PostMapping()
    public ResponseEntity<ShowTime> saveShowTime(@RequestBody ShowTimeDTO showTimeDTO){
        return ResponseEntity.ok(showTimeService.saveShowTime(showTimeDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowTime> updateShowTime(@PathVariable Long id, @RequestBody ShowTimeDTO showTimeDTO) {
        return ResponseEntity.ok(showTimeService.updateShowTime(id, showTimeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowTime(@PathVariable Long id){
        showTimeService.deleteShowTime(id);
        return ResponseEntity.noContent().build();
    }

}
