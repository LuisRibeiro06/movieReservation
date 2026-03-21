package com.movie.system.controller;

import com.movie.system.dto.AuthRequestDTO;
import com.movie.system.dto.AuthResponseDTO;
import com.movie.system.dto.RegisterDTO;
import com.movie.system.model.Role;
import com.movie.system.model.User;
import com.movie.system.repository.RoleRepository;
import com.movie.system.repository.UserRepository;
import com.movie.system.service.LoginRateLimiterService;
import com.movie.system.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final LoginRateLimiterService loginRateLimiterService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, TokenService tokenService, PasswordEncoder passwordEncoder, LoginRateLimiterService loginRateLimiterService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.loginRateLimiterService = loginRateLimiterService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO authRequestDTO, HttpServletRequest request){
        String ipAddress = request.getRemoteAddr();
        if (loginRateLimiterService.isBlocked(ipAddress)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(new AuthResponseDTO("Too many failed attempts. Try again in 15 minutes."));
        }

        try {
            UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword());
            Authentication auth = this.authenticationManager.authenticate(usernamePassword);

            String token = tokenService.generateToken((User) auth.getPrincipal());
            loginRateLimiterService.resetAttempts(ipAddress);

            return ResponseEntity.ok(new AuthResponseDTO(token));
        } catch (AuthenticationException e) {
            loginRateLimiterService.recordFailedAttempt(ipAddress);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponseDTO("Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody RegisterDTO registerDTO){
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        String encryptedPassword = this.passwordEncoder.encode(registerDTO.getPassword());
        Role role = roleRepository.findByName("ROLE_USER");
        User user = new User(registerDTO.getUsername(), encryptedPassword, registerDTO.getEmail(), role);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
