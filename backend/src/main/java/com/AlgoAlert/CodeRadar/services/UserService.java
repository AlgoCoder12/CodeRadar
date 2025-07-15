package com.AlgoAlert.CodeRadar.services;


import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;
import java.time.Instant;

@Component
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JWTService jwtService;

//    @Autowired
    private AuthenticationManager authenticationManager;


    public UserService(UserRepo userRepo,
                       @Lazy AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // OTP storage: email -> [otp, expiryTimestamp]
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int OTP_LENGTH = 6;
    private final Random random = new Random();

    private static class OtpEntry {
        String otp;
        long expiry;
        OtpEntry(String otp, long expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    public void saveUser(User user) {
        System.out.println("Saving user: " + user.getEmail());
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            System.err.println("Error: Cannot save user with empty password");
            return;
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        System.out.println("User saved successfully: " + user.getEmail());
    }

    public User findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepo.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public String verify(String username, String password) {
        System.out.println("Attempting to verify user: " + username);
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
                );
            System.out.println(auth);
            System.out.println("Auth "+username+" "+password);
            System.out.println("Authentication successful for user: " + username);
            return jwtService.generateToken(username);
        } catch (Exception e) {
            System.err.println("Authentication failed for user " + username + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public boolean generateAndSendOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        long expiry = Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60).toEpochMilli();
        otpStore.put(email, new OtpEntry(otp, expiry));
        
        // For development: log OTP to console instead of sending email
        System.out.println("=== OTP FOR DEVELOPMENT ===");
        System.out.println("Email: " + email);
        System.out.println("OTP: " + otp);
        System.out.println("Expires: " + Instant.ofEpochMilli(expiry));
        System.out.println("==========================");
        
        // Try to send email, but don't fail if email is not configured
        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("Email sending failed, but OTP is generated: " + e.getMessage());
        }
        
        return true; // Always return true for development
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) return false;
        if (Instant.now().toEpochMilli() > entry.expiry) {
            otpStore.remove(email);
            return false;
        }
        boolean valid = entry.otp.equals(otp);
        if (valid) otpStore.remove(email);
        return valid;
    }
}
