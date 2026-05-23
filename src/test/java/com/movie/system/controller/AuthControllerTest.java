package com.movie.system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movie.system.dto.AuthRequestDTO;
import com.movie.system.dto.RegisterDTO;
import com.movie.system.exception.user.InvalidCredentialsException;
import com.movie.system.model.Role;
import com.movie.system.model.User;
import com.movie.system.repository.RoleRepository;
import com.movie.system.repository.UserRepository;
import com.movie.system.security.SecurityFilter;
import com.movie.system.service.LoginRateLimiterService;
import com.movie.system.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = AuthController.class,
        excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityFilter.class)
        }
)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private RoleRepository roleRepository;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private LoginRateLimiterService loginRateLimiterService;

    private User user;
    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setName("ROLE_USER");

        user = new User("testuser", "password", "test@test.com", userRole);
    }

    @Test
    void testRegister_Success() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setUsername("newuser");
        registerDTO.setPassword("password");
        registerDTO.setEmail("new@test.com");
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(userRole);
        when(userRepository.save(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void testRegister_WhenUsernameAlreadyExists_ShouldThrowException() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setUsername("testuser");
        registerDTO.setPassword("password");
        registerDTO.setEmail("new@test.com");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username is already taken"));
    }

    @Test
    void testLogin_WithValidCredentials_ShouldReturnSuccessAndSetCookie() throws Exception {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("testuser");
        authRequestDTO.setPassword("password");

        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null);

        when(loginRateLimiterService.isBlocked(any())).thenReturn(false);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenService.generateToken(any())).thenReturn("test-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("token"))
                .andExpect(cookie().value("token", "test-token"))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void testLogin_WithInvalidCredentials_ShouldThrowException() throws Exception {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("testuser");
        authRequestDTO.setPassword("password");

        when(loginRateLimiterService.isBlocked(any())).thenReturn(false);
        when(authenticationManager.authenticate(any())).thenThrow(new InvalidCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequestDTO)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLogin_WhenIpIsBlocked_ShouldThrowTooManyLoginAttemptsException() throws Exception {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("testuser");
        authRequestDTO.setPassword("password");

        when(loginRateLimiterService.isBlocked(any())).thenReturn(true);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequestDTO)))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void testLogout_ShouldReturnCookieWithMaxAgeZero() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("token"))
                .andExpect(cookie().maxAge("token", 0));
    }
}
