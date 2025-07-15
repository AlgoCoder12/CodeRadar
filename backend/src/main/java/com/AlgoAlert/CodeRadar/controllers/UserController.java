package com.AlgoAlert.CodeRadar.controllers;


import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.PlatformVerificationService;
import com.AlgoAlert.CodeRadar.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PlatformVerificationService platformVerificationService;

    @GetMapping("/all-users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/update-handles")
    public ResponseEntity<?> updatePlatformHandles(@RequestBody User handleUpdates) throws ExecutionException, InterruptedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        // Update only non-null fields
        if (handleUpdates.getLeetcodeHandle() != null) {
            if (platformVerificationService.verifyPlatformHandle(handleUpdates.getLeetcodeHandle(), "leetcode").get()){
                user.setLeetcodeHandle(handleUpdates.getLeetcodeHandle());
            }
        }
        if (handleUpdates.getCodeforcesHandle() != null) {
            if (platformVerificationService.verifyPlatformHandle(handleUpdates.getCodeforcesHandle(), "codeforces").get()) {
                user.setCodeforcesHandle(handleUpdates.getCodeforcesHandle());
            }
        }
        if (handleUpdates.getCodechefHandle() != null) {
            if (platformVerificationService.verifyPlatformHandle(handleUpdates.getCodechefHandle(), "codechef").get()) {
                user.setCodechefHandle(handleUpdates.getCodechefHandle());
            }
        }
        if (handleUpdates.getAtcoderHandle() != null) {
            if (platformVerificationService.verifyPlatformHandle(handleUpdates.getAtcoderHandle(), "atcoder").get()) {
                user.setAtcoderHandle(handleUpdates.getAtcoderHandle());
            }
        }
        if (handleUpdates.getHackerrankHandle() != null) {
            if (platformVerificationService.verifyPlatformHandle(handleUpdates.getHackerrankHandle(), "hackerrank").get()) {
                user.setHackerrankHandle(handleUpdates.getHackerrankHandle());
            }
        }
        if (handleUpdates.getHackerearthHandle() != null) {
            if (platformVerificationService.verifyPlatformHandle(handleUpdates.getHackerearthHandle(), "hackerearth").get()) {
                user.setHackerearthHandle(handleUpdates.getHackerearthHandle());
            }
        }
        userService.saveUser(user);
        return ResponseEntity.ok(user);
    }
}
