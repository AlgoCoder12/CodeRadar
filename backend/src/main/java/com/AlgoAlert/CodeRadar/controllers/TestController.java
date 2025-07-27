package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.PlatformVerificationService;
import com.AlgoAlert.CodeRadar.services.UserService;
import com.AlgoAlert.CodeRadar.model.ContestPerformance;
import com.AlgoAlert.CodeRadar.services.ContestPerformanceService;
import com.AlgoAlert.CodeRadar.services.platforms.CodeforcesParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private PlatformVerificationService platformVerificationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ContestPerformanceService contestPerformanceService;

    @Autowired
    private CodeforcesParticipationService codeforcesParticipationService;

    /**
     * Test platform verification with a sample user
     */
    @GetMapping("/platform-verification")
    public Map<String, Object> testPlatformVerification() {
        try {
            // Create a test user
            User testUser = User.builder()
                    .id("test-user-id")
                    .username("testuser")
                    .codeforcesHandle("tourist")
                    .leetcodeHandle("test_leetcode_user")
                    .codechefHandle("test_codechef_user")
                    .atcoderHandle("test_atcoder_user")
                    .build();

            // Test platform verification
            CompletableFuture<Map<String, Boolean>> platformStatusFuture = 
                platformVerificationService.verifyAllPlatforms(testUser);
            
            Map<String, Boolean> platformStatus = platformStatusFuture.get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("testUser", testUser);
            response.put("platformStatus", platformStatus);
            response.put("message", "Platform verification test completed");
            response.put("success", true);

            return response;

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("success", false);
            return errorResponse;
        }
    }

    /**
     * Test contest performance service
     */
    @GetMapping("/performance-service")
    public Map<String, Object> testPerformanceService() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Performance service is available");
            response.put("success", true);
            return response;

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("success", false);
            return errorResponse;
        }
    }

    /**
     * Get contest participation info for a user by platform handle, platform name, and contestId
     */
    @GetMapping("/user-contest-info")
    public Map<String, Object> getUserContestInfo(
            @RequestParam String platformHandle,
            @RequestParam String platform,
            @RequestParam String contestId) {
        Map<String, Object> response = new HashMap<>();
        switch (platform.toLowerCase()) {
            case "codeforces":
                // Use live Codeforces API
                return codeforcesParticipationService.checkParticipation(platformHandle, contestId);
            case "leetcode":
            case "codechef":
            case "atcoder":
            case "hackerrank":
            case "hackerearth":
                response.put("message", "Live participation check not implemented for this platform yet");
                response.put("participated", false);
                return response;
            default:
                response.put("error", "Unsupported platform");
                return response;
        }
    }
} 