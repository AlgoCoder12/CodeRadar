package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
        
        List<Contest> allContests = new ArrayList<>();
        // Map to track contests per platform
        java.util.Map<String, List<Contest>> platformContests = new java.util.LinkedHashMap<>();
        
        try {
            List<Contest> codeforces = fetchCodeforcesContests();
            List<Contest> codechef = fetchCodeChefContests();
            List<Contest> atcoder = fetchAtCoderContests();
            List<Contest> leetcode = fetchLeetCodeContests();
            List<Contest> hackerrank = fetchHackerRankContests();
            List<Contest> hackerearth = fetchHackerEarthContests();
            List<Contest> gfg = fetchGeeksforGeeksContests();
            List<Contest> csacademy = fetchCSAcademyContests();
            List<Contest> topcoder = fetchTopCoderContests();
            
            platformContests.put("Codeforces", codeforces);
            platformContests.put("CodeChef", codechef);
            platformContests.put("AtCoder", atcoder);
            platformContests.put("LeetCode", leetcode);
            platformContests.put("HackerRank", hackerrank);
            platformContests.put("HackerEarth", hackerearth);
            platformContests.put("GeeksforGeeks", gfg);
            platformContests.put("CS Academy", csacademy);
            platformContests.put("TopCoder", topcoder);
            
            allContests.addAll(codeforces);
            allContests.addAll(codechef);
            allContests.addAll(atcoder);
            allContests.addAll(leetcode);
            allContests.addAll(hackerrank);
            allContests.addAll(hackerearth);
            allContests.addAll(gfg);
            allContests.addAll(csacademy);
            allContests.addAll(topcoder);
            
            // Save all fetched contests
            contestService.saveContests(allContests);
            
            // Clean up old contests (older than 30 days)
            contestService.deleteOldContests(30);
            
            // Log platforms with no upcoming contests
            platformContests.forEach((platform, contests) -> {
                if (contests.isEmpty()) {
                    System.out.println("No upcoming contests found for platform: " + platform);
                }
            });
            
            System.out.println("Successfully fetched and saved " + allContests.size() + " contests");
            
        } catch (Exception e) {
            System.err.println("Error during scheduled contest fetch: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Manual fetch method for immediate updates
    public List<Contest> fetchContestsManually() {
        List<Contest> allContests = new ArrayList<>();
        java.util.Map<String, List<Contest>> platformContests = new java.util.LinkedHashMap<>();
        try {
            List<Contest> codeforces = fetchCodeforcesContests();
            List<Contest> codechef = fetchCodeChefContests();
            List<Contest> atcoder = fetchAtCoderContests();
            List<Contest> leetcode = fetchLeetCodeContests();
            List<Contest> hackerrank = fetchHackerRankContests();
            List<Contest> hackerearth = fetchHackerEarthContests();
            List<Contest> gfg = fetchGeeksforGeeksContests();
            List<Contest> csacademy = fetchCSAcademyContests();
            List<Contest> topcoder = fetchTopCoderContests();
            
            platformContests.put("Codeforces", codeforces);
            platformContests.put("CodeChef", codechef);
            platformContests.put("AtCoder", atcoder);
            platformContests.put("LeetCode", leetcode);
            platformContests.put("HackerRank", hackerrank);
            platformContests.put("HackerEarth", hackerearth);
            platformContests.put("GeeksforGeeks", gfg);
            platformContests.put("CS Academy", csacademy);
            platformContests.put("TopCoder", topcoder);
            
            allContests.addAll(codeforces);
            allContests.addAll(codechef);
            allContests.addAll(atcoder);
            allContests.addAll(leetcode);
            allContests.addAll(hackerrank);
            allContests.addAll(hackerearth);
            allContests.addAll(gfg);
            allContests.addAll(csacademy);
            allContests.addAll(topcoder);
            
            contestService.saveContests(allContests);
            
            // Log platforms with no upcoming contests
            platformContests.forEach((platform, contests) -> {
                if (contests.isEmpty()) {
                    System.out.println("No upcoming contests found for platform: " + platform);
                }
            });
            
        } catch (Exception e) {
            System.err.println("Error during manual contest fetch: " + e.getMessage());
            e.printStackTrace();
        }
        
        return allContests;
    }
    
    // Fetch Codeforces contests using their API
    public List<Contest> fetchCodeforcesContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            Request request = new Request.Builder()
                    .url("https://codeforces.com/api/contest.list")
                    .build();
            
            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    String responseBody = response.body().string();
                    JsonNode root = objectMapper.readTree(responseBody);
                    
                    if (root.has("result")) {
                        JsonNode contestsArray = root.get("result");
                        
                        for (JsonNode contestNode : contestsArray) {
                            if (contestNode.has("phase") && 
                                "BEFORE".equals(contestNode.get("phase").asText())) {
                                
                                String name = contestNode.get("name").asText();
                                long startTimeSeconds = contestNode.get("startTimeSeconds").asLong();
                                long durationSeconds = contestNode.get("durationSeconds").asLong();
                                
                                LocalDateTime startTime = LocalDateTime.ofEpochSecond(startTimeSeconds, 0, 
                                    java.time.ZoneOffset.UTC);
                                LocalDateTime endTime = startTime.plusSeconds(durationSeconds);
                                
                                String url = "https://codeforces.com/contest/" + contestNode.get("id").asText();
                                
                                Contest contest = Contest.builder()
                                        .name(name)
                                        .platform("Codeforces")
                                        .url(url)
                                        .startTime(startTime)
                                        .endTime(endTime)
                                        .durationMinutes(Long.valueOf(durationSeconds / 60))
                                        .build();
                                contests.add(contest);
                            }
                        }
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching Codeforces contests: " + e.getMessage());
        }
        
        return contests;
    }
    
    // Fetch CodeChef contests (using web scraping as they don't have public API)
    public List<Contest> fetchCodeChefContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            Document doc = Jsoup.connect("https://www.codechef.com/contests")
                    .timeout(30000)
                    .get();
            
            // Parse upcoming contests table
            Elements contestRows = doc.select("table.dataTable tbody tr");
            
            for (Element row : contestRows) {
                Elements cells = row.select("td");
                if (cells.size() >= 4) {
                    String name = cells.get(0).text().trim();
                    String startTimeStr = cells.get(2).text().trim();
                    String endTimeStr = cells.get(3).text().trim();
                    
                    // Parse dates (CodeChef uses specific format)
                    // This is a simplified parsing - in production, you'd want more robust date parsing
                    try {
                        LocalDateTime startTime = parseCodeChefDate(startTimeStr);
                        LocalDateTime endTime = parseCodeChefDate(endTimeStr);
                        
                        if (startTime != null && endTime != null && startTime.isAfter(LocalDateTime.now())) {
                            String url = "https://www.codechef.com/contests/" + 
                                name.toLowerCase().replaceAll("\\s+", "-");
                            
                            long duration = java.time.Duration.between(startTime, endTime).toMinutes();
                            
                            Contest contest = Contest.builder()
                                    .name(name)
                                    .platform("CodeChef")
                                    .url(url)
                                    .startTime(startTime)
                                    .endTime(endTime)
                                    .durationMinutes(Long.valueOf(duration))
                                    .build();
                            contests.add(contest);
                        }
                    } catch (Exception dateParseError) {
                        System.err.println("Error parsing CodeChef date for contest: " + name);
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching CodeChef contests: " + e.getMessage());
        }
        
        return contests;
    }
    
    // Fetch AtCoder contests
    public List<Contest> fetchAtCoderContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            Document doc = Jsoup.connect("https://atcoder.jp/contests/")
                    .timeout(30000)
                    .get();
            
            // Parse upcoming contests
            Elements contestRows = doc.select("div#contest-table-upcoming table tbody tr");
            
            for (Element row : contestRows) {
                Elements cells = row.select("td");
                if (cells.size() >= 4) {
                    String startTimeStr = cells.get(0).text().trim();
                    String name = cells.get(1).select("a").text().trim();
                    String duration = cells.get(2).text().trim();
                    
                    try {
                        LocalDateTime startTime = parseAtCoderDate(startTimeStr);
                        long durationMinutes = parseAtCoderDuration(duration);
                        LocalDateTime endTime = startTime.plusMinutes(durationMinutes);
                        
                        String contestLink = cells.get(1).select("a").attr("href");
                        String url = "https://atcoder.jp" + contestLink;
                        
                        Contest contest = Contest.builder()
                                .name(name)
                                .platform("AtCoder")
                                .url(url)
                                .startTime(startTime)
                                .endTime(endTime)
                                .durationMinutes(Long.valueOf(durationMinutes))
                                .build();
                        contests.add(contest);
                        
                    } catch (Exception dateParseError) {
                        System.err.println("Error parsing AtCoder date for contest: " + name);
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching AtCoder contests: " + e.getMessage());
        }
        
        return contests;
    }
    
    // Fetch LeetCode contests using their GraphQL API
    public List<Contest> fetchLeetCodeContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            // LeetCode GraphQL endpoint
            String graphqlQuery = "{\"query\":\"query{\\n  allContests {\\n    title\\n    titleSlug\\n    startTime\\n    duration\\n    originStartTime\\n    isVirtual\\n    __typename\\n  }\\n}\",\"variables\":{}}";            
            
            Request request = new Request.Builder()
                    .url("https://leetcode.com/graphql/")
                    .post(okhttp3.RequestBody.create(
                        okhttp3.MediaType.parse("application/json"), 
                        graphqlQuery))
                    .addHeader("Content-Type", "application/json")
                    .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .addHeader("Referer", "https://leetcode.com/contest/")
                    .build();
            
            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    String responseBody = response.body().string();
                    JsonNode root = objectMapper.readTree(responseBody);
                    
                    if (root.has("data") && root.get("data").has("allContests")) {
                        JsonNode contestsArray = root.get("data").get("allContests");
                        
                        for (JsonNode contestNode : contestsArray) {
                            if (!contestNode.get("isVirtual").asBoolean()) {
                                String title = contestNode.get("title").asText();
                                String titleSlug = contestNode.get("titleSlug").asText();
                                long startTimeSeconds = contestNode.get("startTime").asLong();
                                long durationSeconds = contestNode.get("duration").asLong();
                                
                                LocalDateTime startTime = LocalDateTime.ofEpochSecond(startTimeSeconds, 0, 
                                    java.time.ZoneOffset.UTC);
                                
                                // Only include future contests
                                if (startTime.isAfter(LocalDateTime.now())) {
                                    LocalDateTime endTime = startTime.plusSeconds(durationSeconds);
                                    String url = "https://leetcode.com/contest/" + titleSlug + "/";
                                    
                                    Contest contest = Contest.builder()
                                            .name(title)
                                            .platform("LeetCode")
                                            .url(url)
                                            .startTime(startTime)
                                            .endTime(endTime)
                                            .durationMinutes(Long.valueOf(durationSeconds / 60))
                                            .build();
                                    contests.add(contest);
                                }
                            }
                        }
                    }
                } else {
                    System.err.println("LeetCode API returned status: " + response.code());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching LeetCode contests: " + e.getMessage());
        }
        
        return contests;
    }
    
    // Fetch HackerRank contests using web scraping
    public List<Contest> fetchHackerRankContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            // HackerRank contests page with proper headers
            Document doc = Jsoup.connect("https://www.hackerrank.com/contests")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.5")
                    .timeout(30000)
                    .get();
            
            // Parse upcoming contests section
            Elements contestElements = doc.select(".contest-item, .challenge-list-item, .contest-card");
            
            for (Element contestElement : contestElements) {
                try {
                    String name = "";
                    String url = "";
                    String startTimeStr = "";
                    String endTimeStr = "";
                    
                    // Try different selectors based on HackerRank's HTML structure
                    Element titleElement = contestElement.selectFirst(".challenge-name a, .contest-title a, h4 a");
                    if (titleElement != null) {
                        name = titleElement.text().trim();
                        url = "https://www.hackerrank.com" + titleElement.attr("href");
                    }
                    
                    Element timeElement = contestElement.selectFirst(".challenge-time, .contest-time, .time-info");
                    if (timeElement != null) {
                        String timeText = timeElement.text();
                        // Parse time information from HackerRank format
                        // This would need to be adapted based on their current format
                    }
                    
                    // If we have valid contest data and it's a future contest
                    if (!name.isEmpty() && !url.isEmpty()) {
                        // For now, create a placeholder with approximate timing
                        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
                        LocalDateTime endTime = startTime.plusHours(2);
                        
                        Contest contest = Contest.builder()
                                .name(name)
                                .platform("HackerRank")
                                .url(url)
                                .startTime(startTime)
                                .endTime(endTime)
                                .durationMinutes(Long.valueOf(120L))
                                .build();
                        contests.add(contest);
                    }
                    
                } catch (Exception contestParseError) {
                    System.err.println("Error parsing individual HackerRank contest: " + contestParseError.getMessage());
                }
            }
            
            // Alternative approach: Try to use HackerRank's API if available
            if (contests.isEmpty()) {
                try {
                    Request apiRequest = new Request.Builder()
                            .url("https://www.hackerrank.com/rest/contests/upcoming")
                            .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                            .addHeader("Accept", "application/json")
                            .build();
                    
                    try (Response response = httpClient.newCall(apiRequest).execute()) {
                        if (response.isSuccessful() && response.body() != null) {
                            String responseBody = response.body().string();
                            JsonNode root = objectMapper.readTree(responseBody);
                            
                            if (root.has("models")) {
                                JsonNode contestsArray = root.get("models");
                                
                                for (JsonNode contestNode : contestsArray) {
                                    String contestName = contestNode.get("name").asText();
                                    String contestSlug = contestNode.get("slug").asText();
                                    String startTimeEpoch = contestNode.get("start_time").asText();
                                    String endTimeEpoch = contestNode.get("end_time").asText();
                                    
                                    try {
                                        LocalDateTime startTime = parseHackerRankTime(startTimeEpoch);
                                        LocalDateTime endTime = parseHackerRankTime(endTimeEpoch);
                                        
                                        if (startTime != null && endTime != null && startTime.isAfter(LocalDateTime.now())) {
                                            String contestUrl = "https://www.hackerrank.com/contests/" + contestSlug;
                                            long duration = java.time.Duration.between(startTime, endTime).toMinutes();
                                            
                                            Contest contest = Contest.builder()
                                                    .name(contestName)
                                                    .platform("HackerRank")
                                                    .url(contestUrl)
                                                    .startTime(startTime)
                                                    .endTime(endTime)
                                                    .durationMinutes(Long.valueOf(duration))
                                                    .build();
                                            contests.add(contest);
                                        }
                                    } catch (Exception timeParseError) {
                                        System.err.println("Error parsing HackerRank time for: " + contestName);
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception apiError) {
                    System.err.println("HackerRank API approach failed: " + apiError.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching HackerRank contests: " + e.getMessage());
        }
        
        return contests;
    }
    
    // Fetch HackerEarth contests
    public List<Contest> fetchHackerEarthContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            // Try HackerEarth API first
            try {
                Request apiRequest = new Request.Builder()
                        .url("https://www.hackerearth.com/api/v4/events/upcoming/")
                        .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .addHeader("Accept", "application/json")
                        .build();
                
                try (Response response = httpClient.newCall(apiRequest).execute()) {
                    if (response.isSuccessful() && response.body() != null) {
                        String responseBody = response.body().string();
                        JsonNode root = objectMapper.readTree(responseBody);
                        
                        if (root.has("response")) {
                            JsonNode eventsArray = root.get("response");
                            
                            for (JsonNode eventNode : eventsArray) {
                                if (eventNode.has("event") && eventNode.get("event").has("type") &&
                                    "contest".equalsIgnoreCase(eventNode.get("event").get("type").asText())) {
                                    
                                    JsonNode event = eventNode.get("event");
                                    String name = event.get("title").asText();
                                    String slug = event.get("slug").asText();
                                    String startTimeStr = event.get("start_tz").asText();
                                    String endTimeStr = event.get("end_tz").asText();
                                    
                                    try {
                                        LocalDateTime startTime = parseHackerEarthTime(startTimeStr);
                                        LocalDateTime endTime = parseHackerEarthTime(endTimeStr);
                                        
                                        if (startTime != null && endTime != null && startTime.isAfter(LocalDateTime.now())) {
                                            String url = "https://www.hackerearth.com/challenges/competitive/" + slug + "/";
                                            long duration = java.time.Duration.between(startTime, endTime).toMinutes();
                                            
                                            Contest contest = Contest.builder()
                                                    .name(name)
                                                    .platform("HackerEarth")
                                                    .url(url)
                                                    .startTime(startTime)
                                                    .endTime(endTime)
                                                    .durationMinutes(Long.valueOf(duration))
                                                    .build();
                                            contests.add(contest);
                                        }
                                    } catch (Exception timeParseError) {
                                        System.err.println("Error parsing HackerEarth time for: " + name);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception apiError) {
                System.err.println("HackerEarth API approach failed, trying web scraping: " + apiError.getMessage());
            }
            
            // Fallback to web scraping if API fails
            if (contests.isEmpty()) {
                try {
                    Document doc = Jsoup.connect("https://www.hackerearth.com/challenges/")
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                            .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                            .header("Accept-Language", "en-US,en;q=0.5")
                            .timeout(30000)
                            .get();
                    
                    // Parse contest cards
                    Elements contestCards = doc.select(".challenge-card, .event-card, .contest-item");
                    
                    for (Element card : contestCards) {
                        try {
                            Element titleElement = card.selectFirst(".challenge-card-title a, .event-title a, h3 a");
                            Element timeElement = card.selectFirst(".challenge-time, .event-time, .time-remaining");
                            Element typeElement = card.selectFirst(".challenge-type, .event-type");
                            
                            if (titleElement != null && typeElement != null && 
                                typeElement.text().toLowerCase().contains("contest")) {
                                
                                String name = titleElement.text().trim();
                                String url = titleElement.attr("href");
                                
                                if (!url.startsWith("http")) {
                                    url = "https://www.hackerearth.com" + url;
                                }
                                
                                // Extract time information if available
                                LocalDateTime startTime = LocalDateTime.now().plusDays(1); // Default
                                LocalDateTime endTime = startTime.plusHours(3); // Default 3 hours
                                
                                if (timeElement != null) {
                                    String timeText = timeElement.text();
                                    // Try to parse relative time ("Starts in 2 days", "Ends in 5 hours", etc.)
                                    startTime = parseHackerEarthRelativeTime(timeText);
                                    endTime = startTime.plusHours(3); // Default duration
                                }
                                
                                if (startTime.isAfter(LocalDateTime.now())) {
                                    Contest contest = Contest.builder()
                                            .name(name)
                                            .platform("HackerEarth")
                                            .url(url)
                                            .startTime(startTime)
                                            .endTime(endTime)
                                            .durationMinutes(Long.valueOf(180L))
                                            .build();
                                    contests.add(contest);
                                }
                            }
                        } catch (Exception cardParseError) {
                            System.err.println("Error parsing HackerEarth contest card: " + cardParseError.getMessage());
                        }
                    }
                } catch (Exception scrapingError) {
                    System.err.println("HackerEarth web scraping failed: " + scrapingError.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching HackerEarth contests: " + e.getMessage());
        }
        
        return contests;
    }
    
    // Helper method to parse CodeChef dates
    private LocalDateTime parseCodeChefDate(String dateStr) {
        try {
            // CodeChef date format: "01 Jan 2024, 15:00"
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
            return LocalDateTime.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    // Helper method to parse AtCoder dates
    private LocalDateTime parseAtCoderDate(String dateStr) {
        try {
            // AtCoder date format: "2024-01-01 15:00:00+0900"
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssxxxx");
            return LocalDateTime.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    // Helper method to parse AtCoder duration
    private long parseAtCoderDuration(String durationStr) {
        try {
            // AtCoder duration format: "01:40" (hours:minutes)
            String[] parts = durationStr.split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            return hours * 60L + minutes;
        } catch (Exception e) {
            return 120; // Default 2 hours
        }
    }
    
    // Helper method to parse HackerRank time
    private LocalDateTime parseHackerRankTime(String timeStr) {
        try {
            // HackerRank time formats can vary
            // Try different formats
            
            // Format 1: ISO 8601 timestamp
            if (timeStr.contains("T")) {
                return LocalDateTime.parse(timeStr.substring(0, 19));
            }
            
            // Format 2: Epoch timestamp
            if (timeStr.matches("\\d+")) {
                long epoch = Long.parseLong(timeStr);
                return LocalDateTime.ofEpochSecond(epoch, 0, java.time.ZoneOffset.UTC);
            }
            
            // Format 3: Standard date format
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(timeStr, formatter);
            
        } catch (Exception e) {
            System.err.println("Error parsing HackerRank time: " + timeStr);
            return null;
        }
    }
    
    // Helper method to parse HackerEarth time
    private LocalDateTime parseHackerEarthTime(String timeStr) {
        try {
            // HackerEarth time format: "2024-01-01T15:00:00Z" or similar
            if (timeStr.endsWith("Z")) {
                return LocalDateTime.parse(timeStr.substring(0, timeStr.length() - 1));
            }
            
            // Try ISO format
            if (timeStr.contains("T")) {
                return LocalDateTime.parse(timeStr.substring(0, 19));
            }
            
            // Try standard format
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(timeStr, formatter);
            
        } catch (Exception e) {
            System.err.println("Error parsing HackerEarth time: " + timeStr);
            return null;
        }
    }
    
    // Helper method to parse HackerEarth relative time
    private LocalDateTime parseHackerEarthRelativeTime(String timeText) {
        try {
            LocalDateTime now = LocalDateTime.now();
            timeText = timeText.toLowerCase();
            
            if (timeText.contains("starts in")) {
                // Extract number and unit
                String[] parts = timeText.split("\\s+");
                for (int i = 0; i < parts.length - 1; i++) {
                    if (parts[i].matches("\\d+")) {
                        int amount = Integer.parseInt(parts[i]);
                        String unit = parts[i + 1];
                        
                        if (unit.contains("day")) {
                            return now.plusDays(amount);
                        } else if (unit.contains("hour")) {
                            return now.plusHours(amount);
                        } else if (unit.contains("minute")) {
                            return now.plusMinutes(amount);
                        }
                    }
                }
            }
            
            // Default to 1 day from now
            return now.plusDays(1);
            
        } catch (Exception e) {
            return LocalDateTime.now().plusDays(1);
        }
    }
    
    // Fetch GeeksforGeeks contests
    public List<Contest> fetchGeeksforGeeksContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            System.out.println("Fetching GeeksforGeeks contests...");
            
            // Try multiple URLs for GeeksforGeeks contests
            String[] gfgUrls = {
                "https://practice.geeksforgeeks.org/events/",
                "https://www.geeksforgeeks.org/events/",
                "https://practice.geeksforgeeks.org/contest/"
            };
            
            for (String gfgUrl : gfgUrls) {
                try {
                    Document doc = Jsoup.connect(gfgUrl)
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                            .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                            .header("Accept-Language", "en-US,en;q=0.9")
                            .timeout(30000)
                            .get();
                    
                    // Parse various possible contest card structures
                    Elements contestCards = doc.select(".event-card, .contest-card, .practice-event, .gfg-contest-card, .contest-item, .event-item");
                    
                    if (contestCards.isEmpty()) {
                        // Try alternative selectors
                        contestCards = doc.select("[class*='contest'], [class*='event'], [class*='competition']");
                    }
                    
                    System.out.println("Found " + contestCards.size() + " potential contest elements on " + gfgUrl);
                    
                    for (Element card : contestCards) {
                        try {
                            String name = "";
                            String url = "";
                            LocalDateTime startTime = LocalDateTime.now().plusDays(1);
                            LocalDateTime endTime = startTime.plusHours(2);
                            
                            // Try multiple selectors for title
                            Element titleElement = card.selectFirst(".event-title, .contest-title, .title, h3, h4, h2, .heading, .name");
                            if (titleElement == null) {
                                titleElement = card.selectFirst("a");
                            }
                            
                            if (titleElement != null) {
                                name = titleElement.text().trim();
                            }
                            
                            // Try multiple selectors for link
                            Element linkElement = card.selectFirst("a[href]");
                            if (linkElement != null) {
                                url = linkElement.attr("href");
                                if (!url.startsWith("http")) {
                                    url = "https://practice.geeksforgeeks.org" + url;
                                }
                            }
                            
                            // Try to find time information
                            Element timeElement = card.selectFirst(".event-time, .contest-time, .time-info, .time, .date-time, .schedule");
                            if (timeElement != null) {
                                String timeText = timeElement.text();
                                startTime = parseGeeksforGeeksTime(timeText);
                                endTime = startTime.plusHours(2);
                            }
                            
                            // Only add if we have valid contest information
                            if (!name.isEmpty() && !url.isEmpty() && 
                                startTime.isAfter(LocalDateTime.now()) &&
                                (name.toLowerCase().contains("contest") || 
                                 name.toLowerCase().contains("competition") ||
                                 name.toLowerCase().contains("challenge"))) {
                                
                                Contest contest = Contest.builder()
                                        .name(name)
                                        .platform("GeeksforGeeks")
                                        .url(url)
                                        .startTime(startTime)
                                        .endTime(endTime)
                                        .durationMinutes(Long.valueOf(120L))
                                        .build();
                                contests.add(contest);
                                System.out.println("Added GeeksforGeeks contest: " + name);
                            }
                        } catch (Exception cardParseError) {
                            System.err.println("Error parsing GeeksforGeeks contest card: " + cardParseError.getMessage());
                        }
                    }
                    
                    // If we found contests, break from URL loop
                    if (!contests.isEmpty()) {
                        break;
                    }
                    
                } catch (Exception urlError) {
                    System.err.println("Error fetching from " + gfgUrl + ": " + urlError.getMessage());
                }
            }
            
            // If no contests found through scraping, add some sample contests for testing
            if (contests.isEmpty()) {
                System.out.println("No GeeksforGeeks contests found via scraping, adding sample contests...");
                LocalDateTime sampleStart = LocalDateTime.now().plusDays(2);
                Contest sampleContest = Contest.builder()
                        .name("GeeksforGeeks Weekly Contest")
                        .platform("GeeksforGeeks")
                        .url("https://practice.geeksforgeeks.org/contest/")
                        .startTime(sampleStart)
                        .endTime(sampleStart.plusHours(2))
                        .durationMinutes(Long.valueOf(120L))
                        .build();
                contests.add(sampleContest);
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching GeeksforGeeks contests: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("GeeksforGeeks contests fetched: " + contests.size());
        return contests;
    }
    
    // Fetch CS Academy contests
    public List<Contest> fetchCSAcademyContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            System.out.println("Fetching CS Academy contests...");
            
            // Try multiple approaches for CS Academy
            String[] csUrls = {
                "https://csacademy.com/contests/",
                "https://csacademy.com/contest/",
                "https://csacademy.com/"
            };
            
            for (String csUrl : csUrls) {
                try {
                    Document doc = Jsoup.connect(csUrl)
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                            .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                            .header("Accept-Language", "en-US,en;q=0.9")
                            .timeout(30000)
                            .get();
                    
                    // Try different selectors for contest elements
                    Elements contestElements = doc.select(".contest-row, .upcoming-contest, tr, .contest-item, .challenge-row");
                    
                    if (contestElements.isEmpty()) {
                        // Try broader selectors
                        contestElements = doc.select("[class*='contest'], [class*='challenge'], table tr");
                    }
                    
                    System.out.println("Found " + contestElements.size() + " potential contest elements on " + csUrl);
                    
                    for (Element element : contestElements) {
                        try {
                            String name = "";
                            String url = "";
                            LocalDateTime startTime = LocalDateTime.now().plusDays(1);
                            LocalDateTime endTime = startTime.plusHours(2);
                            long duration = 120L;
                            
                            // Try to extract contest name
                            Elements cells = element.select("td");
                            if (cells.size() >= 3) {
                                // Table row format
                                name = cells.get(0).text().trim();
                                String startTimeStr = cells.get(1).text().trim();
                                String durationStr = cells.get(2).text().trim();
                                
                                Element linkElement = cells.get(0).selectFirst("a");
                                if (linkElement != null) {
                                    url = linkElement.attr("href");
                                    if (!url.startsWith("http")) {
                                        url = "https://csacademy.com" + url;
                                    }
                                } else {
                                    url = "https://csacademy.com/contest/" + name.toLowerCase().replaceAll("\\s+", "-");
                                }
                                
                                try {
                                    startTime = parseCSAcademyTime(startTimeStr);
                                    duration = parseCSAcademyDuration(durationStr);
                                    endTime = startTime.plusMinutes(duration);
                                } catch (Exception timeParseError) {
                                    System.err.println("Error parsing CS Academy time for: " + name);
                                }
                            } else {
                                // Try different structure
                                Element titleElement = element.selectFirst(".contest-title, .challenge-title, .title, h3, h4, a");
                                if (titleElement != null) {
                                    name = titleElement.text().trim();
                                    if (titleElement.tagName().equals("a")) {
                                        url = titleElement.attr("href");
                                        if (!url.startsWith("http")) {
                                            url = "https://csacademy.com" + url;
                                        }
                                    }
                                }
                            }
                            
                            // Only add if we have valid contest information
                            if (!name.isEmpty() && !url.isEmpty() && 
                                startTime.isAfter(LocalDateTime.now()) &&
                                (name.toLowerCase().contains("contest") || 
                                 name.toLowerCase().contains("round") ||
                                 name.toLowerCase().contains("competition"))) {
                                
                                Contest contest = Contest.builder()
                                        .name(name)
                                        .platform("CS Academy")
                                        .url(url)
                                        .startTime(startTime)
                                        .endTime(endTime)
                                        .durationMinutes(Long.valueOf(duration))
                                        .build();
                                contests.add(contest);
                                System.out.println("Added CS Academy contest: " + name);
                            }
                        } catch (Exception elementParseError) {
                            System.err.println("Error parsing CS Academy element: " + elementParseError.getMessage());
                        }
                    }
                    
                    // If we found contests, break from URL loop
                    if (!contests.isEmpty()) {
                        break;
                    }
                    
                } catch (Exception urlError) {
                    System.err.println("Error fetching from " + csUrl + ": " + urlError.getMessage());
                }
            }
            
            // If no contests found through scraping, add sample contest for testing
            if (contests.isEmpty()) {
                System.out.println("No CS Academy contests found via scraping, adding sample contest...");
                LocalDateTime sampleStart = LocalDateTime.now().plusDays(3);
                Contest sampleContest = Contest.builder()
                        .name("CS Academy Round")
                        .platform("CS Academy")
                        .url("https://csacademy.com/contests/")
                        .startTime(sampleStart)
                        .endTime(sampleStart.plusHours(2))
                        .durationMinutes(Long.valueOf(120L))
                        .build();
                contests.add(sampleContest);
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching CS Academy contests: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("CS Academy contests fetched: " + contests.size());
        return contests;
    }
    
    // Fetch TopCoder contests
    public List<Contest> fetchTopCoderContests() {
        List<Contest> contests = new ArrayList<>();
        
        try {
            System.out.println("Fetching TopCoder contests...");
            
            // Try multiple TopCoder API endpoints
            String[] tcApiUrls = {
                "https://api.topcoder.com/v5/challenges",
                "https://api.topcoder.com/v4/challenges",
                "https://api.topcoder.com/challenges"
            };
            
            for (String apiUrl : tcApiUrls) {
                try {
                    Request apiRequest = new Request.Builder()
                            .url(apiUrl + "?filter=status=ACTIVE&filter=track=DEVELOP")
                            .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                            .addHeader("Accept", "application/json")
                            .addHeader("Authorization", "Bearer anonymous")
                            .build();
                    
                    try (Response response = httpClient.newCall(apiRequest).execute()) {
                        if (response.isSuccessful() && response.body() != null) {
                            String responseBody = response.body().string();
                            JsonNode root = objectMapper.readTree(responseBody);
                            
                            System.out.println("TopCoder API response structure: " + root.getClass().getSimpleName());
                            
                            JsonNode challengesArray = root;
                            
                            // Handle different response structures
                            if (root.has("result")) {
                                challengesArray = root.get("result");
                            } else if (root.has("data")) {
                                challengesArray = root.get("data");
                            } else if (root.has("challenges")) {
                                challengesArray = root.get("challenges");
                            }
                            
                            if (challengesArray.isArray()) {
                                System.out.println("Found " + challengesArray.size() + " challenges from TopCoder API");
                                
                                for (JsonNode challengeNode : challengesArray) {
                                    try {
                                        if (challengeNode.has("name")) {
                                            String name = challengeNode.get("name").asText();
                                            String challengeId = challengeNode.has("id") ? challengeNode.get("id").asText() : "";
                                            String track = challengeNode.has("track") ? challengeNode.get("track").asText() : "";
                                            
                                            // Focus on competitive programming contests
                                            if (track.toLowerCase().contains("data") || 
                                                track.toLowerCase().contains("algorithm") ||
                                                name.toLowerCase().contains("srm") ||
                                                name.toLowerCase().contains("contest")) {
                                                
                                                LocalDateTime startTime = null;
                                                LocalDateTime endTime = null;
                                                
                                                // Try different time field names
                                                if (challengeNode.has("phases")) {
                                                    JsonNode phases = challengeNode.get("phases");
                                                    for (JsonNode phase : phases) {
                                                        String phaseName = phase.has("name") ? phase.get("name").asText() : "";
                                                        if ("Registration".equalsIgnoreCase(phaseName) || "Submission".equalsIgnoreCase(phaseName)) {
                                                            if (phase.has("scheduledStartTime")) {
                                                                startTime = parseTopCoderTime(phase.get("scheduledStartTime").asText());
                                                            }
                                                            if (phase.has("scheduledEndTime")) {
                                                                endTime = parseTopCoderTime(phase.get("scheduledEndTime").asText());
                                                            }
                                                            break;
                                                        }
                                                    }
                                                } else {
                                                    // Try direct time fields
                                                    if (challengeNode.has("startDate")) {
                                                        startTime = parseTopCoderTime(challengeNode.get("startDate").asText());
                                                    }
                                                    if (challengeNode.has("endDate")) {
                                                        endTime = parseTopCoderTime(challengeNode.get("endDate").asText());
                                                    }
                                                }
                                                
                                                if (startTime != null && startTime.isAfter(LocalDateTime.now())) {
                                                    if (endTime == null) {
                                                        endTime = startTime.plusHours(2); // Default duration
                                                    }
                                                    
                                                    String url = challengeId.isEmpty() ? 
                                                        "https://www.topcoder.com/challenges/" : 
                                                        "https://www.topcoder.com/challenges/" + challengeId;
                                                    
                                                    long duration = java.time.Duration.between(startTime, endTime).toMinutes();
                                                    
                                                    Contest contest = Contest.builder()
                                                            .name(name)
                                                            .platform("TopCoder")
                                                            .url(url)
                                                            .startTime(startTime)
                                                            .endTime(endTime)
                                                            .durationMinutes(Long.valueOf(duration))
                                                            .build();
                                                    contests.add(contest);
                                                    System.out.println("Added TopCoder contest: " + name);
                                                }
                                            }
                                        }
                                    } catch (Exception challengeParseError) {
                                        System.err.println("Error parsing TopCoder challenge: " + challengeParseError.getMessage());
                                    }
                                }
                            }
                            
                            // If we found contests, break from API loop
                            if (!contests.isEmpty()) {
                                break;
                            }
                        } else {
                            System.err.println("TopCoder API " + apiUrl + " returned status: " + response.code());
                        }
                    }
                } catch (Exception apiError) {
                    System.err.println("Error with TopCoder API " + apiUrl + ": " + apiError.getMessage());
                }
            }
            
            // Fallback to web scraping if API fails
            if (contests.isEmpty()) {
                System.out.println("TopCoder API failed, trying web scraping...");
                
                String[] tcWebUrls = {
                    "https://www.topcoder.com/challenges",
                    "https://www.topcoder.com/community/competitive-programming/",
                    "https://www.topcoder.com/community/algorithm-challenges/"
                };
                
                for (String webUrl : tcWebUrls) {
                    try {
                        Document doc = Jsoup.connect(webUrl)
                                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                                .header("Accept-Language", "en-US,en;q=0.9")
                                .timeout(30000)
                                .get();
                        
                        // Parse challenge cards with multiple selectors
                        Elements challengeCards = doc.select(".challenge-card, .challenge-item, .contest-card, .event-card, .competition-item");
                        
                        if (challengeCards.isEmpty()) {
                            challengeCards = doc.select("[class*='challenge'], [class*='contest'], [class*='srm']");
                        }
                        
                        System.out.println("Found " + challengeCards.size() + " potential challenge elements on " + webUrl);
                        
                        for (Element card : challengeCards) {
                            try {
                                String name = "";
                                String url = "";
                                LocalDateTime startTime = LocalDateTime.now().plusDays(1);
                                LocalDateTime endTime = startTime.plusHours(2);
                                
                                // Try multiple selectors for title
                                Element titleElement = card.selectFirst(".challenge-title, .challenge-name, .title, .name, h3, h4, h2");
                                if (titleElement != null) {
                                    name = titleElement.text().trim();
                                }
                                
                                // Try multiple selectors for link
                                Element linkElement = card.selectFirst("a[href]");
                                if (linkElement != null) {
                                    url = linkElement.attr("href");
                                    if (!url.startsWith("http")) {
                                        url = "https://www.topcoder.com" + url;
                                    }
                                }
                                
                                // Try to find time information
                                Element timeElement = card.selectFirst(".challenge-time, .time-info, .registration-time, .start-time, .date-time");
                                if (timeElement != null) {
                                    String timeText = timeElement.text();
                                    startTime = parseTopCoderRelativeTime(timeText);
                                    endTime = startTime.plusHours(2);
                                }
                                
                                // Only add if we have valid contest information
                                if (!name.isEmpty() && !url.isEmpty() && 
                                    startTime.isAfter(LocalDateTime.now()) &&
                                    (name.toLowerCase().contains("srm") || 
                                     name.toLowerCase().contains("contest") ||
                                     name.toLowerCase().contains("challenge") ||
                                     name.toLowerCase().contains("algorithm"))) {
                                    
                                    Contest contest = Contest.builder()
                                            .name(name)
                                            .platform("TopCoder")
                                            .url(url)
                                            .startTime(startTime)
                                            .endTime(endTime)
                                            .durationMinutes(Long.valueOf(120L))
                                            .build();
                                    contests.add(contest);
                                    System.out.println("Added TopCoder contest from scraping: " + name);
                                }
                            } catch (Exception cardParseError) {
                                System.err.println("Error parsing TopCoder challenge card: " + cardParseError.getMessage());
                            }
                        }
                        
                        // If we found contests, break from URL loop
                        if (!contests.isEmpty()) {
                            break;
                        }
                        
                    } catch (Exception scrapingError) {
                        System.err.println("TopCoder web scraping failed for " + webUrl + ": " + scrapingError.getMessage());
                    }
                }
            }
            
            // If no contests found through API or scraping, add sample contest for testing
            if (contests.isEmpty()) {
                System.out.println("No TopCoder contests found, adding sample contest...");
                LocalDateTime sampleStart = LocalDateTime.now().plusDays(4);
                Contest sampleContest = Contest.builder()
                        .name("TopCoder SRM")
                        .platform("TopCoder")
                        .url("https://www.topcoder.com/challenges/")
                        .startTime(sampleStart)
                        .endTime(sampleStart.plusHours(2))
                        .durationMinutes(Long.valueOf(120L))
                        .build();
                contests.add(sampleContest);
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching TopCoder contests: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("TopCoder contests fetched: " + contests.size());
        return contests;
    }
    
    // Helper methods for new platforms
    private LocalDateTime parseGeeksforGeeksTime(String timeText) {
        try {
            LocalDateTime now = LocalDateTime.now();
            timeText = timeText.toLowerCase();
            
            if (timeText.contains("starts in") || timeText.contains("in")) {
                if (timeText.contains("day")) {
                    return now.plusDays(1);
                } else if (timeText.contains("hour")) {
                    return now.plusHours(2);
                }
            }
            
            return now.plusDays(1);
        } catch (Exception e) {
            return LocalDateTime.now().plusDays(1);
        }
    }
    
    private LocalDateTime parseCSAcademyTime(String timeStr) {
        try {
            // CS Academy time format: "2024-01-01 15:00" or similar
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            return LocalDateTime.parse(timeStr, formatter);
        } catch (Exception e) {
            return LocalDateTime.now().plusDays(1);
        }
    }
    
    private long parseCSAcademyDuration(String durationStr) {
        try {
            // CS Academy duration format: "2 hours" or "120 minutes"
            if (durationStr.contains("hour")) {
                String[] parts = durationStr.split("\\s+");
                int hours = Integer.parseInt(parts[0]);
                return hours * 60L;
            } else if (durationStr.contains("minute")) {
                String[] parts = durationStr.split("\\s+");
                return Long.parseLong(parts[0]);
            }
            return 120L; // Default 2 hours
        } catch (Exception e) {
            return 120L;
        }
    }
    
    private LocalDateTime parseTopCoderTime(String timeStr) {
        try {
            // TopCoder time format: "2024-01-01T15:00:00.000Z"
            if (timeStr.endsWith("Z")) {
                timeStr = timeStr.substring(0, timeStr.length() - 1);
            }
            if (timeStr.contains(".")) {
                timeStr = timeStr.substring(0, timeStr.indexOf("."));
            }
            return LocalDateTime.parse(timeStr);
        } catch (Exception e) {
            return null;
        }
    }
    
    private LocalDateTime parseTopCoderRelativeTime(String timeText) {
        try {
            LocalDateTime now = LocalDateTime.now();
            timeText = timeText.toLowerCase();
            
            if (timeText.contains("registration") && timeText.contains("in")) {
                if (timeText.contains("day")) {
                    return now.plusDays(1);
                } else if (timeText.contains("hour")) {
                    return now.plusHours(3);
                }
            }
            
            return now.plusDays(1);
        } catch (Exception e) {
            return LocalDateTime.now().plusDays(1);
        }
    }
}
