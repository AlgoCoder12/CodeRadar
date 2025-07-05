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

    // Manual refresh - fetch contests from clist.by API immediately
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshContests() {
        try {
            System.out.println("Manual contest refresh requested at: " + LocalDateTime.now());
            List<Contest> fetchedContests = contestFetcherService.fetchContestsManually();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contests refreshed successfully from clist.by API");
            response.put("fetchedCount", fetchedContests.size());
            response.put("timestamp", LocalDateTime.now());
            response.put("source", "clist.by API");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to refresh contests from clist.by API");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Refresh contests for a specific platform
    @PostMapping("/refresh/platform/{platform}")
    public ResponseEntity<Map<String, Object>> refreshContestsForPlatform(@PathVariable String platform) {
        try {
            System.out.println("Manual contest refresh requested for platform: " + platform + " at: " + LocalDateTime.now());

            List<Contest> fetchedContests;
            switch (platform.toLowerCase()) {
                case "codeforces":
                    fetchedContests = contestFetcherService.fetchCodeforcesContests();
                    break;
                case "codechef":
                    fetchedContests = contestFetcherService.fetchCodeChefContests();
                    break;
                case "atcoder":
                    fetchedContests = contestFetcherService.fetchAtCoderContests();
                    break;
                case "leetcode":
                    fetchedContests = contestFetcherService.fetchLeetCodeContests();
                    break;
                case "hackerrank":
                    fetchedContests = contestFetcherService.fetchHackerRankContests();
                    break;
                case "hackerearth":
                    fetchedContests = contestFetcherService.fetchHackerEarthContests();
                    break;
                case "geeksforgeeks":
                    fetchedContests = contestFetcherService.fetchGeeksforGeeksContests();
                    break;
                case "csacademy":
                    fetchedContests = contestFetcherService.fetchCSAcademyContests();
                    break;
                case "topcoder":
                    fetchedContests = contestFetcherService.fetchTopCoderContests();
                    break;
                case "naukri":
                case "code360":
                case "naukri-code360":
                    fetchedContests = contestFetcherService.fetchNaukriCode360Contests();
                    break;
                case "codingame":
                    fetchedContests = contestFetcherService.fetchCodinGameContests();
                    break;
                default:
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Unsupported platform");
                    errorResponse.put("supportedPlatforms", getAvailablePlatforms().getBody());
                    return ResponseEntity.badRequest().body(errorResponse);
            }

            // Save the fetched contests
            contestService.saveContests(fetchedContests);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contests refreshed successfully for " + platform + " from clist.by API");
            response.put("platform", platform);
            response.put("fetchedCount", fetchedContests.size());
            response.put("timestamp", LocalDateTime.now());
            response.put("source", "clist.by API");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to refresh contests for platform: " + platform);
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
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
            stats.put("activeContests", contestService.getActiveContestCount());

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
            platformCounts.put("Naukri Code360", contestService.getContestCountByPlatform("Naukri Code360"));
            platformCounts.put("CodinGame", contestService.getContestCountByPlatform("CodinGame"));

            stats.put("platformCounts", platformCounts);
            stats.put("timestamp", LocalDateTime.now());
            stats.put("dataSource", "clist.by API");

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
                    "GeeksforGeeks", "CS Academy", "TopCoder", "Naukri Code360", "CodinGame"
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
        response.put("dataSource", "clist.by API");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // Get API information
    @GetMapping("/api-info")
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("service", "CodeRadar Contest Service");
        info.put("dataSource", "clist.by API");
        info.put("version", "2.0");
        info.put("description", "Contest fetching service using clist.by API");
        info.put("supportedPlatforms", getAvailablePlatforms().getBody());
        info.put("endpoints", Arrays.asList(
                "GET /api/contests - Get all contests",
                "GET /api/contests/upcoming - Get upcoming contests",
                "GET /api/contests/active - Get active contests",
                "GET /api/contests/platform/{platform} - Get contests by platform",
                "POST /api/contests/refresh - Refresh all contests from clist.by API",
                "POST /api/contests/refresh/platform/{platform} - Refresh contests for specific platform",
                "GET /api/contests/stats - Get contest statistics"
        ));
        info.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(info);
    }
}
