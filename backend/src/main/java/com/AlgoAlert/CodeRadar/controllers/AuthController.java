package com.AlgoAlert.CodeRadar.controllers;


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
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) throws Exception {
        User existingUser = (User) userService.findByUsername(user.getUsername());
        if (existingUser != null) {
            System.out.println("User already exists");
            return ResponseEntity.badRequest().body("User already exists");
        }

        userService.saveUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) throws Exception {

        User user = req.getUsername() != null ? userService.findByUsername(req.getUsername()) : userService.findByEmail(req.getEmail());

        if (user == null) {
            System.out.println("User not found");
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        String token = userService.verify(user.getUsername(), req.getPassword());

        if (token == null) {
            System.out.println("Invalid credentials");
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }


        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
