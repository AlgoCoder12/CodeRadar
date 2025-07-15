package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.AlgoAlert.CodeRadar.model.ContestPerformance;
import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ContestService contestService;

    @Autowired
    private ContestPerformanceService performanceService;

    @Autowired
    private PlatformVerificationService platformVerificationService;

    @Autowired
    private UserService userService;

    /**
     * Get user's dashboard data
     */
    @GetMapping("/overview")
    public ResponseEntity<?> getDashboardOverview() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> dashboardData = new HashMap<>();

            // Get upcoming contests
            List<Contest> upcomingContests = contestService.getUpcomingContests();
            dashboardData.put("upcomingContests", upcomingContests);

            // Get user's platform registration status
            CompletableFuture<Map<String, Boolean>> platformStatusFuture = 
                platformVerificationService.verifyAllPlatforms(user);
            
            Map<String, Boolean> platformStatus = platformStatusFuture.get();
            dashboardData.put("platformRegistrationStatus", platformStatus);

            // Get contests where user is not registered on the platform
            List<Map<String, Object>> missingRegistrations = getMissingRegistrations(user, upcomingContests, platformStatus);
            dashboardData.put("missingRegistrations", missingRegistrations);

            // Get user's performance statistics
            Map<String, Object> performanceStats = performanceService.getUserParticipationStats(user.getId());
            dashboardData.put("performanceStats", performanceStats);

            // Get recent performances
            List<ContestPerformance> recentPerformances = performanceService.getUserPerformances(user.getId())
                    .stream()
                    .limit(5)
                    .collect(Collectors.toList());
            dashboardData.put("recentPerformances", recentPerformances);

            return ResponseEntity.ok(dashboardData);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading dashboard: " + e.getMessage());
        }
    }

    /**
     * Get user's performance analytics
     */
    @GetMapping("/analytics")
    public ResponseEntity<?> getPerformanceAnalytics() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> analytics = performanceService.getUserPerformanceAnalytics(user.getId());
            return ResponseEntity.ok(analytics);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading analytics: " + e.getMessage());
        }
    }

    /**
     * Get contests by platform with registration status
     */
    @GetMapping("/contests/platform/{platform}")
    public ResponseEntity<?> getContestsByPlatform(@PathVariable String platform) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            List<Contest> platformContests = contestService.getUpcomingContestsByPlatform(platform);
            
            // Check if user is registered on this platform
            CompletableFuture<Boolean> isRegisteredFuture = 
                platformVerificationService.verifyPlatformRegistration(user, platform);
            boolean isRegistered = isRegisteredFuture.get();

            Map<String, Object> response = new HashMap<>();
            response.put("contests", platformContests);
            response.put("isRegisteredOnPlatform", isRegistered);
            response.put("platform", platform);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading platform contests: " + e.getMessage());
        }
    }

    /**
     * Track contest participation
     */
    @PostMapping("/track-participation")
    public ResponseEntity<?> trackContestParticipation(@RequestBody Map<String, Object> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            String contestId = (String) request.get("contestId");
            boolean participated = (Boolean) request.get("participated");
            Integer rank = (Integer) request.get("rank");
            Integer score = (Integer) request.get("score");
            Integer maxScore = (Integer) request.get("maxScore");

            // Get contest details
            Optional<Contest> contestOptional = contestService.getContestById(contestId);
            if (contestOptional.isEmpty()) {
                return ResponseEntity.status(404).body("Contest not found");
            }
            Contest contest = contestOptional.get();

            // Check if user was registered on the platform
            CompletableFuture<Boolean> wasRegisteredFuture = 
                platformVerificationService.verifyPlatformRegistration(user, contest.getPlatform());
            boolean wasRegistered = wasRegisteredFuture.get();

            // Track performance
            ContestPerformance performance = performanceService.trackPerformance(
                user.getId(), contestId, contest, wasRegistered, participated, rank, score, maxScore
            );

            return ResponseEntity.ok(performance);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error tracking participation: " + e.getMessage());
        }
    }

    /**
     * Get missing registrations for user
     */
    private List<Map<String, Object>> getMissingRegistrations(User user, List<Contest> contests, Map<String, Boolean> platformStatus) {
        List<Map<String, Object>> missingRegistrations = new ArrayList<>();

        for (Contest contest : contests) {
            String platform = contest.getPlatform();
            Boolean isRegistered = platformStatus.get(platform.toLowerCase());
            
            if (isRegistered != null && !isRegistered) {
                Map<String, Object> missingRegistration = new HashMap<>();
                missingRegistration.put("contest", contest);
                missingRegistration.put("platform", platform);
                missingRegistration.put("userHandle", getUserHandleForPlatform(user, platform));
                missingRegistrations.add(missingRegistration);
            }
        }

        return missingRegistrations;
    }

    /**
     * Get user's handle for a specific platform
     */
    private String getUserHandleForPlatform(User user, String platform) {
        switch (platform.toLowerCase()) {
            case "codeforces":
                return user.getCodeforcesHandle();
            case "leetcode":
                return user.getLeetcodeHandle();
            case "codechef":
                return user.getCodechefHandle();
            case "atcoder":
                return user.getAtcoderHandle();
            case "hackerrank":
                return user.getHackerrankHandle();
            case "hackerearth":
                return user.getHackerearthHandle();
            default:
                return null;
        }
    }

    /**
     * Test endpoint: Verify all platform registrations for the current user
     */
    @GetMapping("/test-platform-verification")
    public ResponseEntity<?> testPlatformVerification() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            Map<String, Boolean> platformStatus = platformVerificationService.verifyAllPlatforms(user).get();
            return ResponseEntity.ok(platformStatus);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying platforms: " + e.getMessage());
        }
    }

    @GetMapping("/platform-verify/{handle}/{platform}")
    public ResponseEntity<?> verifyPlatformByName(@PathVariable String handle, @PathVariable String platform) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            Boolean platformStatus = platformVerificationService.verifyPlatformHandle(handle, platform).get();
            return ResponseEntity.ok(platformStatus);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying platform: " + e.getMessage());
        }
    }

    /**
     * Comprehensive platform verification with contest data
     */
    @GetMapping("/platform-contests/{handle}/{platform}")
    public ResponseEntity<?> getPlatformContestsWithVerification(@PathVariable String handle, @PathVariable String platform) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            // Step 1: Verify username exists on the platform
            Boolean isValidHandle = platformVerificationService.verifyPlatformHandle(handle, platform).get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("platform", platform);
            response.put("handle", handle);
            response.put("isValidHandle", isValidHandle);

            if (!isValidHandle) {
                response.put("message", "❌ Username not found on " + platform + ". Please check your username.");
                response.put("contests", new ArrayList<>());
                return ResponseEntity.ok(response);
            }

            // Step 2: Get upcoming contests for this platform
            List<Contest> platformContests = contestService.getUpcomingContestsByPlatform(platform);
            
            // Step 3: Enhance contest data with user-specific information
            List<Map<String, Object>> enhancedContests = new ArrayList<>();
            for (Contest contest : platformContests) {
                Map<String, Object> contestData = new HashMap<>();
                contestData.put("id", contest.getId());
                contestData.put("name", contest.getName());
                contestData.put("platform", contest.getPlatform());
                contestData.put("url", contest.getUrl());
                contestData.put("startTime", contest.getStartTime());
                contestData.put("endTime", contest.getEndTime());
                contestData.put("duration", contest.getDurationMinutes());
                contestData.put("description", contest.getDescription());
                
                // Add time-based status
                contestData.put("status", getContestStatus(contest));
                contestData.put("timeUntilStart", getTimeUntilStart(contest));
                
                // Check if user has participated in this contest before
                List<ContestPerformance> pastPerformances = performanceService.getUserPerformancesByPlatform(user.getId(), platform);
                boolean hasParticipated = pastPerformances.stream()
                    .anyMatch(p -> contest.getName().equals(p.getContestName()));
                contestData.put("hasParticipatedBefore", hasParticipated);
                
                enhancedContests.add(contestData);
            }

            // Step 4: Add user statistics for this platform
            Map<String, Object> userStats = getUserPlatformStats(user.getId(), platform);
            
            response.put("message", "✅ Username verified successfully!");
            response.put("contests", enhancedContests);
            response.put("totalUpcomingContests", enhancedContests.size());
            response.put("userStats", userStats);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing request: " + e.getMessage());
        }
    }

    /**
     * Get user's platform-specific statistics
     */
    private Map<String, Object> getUserPlatformStats(String userId, String platform) {
        Map<String, Object> stats = new HashMap<>();
        
        List<ContestPerformance> platformPerformances = performanceService.getUserPerformancesByPlatform(userId, platform);
        
        stats.put("totalContestsParticipated", platformPerformances.size());
        
        if (!platformPerformances.isEmpty()) {
            // Calculate average rank
            double avgRank = platformPerformances.stream()
                .filter(p -> p.getRank() != null)
                .mapToInt(ContestPerformance::getRank)
                .average()
                .orElse(0.0);
            stats.put("averageRank", avgRank);
            
            // Calculate average score percentage
            double avgScore = platformPerformances.stream()
                .filter(p -> p.getScore() != null && p.getMaxScore() != null)
                .mapToDouble(p -> (double) p.getScore() / p.getMaxScore() * 100)
                .average()
                .orElse(0.0);
            stats.put("averageScorePercentage", avgScore);
            
            // Get latest performance
            ContestPerformance latest = platformPerformances.get(0);
            stats.put("latestContest", latest.getContestName());
            stats.put("latestRank", latest.getRank());
        } else {
            stats.put("averageRank", 0);
            stats.put("averageScorePercentage", 0);
            stats.put("latestContest", null);
            stats.put("latestRank", null);
        }
        
        return stats;
    }

    /**
     * Get contest status based on current time
     */
    private String getContestStatus(Contest contest) {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        if (contest.getStartTime().isAfter(now)) {
            return "upcoming";
        } else if (contest.getEndTime().isBefore(now)) {
            return "ended";
        } else {
            return "active";
        }
    }

    /**
     * Get time until contest starts
     */
    private String getTimeUntilStart(Contest contest) {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        if (contest.getStartTime().isAfter(now)) {
            java.time.Duration duration = java.time.Duration.between(now, contest.getStartTime());
            long days = duration.toDays();
            long hours = duration.toHours() % 24;
            long minutes = duration.toMinutes() % 60;
            
            if (days > 0) {
                return days + "d " + hours + "h " + minutes + "m";
            } else if (hours > 0) {
                return hours + "h " + minutes + "m";
            } else {
                return minutes + "m";
            }
        } else {
            return "Started";
        }
    }
} 