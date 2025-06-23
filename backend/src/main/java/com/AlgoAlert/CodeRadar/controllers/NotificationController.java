package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.ContestNotificationService;
import com.AlgoAlert.CodeRadar.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private ContestNotificationService contestNotificationService;

    @Autowired
    private EmailService emailService;

    // Get notification statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getNotificationStats() {
        try {
            String stats = contestNotificationService.getNotificationStatistics();
            
            Map<String, Object> response = new HashMap<>();
            response.put("statistics", stats);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get notification statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Send immediate notifications for testing
    @PostMapping("/send-immediate")
    public ResponseEntity<Map<String, Object>> sendImmediateNotifications() {
        try {
            contestNotificationService.sendImmediateNotifications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Immediate notifications sent successfully");
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send immediate notifications");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Create test user
    @PostMapping("/test-user")
    public ResponseEntity<Map<String, Object>> createTestUser(
            @RequestParam String email, 
            @RequestParam String name) {
        try {
            User testUser = contestNotificationService.createTestUser(email, name);
            
            Map<String, Object> response = new HashMap<>();
            if (testUser != null) {
                response.put("message", "Test user created successfully");
                response.put("user", testUser);
                response.put("timestamp", LocalDateTime.now());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to create test user");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create test user");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Send test notification to specific user
    @PostMapping("/test-notification")
    public ResponseEntity<Map<String, Object>> sendTestNotification(
            @RequestParam String email) {
        try {
            boolean success = contestNotificationService.sendTestNotification(email);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("message", "Test notification sent successfully");
                response.put("email", email);
                response.put("timestamp", LocalDateTime.now());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to send test notification");
                response.put("email", email);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send test notification");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Send test email to verify email configuration
    @PostMapping("/test-email")
    public ResponseEntity<Map<String, Object>> sendTestEmail(
            @RequestParam String email) {
        try {
            boolean success = emailService.sendTestEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("message", "Test email sent successfully");
                response.put("email", email);
                response.put("timestamp", LocalDateTime.now());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to send test email");
                response.put("email", email);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send test email");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Trigger notification check manually
    @PostMapping("/check-notifications")
    public ResponseEntity<Map<String, Object>> checkNotifications() {
        try {
            contestNotificationService.checkAndSendContestNotifications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification check completed successfully");
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to check notifications");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Retry failed notifications
    @PostMapping("/retry-failed")
    public ResponseEntity<Map<String, Object>> retryFailedNotifications() {
        try {
            emailService.retryFailedNotifications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed notifications retry completed");
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retry notifications");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Clean up old notifications
    @PostMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupOldNotifications() {
        try {
            emailService.cleanupOldNotifications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Old notifications cleaned up successfully");
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to cleanup old notifications");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Health check for notification system
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Notification Service");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // Get notification endpoints info
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getNotificationInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Contest Notification System");
        response.put("description", "Sends email notifications 12 hours before contests start");
        response.put("checkInterval", "Every 1 hour");
        response.put("notificationWindow", "11-13 hours before contest start");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("GET /stats", "Get notification statistics");
        endpoints.put("POST /send-immediate", "Send immediate notifications for testing");
        endpoints.put("POST /test-user?email=&name=", "Create test user");
        endpoints.put("POST /test-notification?email=", "Send test notification to user");
        endpoints.put("POST /test-email?email=", "Send test email");
        endpoints.put("POST /check-notifications", "Manually trigger notification check");
        endpoints.put("POST /retry-failed", "Retry failed notifications");
        endpoints.put("POST /cleanup", "Clean up old notifications");
        endpoints.put("GET /health", "Health check");
        endpoints.put("GET /info", "Get this information");
        
        response.put("endpoints", endpoints);
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
}
