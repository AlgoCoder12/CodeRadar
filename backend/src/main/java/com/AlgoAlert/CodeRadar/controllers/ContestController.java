package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.AlgoAlert.CodeRadar.services.ContestService;
import com.AlgoAlert.CodeRadar.services.ContestFetcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contests")
@CrossOrigin(origins = "*")
public class ContestController {
    
    @Autowired
    private ContestService contestService;
    
    @Autowired
    private ContestFetcherService contestFetcherService;
    
    // Get all contests
    @GetMapping
    public ResponseEntity<List<Contest>> getAllContests() {
        try {
            List<Contest> contests = contestService.getAllContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get upcoming contests
    @GetMapping("/upcoming")
    public ResponseEntity<List<Contest>> getUpcomingContests() {
        try {
            List<Contest> contests = contestService.getUpcomingContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get active contests (currently running)
    @GetMapping("/active")
    public ResponseEntity<List<Contest>> getActiveContests() {
        try {
            List<Contest> contests = contestService.getActiveContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get contests by platform
    @GetMapping("/platform/{platform}")
    public ResponseEntity<List<Contest>> getContestsByPlatform(@PathVariable String platform) {
        try {
            List<Contest> contests = contestService.getContestsByPlatform(platform);
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get upcoming contests by platform
    @GetMapping("/upcoming/platform/{platform}")
    public ResponseEntity<List<Contest>> getUpcomingContestsByPlatform(@PathVariable String platform) {
        try {
            List<Contest> contests = contestService.getUpcomingContestsByPlatform(platform);
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get contests by multiple platforms
    @GetMapping("/platforms")
    public ResponseEntity<List<Contest>> getContestsByPlatforms(@RequestParam String platforms) {
        try {
            List<String> platformList = Arrays.asList(platforms.split(","));
            List<Contest> contests = contestService.getContestsByPlatforms(platformList);
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get contests within a date range
    @GetMapping("/range")
    public ResponseEntity<List<Contest>> getContestsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<Contest> contests = contestService.getContestsBetween(startTime, endTime);
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get contest by ID
    @GetMapping("/{id}")
    public ResponseEntity<Contest> getContestById(@PathVariable String id) {
        try {
            Optional<Contest> contest = contestService.getContestById(id);
            return contest.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Manual refresh - fetch contests from all platforms immediately
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshContests() {
        try {
            List<Contest> fetchedContests = contestFetcherService.fetchContestsManually();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contests refreshed successfully");
            response.put("fetchedCount", fetchedContests.size());
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to refresh contests");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get contest statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getContestStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalContests", contestService.getTotalContestCount());
            stats.put("upcomingContests", contestService.getUpcomingContestCount());
            
            // Get count by platform
            Map<String, Long> platformCounts = new HashMap<>();
            platformCounts.put("Codeforces", contestService.getContestCountByPlatform("Codeforces"));
            platformCounts.put("CodeChef", contestService.getContestCountByPlatform("CodeChef"));
            platformCounts.put("AtCoder", contestService.getContestCountByPlatform("AtCoder"));
            platformCounts.put("LeetCode", contestService.getContestCountByPlatform("LeetCode"));
            platformCounts.put("HackerRank", contestService.getContestCountByPlatform("HackerRank"));
            platformCounts.put("HackerEarth", contestService.getContestCountByPlatform("HackerEarth"));
            platformCounts.put("GeeksforGeeks", contestService.getContestCountByPlatform("GeeksforGeeks"));
            platformCounts.put("CS Academy", contestService.getContestCountByPlatform("CS Academy"));
            platformCounts.put("TopCoder", contestService.getContestCountByPlatform("TopCoder"));
            
            stats.put("platformCounts", platformCounts);
            stats.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get available platforms
    @GetMapping("/platforms/list")
    public ResponseEntity<List<String>> getAvailablePlatforms() {
        try {
            List<String> platforms = Arrays.asList(
                "Codeforces", "CodeChef", "AtCoder", "LeetCode", "HackerRank", "HackerEarth",
                "GeeksforGeeks", "CS Academy", "TopCoder"
            );
            return ResponseEntity.ok(platforms);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search contests by name
    @GetMapping("/search")
    public ResponseEntity<List<Contest>> searchContests(@RequestParam String query) {
        try {
            List<Contest> allContests = contestService.getAllContests();
            List<Contest> filteredContests = allContests.stream()
                    .filter(contest -> contest.getName().toLowerCase().contains(query.toLowerCase()))
                    .toList();
            
            return ResponseEntity.ok(filteredContests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create a new contest (admin endpoint)
    @PostMapping
    public ResponseEntity<Contest> createContest(@RequestBody Contest contest) {
        try {
            Contest savedContest = contestService.saveContest(contest);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedContest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update a contest (admin endpoint)
    @PutMapping("/{id}")
    public ResponseEntity<Contest> updateContest(@PathVariable String id, @RequestBody Contest contest) {
        try {
            Optional<Contest> existingContest = contestService.getContestById(id);
            if (existingContest.isPresent()) {
                contest.setId(id);
                Contest updatedContest = contestService.saveContest(contest);
                return ResponseEntity.ok(updatedContest);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Delete a contest (admin endpoint)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContest(@PathVariable String id) {
        try {
            Optional<Contest> contest = contestService.getContestById(id);
            if (contest.isPresent()) {
                contestService.deleteContestById(id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Contest deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete contest");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Contest Service");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
