package com.movie.system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.movie.system.dto.ShowTimeDTO;
import com.movie.system.exception.session.SessionNotFoundException;
import com.movie.system.model.ShowTime;
import com.movie.system.service.ShowTimeService;
import com.movie.system.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShowTimeController.class)
@WithMockUser(roles = "ADMIN")
class ShowTimeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private ShowTimeService showTimeService;

    private ShowTime showTime;
    private ShowTimeDTO showTimeDTO;

    @BeforeEach
    void setUp() {
        showTime = new ShowTime();
        showTime.setId(1L);
        showTime.setDate(LocalDateTime.now());

        showTimeDTO = new ShowTimeDTO();
        showTimeDTO.setMovieId(1L);
        showTimeDTO.setCinemaRoomId(1L);
        showTimeDTO.setDate(LocalDateTime.now());
    }

    @Test
    void testCreateShowTime_Success() throws Exception {
        when(showTimeService.saveShowTime(any())).thenReturn(showTime);

        mockMvc.perform(post("/api/showtimes").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(showTimeDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateShowTime_Success() throws Exception {
        when(showTimeService.updateShowTime(eq(1L), any())).thenReturn(showTime);

        mockMvc.perform(put("/api/showtimes/1").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(showTimeDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteShowTime_Success() throws Exception {
        mockMvc.perform(delete("/api/showtimes/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    void testUpdateShowTime_WhenSessionNotFound_ShouldThrowException() throws Exception {
        doThrow(new SessionNotFoundException("Session not found")).when(showTimeService).updateShowTime(eq(1L), any());

        mockMvc.perform(put("/api/showtimes/1").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(showTimeDTO)))
                .andExpect(status().isNotFound());
    }
}
