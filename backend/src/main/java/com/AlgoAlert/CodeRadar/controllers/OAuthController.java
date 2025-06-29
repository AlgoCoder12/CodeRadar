package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.dto.AuthResponse;
import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.JWTService;
import com.AlgoAlert.CodeRadar.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class OAuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

    @GetMapping("/login-success")
    public ResponseEntity<?> loginSuccess(HttpServletResponse response,
                                          @AuthenticationPrincipal OAuth2User oauthUser) {
        try {
            if (oauthUser == null || oauthUser.getAttribute("email") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Authentication failed: No user data available"));
            }
            System.out.println(oauthUser);

            // Extract user details from OAuth2 user
            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");
            System.out.println(email+" "+name);
            // Check if user exists
            User user = userService.findByEmail(email);
            System.out.println("user before"+user);
            if (user == null) {
                // Create new user
                user = new User();
                user.setEmail(email);
                user.setUsername(email);
                user.setFullName(name != null ? name : email);
                String randomPassword = java.util.UUID.randomUUID().toString();
                user.setPassword(randomPassword);
                userService.saveUser(user);
            } else {
                // Update existing user's details if needed
                if (name != null && !name.equals(user.getFullName())) {
                    user.setFullName(name);
                    userService.saveUser(user);
                }
            }

            System.out.println("user"+user);

            // Generate JWT token
            String token = jwtService.generateToken(user.getUsername());
            if (token == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("error", "Failed to generate authentication token"));
            }

            System.out.println(token);

            // Create a redirect URL with the token
            String redirectUrl = String.format("http://localhost:5173/dashboard?token=%s&userId=%s",
                    URLEncoder.encode(token, StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode(user.getId(), StandardCharsets.UTF_8.toString()));

            response.sendRedirect(redirectUrl);
            return null;

        } catch (Exception e) {
            try {
                response.sendRedirect("http://localhost:5173/login?error=" +
                        URLEncoder.encode("Authentication failed: " + e.getMessage(), "UTF-8"));
            } catch (IOException ex) {
                // Fallback error response
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("error", "Authentication failed: " + e.getMessage()));
            }
            return null;
        }
    }

    @GetMapping("/login-failure")
    public ResponseEntity<Map<String, Object>> loginFailure() {
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Login failed"));
    }

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }
}