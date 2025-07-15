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
import java.util.Map;
import java.util.HashMap;

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
            // System.out.println(user.toString());
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

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        boolean sent = userService.generateAndSendOtp(email);
        if (sent) {
            return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to send OTP"));
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        if (email == null || otp == null || email.isEmpty() || otp.isEmpty()) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }
        boolean valid = userService.validateOtp(email, otp);
        Map<String, Object> response = new HashMap<>();
        response.put("valid", valid);
        if (valid) {
            response.put("message", "OTP validated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid or expired OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
