package com.AlgoAlert.CodeRadar.controllers;


import com.AlgoAlert.CodeRadar.dto.AuthResponse;
import com.AlgoAlert.CodeRadar.dto.LoginRequest;
import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.UserDetailsServiceImpl;
import com.AlgoAlert.CodeRadar.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class
AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User existingUser = userService.findByUsername(user.getUsername());
            if (existingUser != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
            }
            String rawPassword = user.getPassword();
            userService.saveUser(user);
            User savedUser = userService.findByUsername(user.getUsername());
            String token = userService.verify(savedUser.getUsername(), rawPassword);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate token after registration");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, savedUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            User user = req.getUsername() != null ? userService.findByUsername(req.getUsername()) : userService.findByEmail(req.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            String token = userService.verify(user.getUsername(), req.getPassword());
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
            return ResponseEntity.ok(new AuthResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }
}
