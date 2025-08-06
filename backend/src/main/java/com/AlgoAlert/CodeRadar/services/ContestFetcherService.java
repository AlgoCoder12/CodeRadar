package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.Credentials;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ContestFetcherService {

    @Autowired
    private ContestService contestService;

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${clist.api.url}")
    private String clistApiUrl;

    // clist.by API credentials
    @Value("${clist.api.username}")
    private String clistUsername;
    @Value("${clist.api.key}")
    private String clistApiKey;

    public ContestFetcherService() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    // Scheduled method to fetch contests every 4 hours
    @Scheduled(fixedRate = 4 * 60 * 60 * 1000) // 4 hours in milliseconds
    public void fetchAllContests() {
        System.out.println("Starting scheduled contest fetch at: " + LocalDateTime.now());

        try {
            List<Contest> allContests = fetchContestsFromClist();

            // Save all fetched contests
            contestService.saveContests(allContests);

            // Clean up old contests (older than 30 days)
            contestService.deleteOldContests(30);

            System.out.println("Successfully fetched and saved " + allContests.size() + " contests");

        } catch (Exception e) {
            System.err.println("Error during scheduled contest fetch: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Manual fetch method for immediate updates
    public List<Contest> fetchContestsManually() {
        try {
            List<Contest> allContests = fetchContestsFromClist();
            contestService.saveContests(allContests);
            return allContests;
        } catch (Exception e) {
            System.err.println("Error during manual contest fetch: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Unified method to fetch contests from clist.by API
    public List<Contest> fetchContestsFromClist() {
        List<Contest> allContests = new ArrayList<>();

        // List of platform IDs from clist.by
        String[] platformIds = {
                "1",   // Codeforces
                "2",   // CodeChef
                "93",  // AtCoder
                "102", // LeetCode
                "63",  // HackerRank
                "73",  // HackerEarth
                "126", // GeeksforGeeks
                "111", // CS Academy
                "12",  // TopCoder
                "136", // Naukri.com/Code360
        };

        for (String platformId : platformIds) {
            try {
                List<Contest> platformContests = fetchContestsForPlatform(platformId);
                allContests.addAll(platformContests);
//                System.out.println("Fetched " + platformContests.size() + " contests for platform ID: " + platformId);
            } catch (Exception e) {
                System.err.println("Error fetching contests for platform ID " + platformId + ": " + e.getMessage());
            }
        }

        return allContests;
    }

    // Fetch contests for a specific platform using clist.by API
    private List<Contest> fetchContestsForPlatform(String platformId) {
        List<Contest> contests = new ArrayList<>();
        int maxRetries = 3;
        int retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                // Build the API URL with correct clist.by format
                String apiUrl = clistApiUrl + "contest/";

                // Get current time for upcoming contests filter
                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

                String queryParams = "resource_id=" + platformId +
                        "&start__gte=" + currentTime +
                        "&order_by=start" +
                        "&username=" + clistUsername +
                        "&api_key=" + clistApiKey;

                String fullUrl = apiUrl + "?" + queryParams;

                System.out.println("Fetching from: " + fullUrl);

                //Creates a request to the clist.by API
                Request request = new Request.Builder()
                        .url(fullUrl)
                        .addHeader("User-Agent", "Mozilla/5.0 (CodeRadar Contest Fetcher)")
                        .build();

                //Executes the request if its successful and the body is not null
                try (Response response = httpClient.newCall(request).execute()) {
                    if (response.isSuccessful() && response.body() != null) {
                        String responseBody = response.body().string();
                        JsonNode root = objectMapper.readTree(responseBody);

                        if (root.has("objects")) {
                            JsonNode contestsArray = root.get("objects");

                            for (JsonNode contestNode : contestsArray) {
                                try {
                                    Contest contest = parseContestFromClist(contestNode);
                                    if (contest != null) {
                                        contests.add(contest);
                                    }
                                } catch (Exception parseError) {
                                    System.err.println("Error parsing contest: " + parseError.getMessage());
                                }
                            }
                        } else if (root.has("detail")) {
                            // API error response
                            System.err.println("Clist API error for platform " + platformId + ": " + root.get("detail").asText());
                            if (root.get("detail").asText().contains("rate limit")) {
                                // Wait before retry for rate limiting
                                Thread.sleep(5000);
                            }
                        }
                        break; // Success, exit retry loop
                    } else {
                        System.err.println("Clist API returned status: " + response.code() + " for platform " + platformId);
                        if (response.code() == 429) { // Rate limited
                            Thread.sleep(5000);
                        }
                    }
                }

            } catch (Exception e) {
                System.err.println("Error fetching contests for platform " + platformId + " (attempt " + (retryCount + 1) + "): " + e.getMessage());
                retryCount++;
                if (retryCount < maxRetries) {
                    try {
                        Thread.sleep(2000 * retryCount); // Exponential backoff
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }

        return contests;
    }

    // Parse contest data from clist.by API response
    private Contest parseContestFromClist(JsonNode contestNode) {
        try {
            // Validate required fields
            if (!contestNode.has("event") || !contestNode.has("href") ||
                    !contestNode.has("start") || !contestNode.has("end") ||
                    !contestNode.has("resource")) {
                System.err.println("Missing required fields in contest data");
                return null;
            }

            String name = contestNode.get("event").asText().trim();
            String url = contestNode.get("href").asText().trim();
            String startTimeStr = contestNode.get("start").asText().trim();
            String endTimeStr = contestNode.get("end").asText().trim();

            // Get platform name from resource field
            String rawPlatform = contestNode.get("resource").asText().trim();
            String platform = mapPlatformName(rawPlatform);

            // Validate data quality
            if (name.isEmpty() || url.isEmpty() || startTimeStr.isEmpty() ||
                    endTimeStr.isEmpty() || platform.isEmpty()) {
                System.err.println("Empty required fields in contest data");
                return null;
            }

            // Parse start and end times
            LocalDateTime startTime = parseClistDateTime(startTimeStr);
            LocalDateTime endTime = parseClistDateTime(endTimeStr);

            if (startTime == null || endTime == null) {
                System.err.println("Invalid date format for contest: " + name);
                return null;
            }

            // Validate time logic
            if (startTime.isAfter(endTime)) {
                System.err.println("Start time is after end time for contest: " + name);
                return null;
            }

            // Only include future contests
            if (startTime.isAfter(LocalDateTime.now())) {
                long durationMinutes = java.time.Duration.between(startTime, endTime).toMinutes();

                // Validate duration (reasonable range: 15 minutes to 7 days)
                if (durationMinutes < 15 || durationMinutes > 10080) {
                    System.err.println("Unreasonable duration for contest: " + name + " (" + durationMinutes + " minutes)");
                    return null;
                }

                return Contest.builder()
                        .name(name)
                        .platform(platform)
                        .url(url)
                        .startTime(startTime)
                        .endTime(endTime)
                        .durationMinutes(Long.valueOf(durationMinutes))
                        .build();
            }

        } catch (Exception e) {
            System.err.println("Error parsing contest from clist: " + e.getMessage());
        }

        return null;
    }

    // Parse datetime from clist.by API format
    private LocalDateTime parseClistDateTime(String dateTimeStr) {
        try {
            // clist.by uses ISO 8601 format: "2024-01-01T15:00:00"
            if (dateTimeStr.contains("T")) {
                // Remove timezone info if present
                if (dateTimeStr.contains("+") || dateTimeStr.endsWith("Z")) {
                    dateTimeStr = dateTimeStr.substring(0, dateTimeStr.indexOf("T") + 9);
                }
                return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            }

            // Fallback for other formats
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(dateTimeStr, formatter);

        } catch (DateTimeParseException e) {
            System.err.println("Error parsing datetime: " + dateTimeStr);
            return null;
        }
    }

    // Individual platform methods for backward compatibility
    public List<Contest> fetchCodeforcesContests() {
        return fetchContestsForPlatform("1");
    }

    public List<Contest> fetchCodeChefContests() {
        return fetchContestsForPlatform("2");
    }

    public List<Contest> fetchAtCoderContests() {
        return fetchContestsForPlatform("93");
    }

    public List<Contest> fetchLeetCodeContests() {
        return fetchContestsForPlatform("102");
    }

    public List<Contest> fetchHackerRankContests() {
        return fetchContestsForPlatform("63");
    }

    public List<Contest> fetchHackerEarthContests() {
        return fetchContestsForPlatform("73");
    }

    public List<Contest> fetchGeeksforGeeksContests() {
        return fetchContestsForPlatform("126");
    }

    public List<Contest> fetchCSAcademyContests() {
        return fetchContestsForPlatform("111");
    }

    public List<Contest> fetchTopCoderContests() {
        return fetchContestsForPlatform("12");
    }

    public List<Contest> fetchNaukriCode360Contests() {
        return fetchContestsForPlatform("136");
    }

    public List<Contest> fetchCodinGameContests() {
        return fetchContestsForPlatform("81");
    }

    // Map raw platform names to readable display names
    private String mapPlatformName(String rawPlatform) {
        switch (rawPlatform.toLowerCase()) {
            case "codeforces.com":
                return "Codeforces";
            case "codechef.com":
                return "CodeChef";
            case "atcoder.jp":
                return "AtCoder";
            case "leetcode.com":
                return "LeetCode";
            case "hackerrank.com":
                return "HackerRank";
            case "hackerearth.com":
                return "HackerEarth";
            case "practice.geeksforgeeks.org":
                return "GeeksforGeeks";
            case "csacademy.com":
                return "CS Academy";
            case "topcoder.com":
                return "TopCoder";
            case "naukri.com/code360":
                return "Naukri Code360";
            case "codingame.com":
                return "CodinGame";
            default:
                // Capitalize first letter and return as-is for unknown platforms
                return rawPlatform.substring(0, 1).toUpperCase() + rawPlatform.substring(1);
        }
    }
}
