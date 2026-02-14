package com.movie.system.controller;

import com.movie.system.dto.AuthRequestDTO;
import com.movie.system.dto.AuthResponseDTO;
import com.movie.system.dto.RegisterDTO;
import com.movie.system.model.Role;
import com.movie.system.model.User;
import com.movie.system.repository.RoleRepository;
import com.movie.system.repository.UserRepository;
import com.movie.system.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO authRequestDTO){
        UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword());
        Authentication auth = this.authenticationManager.authenticate(usernamePassword);

        String token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO registerDTO){
        if (userRepository.findByUsername(registerDTO.getUsername()) != null){
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        String encryptedPassword = this.passwordEncoder.encode(registerDTO.getPassword());
        Role role = roleRepository.findByName("ROLE_USER");
        User user = new User(registerDTO.getUsername(), encryptedPassword, registerDTO.getEmail(), role);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
