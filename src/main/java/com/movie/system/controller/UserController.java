package com.movie.system.controller;

import com.movie.system.dto.UserDTO;
import com.movie.system.model.User;
import com.movie.system.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        User user = userService.getCurrentUser();
        UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(userDTO);
    }
}
