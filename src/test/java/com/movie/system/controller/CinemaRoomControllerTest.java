package com.movie.system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movie.system.dto.CreateCinemaRoomDTO;
import com.movie.system.exception.cinema_room.CinemaRoomIsNotEmptyException;
import com.movie.system.exception.cinema_room.CinemaRoomNotFound;
import com.movie.system.model.CinemaRoom;
import com.movie.system.security.SecurityFilter;
import com.movie.system.service.CinemaRoomService;
import com.movie.system.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CinemaRoomController.class)
@AutoConfigureMockMvc
@WithMockUser(roles = "ADMIN")
class CinemaRoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private CinemaRoomService cinemaRoomService;

    @MockitoBean
    private TokenService tokenService;

    private CinemaRoom cinemaRoom;
    private CreateCinemaRoomDTO createCinemaRoomDTO;

    @BeforeEach
    void setUp() {
        cinemaRoom = new CinemaRoom();
        cinemaRoom.setId(1L);
        cinemaRoom.setName("Room 1");

        createCinemaRoomDTO = new CreateCinemaRoomDTO("Room 1", 10, 10);
    }

    @Test
    void testCreateCinemaRoom_Success() throws Exception {
        when(cinemaRoomService.createCinemaRoomAndSeats(any())).thenReturn(cinemaRoom);

        mockMvc.perform(post("/api/cinema-rooms").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createCinemaRoomDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Room 1"));
    }

    @Test
    void testDeleteCinemaRoom_Success() throws Exception {
        mockMvc.perform(delete("/api/cinema-rooms/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteCinemaRoom_WhenRoomHasShowTimes_ShouldThrowCinemaRoomIsNotEmptyException() throws Exception {
        doThrow(new CinemaRoomIsNotEmptyException("Cinema room has showtimes")).when(cinemaRoomService).deleteCinemaRoom(1L);

        mockMvc.perform(delete("/api/cinema-rooms/1").with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteCinemaRoom_WhenRoomNotFound_ShouldThrowCinemaRoomNotFoundException() throws Exception {
        doThrow(new CinemaRoomNotFound("Cinema room not found")).when(cinemaRoomService).deleteCinemaRoom(1L);

        mockMvc.perform(delete("/api/cinema-rooms/1").with(csrf()))
                .andExpect(status().isNotFound());
    }
}
