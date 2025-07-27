package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.User;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
public class PlatformVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(PlatformVerificationService.class);

    private final RestTemplate restTemplate;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    @Autowired
    public PlatformVerificationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Verify if a user is registered on a specific platform
     */
    public CompletableFuture<Boolean> verifyPlatformRegistration(User user, String platform) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String handle = getUserHandleForPlatform(user, platform);
                if (handle == null || handle.trim().isEmpty()) {
                    logger.info("No handle for platform {} for user {}", platform, user.getUsername());
                    return false;
                }
                switch (platform.toLowerCase()) {
                    case "codeforces":
                        return verifyCodeforcesHandle(handle);
                    case "leetcode":
                        return verifyLeetCodeHandle(handle);
                    case "codechef":
                        return verifyCodeChefHandle(handle);
                    case "atcoder":
                        return verifyAtCoderHandle(handle);
                    case "hackerrank":
                        return verifyHackerRankHandle(handle);
                    case "hackerearth":
                        return verifyHackerEarthHandle(handle);
                    case "geeksforgeeks":
                        return verifyGeeksforGeeksHandle(handle);
                    case "csacademy":
                        return verifyCSAcademyHandle(handle);
                    case "topcoder":
                        return verifyTopCoderHandle(handle);
                    default:
                        logger.warn("Unknown platform: {}", platform);
                        return false;
                }
            } catch (Exception e) {
                logger.error("Error verifying {} registration for user {}: {}", platform, user.getUsername(), e.getMessage());
                return false;
            }
        }, executorService);
    }

    public CompletableFuture<Boolean> verifyPlatformHandle(String handle, String platform) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (handle == null || handle.trim().isEmpty()) {
                    logger.info("No handle for platform {}", platform);
                    return false;
                }
                switch (platform.toLowerCase()) {
                    case "codeforces":
                        return verifyCodeforcesHandle(handle);
                    case "leetcode":
                        return verifyLeetCodeHandle(handle);
                    case "codechef":
                        return verifyCodeChefHandle(handle);
                    case "atcoder":
                        return verifyAtCoderHandle(handle);
                    case "hackerrank":
                        return verifyHackerRankHandle(handle);
                    case "hackerearth":
                        return verifyHackerEarthHandle(handle);
                    case "geeksforgeeks":
                        return verifyGeeksforGeeksHandle(handle);
                    case "csacademy":
                        return verifyCSAcademyHandle(handle);
                    case "topcoder":
                        return verifyTopCoderHandle(handle);
                    default:
                        logger.warn("Unknown platform: {}", platform);
                        return false;
                }
            } catch (Exception e) {
                logger.error("Error verifying {} registration for user {}: {}", platform, handle, e.getMessage());
                return false;
            }
        }, executorService);
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
     * Verify Codeforces handle by checking user profile
     */
    private boolean verifyCodeforcesHandle(String handle) {
        try {
            String url = "https://codeforces.com/api/user.info?handles=" + handle;
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(3000);
            int responseCode = connection.getResponseCode();
            if (responseCode == 200) {
                // Parse response to check if user exists
                String response = new BufferedReader(new InputStreamReader(connection.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));
                return response.contains("\"status\":\"OK\"");
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Verify LeetCode handle by checking user profile
     */
    private boolean verifyLeetCodeHandle(String handle) {
        try {
            String url = "https://leetcode.com/graphql/";

            // GraphQL query to check if user exists
            String query = String.format("""
            {
                matchedUser(username: "%s") {
                    username
                    profile {
                        realName
                    }
                }
            }
            """, handle);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            headers.set("Accept", "*/*");
            headers.set("Accept-Language", "en-US,en;q=0.9");
            headers.set("Origin", "https://leetcode.com");
            headers.set("Referer", "https://leetcode.com/");

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("query", query);
            requestBody.put("operationName", null);
            requestBody.put("variables", "{}");

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                return data != null && data.get("matchedUser") != null;
            }
            return false;
        } catch (Exception e) {
            logger.error("Error verifying LeetCode handle {}: {}", handle, e.getMessage());
            return false;
        }
    }

    /**
     * Verify CodeChef handle
     */
    private boolean verifyCodeChefHandle(String handle) {
        try {
            // Check user profile page directly
            String url = "https://www.codechef.com/users/" + handle;
            
            String response = restTemplate.getForObject(url, String.class);
            
            // Check if the response contains user profile content
            if (response != null && response.contains("class=\"user-details\"") && 
                !response.contains("User not found") && !response.contains("404")) {
                return true;
            }
            
            return false;
            
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            // Any 4xx error means user doesn't exist
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Verify AtCoder handle
     */
    private boolean verifyAtCoderHandle(String handle) {
        try {
            String url = "https://atcoder.jp/users/" + handle;
            
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null && response.contains("class=\"username\"") && 
                !response.contains("404") && !response.contains("User not found")) {
                return true;
            }
            
            return false;
            
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean verifyHackerRankHandle(String handle) {
        try {
            String url = "https://www.hackerrank.com/profile/" + handle;
            
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null && response.contains("profile-header") && 
                !response.contains("404") && !response.contains("User not found")) {
                return true;
            }
            
            return false;
            
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean verifyHackerEarthHandle(String handle) {
        try {
            String url = "https://www.hackerearth.com/@" + handle;
            
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null && response.contains("profile-header") && 
                !response.contains("404") && !response.contains("User not found")) {
                return true;
            }
            
            return false;
            
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Verify GeeksforGeeks handle
     */
    private boolean verifyGeeksforGeeksHandle(String handleName) {
        try {
            String urlStr = "https://auth.geeksforgeeks.org/user/" + handleName;
            HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
            conn.setRequestMethod("HEAD");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int code = conn.getResponseCode();
            return (code == 200);
        } catch (Exception e) {
            // Could be network issues — handle as needed
            return false;
        }
    }

    /**
     * Verify CS Academy handle
     */
    private boolean verifyCSAcademyHandle(String handle) {
        try {
            String url = "https://csacademy.com/user/" + handle;
            
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null && response.contains("user-profile") && 
                !response.contains("404") && !response.contains("User not found")) {
                return true;
            }
            
            return false;
            
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Verify TopCoder handle
     */
    private boolean verifyTopCoderHandle(String handle) {
        try {
            String url = "https://www.topcoder.com/members/" + handle;
            
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null && response.contains("member-profile") && 
                !response.contains("404") && !response.contains("User not found")) {
                return true;
            }
            
            return false;
            
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }
    

    /**
     * Get all platforms where user is registered
     */
    public CompletableFuture<Map<String, Boolean>> verifyAllPlatforms(User user) {
        List<String> platforms = Arrays.asList("codeforces", "leetcode", "codechef", "atcoder", "hackerrank", "hackerearth", "geeksforgeeks", "csacademy", "topcoder");
        
        Map<String, CompletableFuture<Boolean>> futures = new HashMap<>();
        for (String platform : platforms) {
            futures.put(platform, verifyPlatformRegistration(user, platform));
        }

        return CompletableFuture.allOf(futures.values().toArray(new CompletableFuture[0]))
                .thenApply(v -> {
                    Map<String, Boolean> results = new HashMap<>();
                    for (Map.Entry<String, CompletableFuture<Boolean>> entry : futures.entrySet()) {
                        try {
                            results.put(entry.getKey(), entry.getValue().get());
                        } catch (Exception e) {
                            results.put(entry.getKey(), false);
                        }
                    }
                    return results;
                });
    }
} 