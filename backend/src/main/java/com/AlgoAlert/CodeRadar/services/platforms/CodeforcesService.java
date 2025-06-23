package com.AlgoAlert.CodeRadar.services.platforms;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Difficulty;
import com.AlgoAlert.CodeRadar.enums.Platform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder; // Import for building URLs with parameters

import java.net.URI; // Import for URI
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors; // For Java 8+ stream operations

@Service
public class CodeforcesService {

    private static final String API_URL = "https://codeforces.com/api/problemset.problems";
    private static final String CODEFORCES_PROBLEM_BASE_URL = "https://codeforces.com/problemset/problem/";

    @Autowired
    private RestTemplate restTemplate;

    // A simple mapping for common tags (you might want a more comprehensive map or enum)
    // This needs to be maintained as Codeforces tags might change.
    private static final java.util.Map<String, String> TOPIC_TO_CODEFORCES_TAG = new java.util.HashMap<>();
    static {
        TOPIC_TO_CODEFORCES_TAG.put("DYNAMIC_PROGRAMMING", "dp");
        TOPIC_TO_CODEFORCES_TAG.put("GREEDY", "greedy");
        TOPIC_TO_CODEFORCES_TAG.put("DATA_STRUCTURES", "data structures");
        TOPIC_TO_CODEFORCES_TAG.put("MATH", "math");
        TOPIC_TO_CODEFORCES_TAG.put("GRAPH", "graphs");
        TOPIC_TO_CODEFORCES_TAG.put("STRINGS", "strings");
        TOPIC_TO_CODEFORCES_TAG.put("SORTING", "sortings");
        TOPIC_TO_CODEFORCES_TAG.put("BINARY_SEARCH", "binary search");
        TOPIC_TO_CODEFORCES_TAG.put("IMPLEMENTATION", "implementation");
        TOPIC_TO_CODEFORCES_TAG.put("DSU", "dsu"); // Disjoint Set Union
        TOPIC_TO_CODEFORCES_TAG.put("BFS", "bfs");
        TOPIC_TO_CODEFORCES_TAG.put("DFS", "dfs");
        // Add more mappings as needed based on Codeforces tags
    }

    /**
     * Retrieves a random problem from the entire Codeforces problemset.
     * This is your original method, restored.
     * @return An ExternalProblemDTO for a random problem, or null if an error occurs.
     */
    public ExternalProblemDTO getDailyProblem() {
        try {
            System.out.println("Fetching a random Codeforces problem for daily challenge.");
            ResponseEntity<CodeforcesResponse> response = restTemplate.getForEntity(
                    API_URL,
                    CodeforcesResponse.class
            );

            if (response.getBody() != null && "OK".equals(response.getBody().getStatus()) && response.getBody().getResult() != null) {
                List<CodeforcesResponse.Problem> problems = response.getBody().getResult().getProblems();
                List<CodeforcesResponse.Problem> ratedProblems = problems.stream()
                        .filter(p -> p.getRating() > 0) // Filter out problems with no rating
                        .collect(Collectors.toList());

                if (!ratedProblems.isEmpty()) {
                    // Get a random problem from the rated problems
                    CodeforcesResponse.Problem problem = ratedProblems.get(new Random().nextInt(ratedProblems.size()));
                    System.out.println("Found random problem: " + problem.getName() + " (Rating: " + problem.getRating() + ")");

                    ExternalProblemDTO problemDTO = new ExternalProblemDTO();
                    problemDTO.setTitle(problem.getName());
                    // Codeforces API problemset.problems does not return full description.
                    problemDTO.setDescription("Find problem details on Codeforces. Contest ID: " + problem.getContestId() + ", Index: " + problem.getIndex());

                    // Map Codeforces rating to your Difficulty enum
                    problemDTO.setDifficulty(Difficulty.fromRating(problem.getRating()).name());
                    problemDTO.setPlatform(Platform.CODEFORCES.name());
                    problemDTO.setProblemUrl(CODEFORCES_PROBLEM_BASE_URL + problem.getContestId() + "/" + problem.getIndex());
                    problemDTO.setPoints(Difficulty.fromRating(problem.getRating()).getPoints());
                    return problemDTO;
                } else {
                    System.out.println("No rated problems found in Codeforces API response.");
                }
            } else {
                System.err.println("Codeforces API call failed or returned empty result for daily problem. Status: " + (response.getBody() != null ? response.getBody().getStatus() : "N/A"));
            }
        } catch (Exception e) {
            System.err.println("Error fetching random Codeforces problem: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }


    /**
     * Retrieves a Codeforces problem based on specified topic and difficulty rating range.
     *
     * @param topic      Optional. A string representing the topic (e.g., "DYNAMIC_PROGRAMMING").
     * Maps to Codeforces tags. If null or empty, no tag filter is applied.
     * @param minRating  Optional. Minimum rating for the problem (inclusive). If null, no min filter.
     * @param maxRating  Optional. Maximum rating for the problem (inclusive). If null, no max filter.
     * @return An ExternalProblemDTO for a matching problem, or null if no problem found or an error occurs.
     */
    public ExternalProblemDTO getProblemByTopicAndDifficulty(String topic, Integer minRating, Integer maxRating) {
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(API_URL);

            // Add tags if provided
            if (topic != null && !topic.isEmpty()) {
                String codeforcesTag = TOPIC_TO_CODEFORCES_TAG.get(topic.toUpperCase());
                if (codeforcesTag != null) {
                    uriBuilder.queryParam("tags", codeforcesTag);
                    System.out.println("Filtering Codeforces problems by topic (tag): " + codeforcesTag);
                } else {
                    System.out.println("Warning: Unknown topic '" + topic + "'. No tag filter applied.");
                }
            }

            // Add rating filters if provided
            if (minRating != null) {
                uriBuilder.queryParam("minRating", minRating);
                System.out.println("Filtering Codeforces problems by minRating: " + minRating);
            }
            if (maxRating != null) {
                uriBuilder.queryParam("maxRating", maxRating);
                System.out.println("Filtering Codeforces problems by maxRating: " + maxRating);
            }

            URI uri = uriBuilder.build().toUri();
            System.out.println("Requesting Codeforces API: " + uri);

            ResponseEntity<CodeforcesResponse> response = restTemplate.getForEntity(
                    uri,
                    CodeforcesResponse.class
            );

            if (response.getBody() != null && "OK".equals(response.getBody().getStatus()) && response.getBody().getResult() != null) {
                List<CodeforcesResponse.Problem> problems = response.getBody().getResult().getProblems();
                List<CodeforcesResponse.Problem> filteredProblems = problems.stream()
                        .filter(p -> p.getRating() > 0) // Filter out problems with no rating
                        .collect(Collectors.toList());

                if (!filteredProblems.isEmpty()) {
                    CodeforcesResponse.Problem problem = filteredProblems.get(new Random().nextInt(filteredProblems.size()));
                    System.out.println("Found matching problem: " + problem.getName() + " (Rating: " + problem.getRating() + ", Tags: " + problem.getTags() + ")");

                    ExternalProblemDTO problemDTO = new ExternalProblemDTO();
                    problemDTO.setTitle(problem.getName());
                    // Description still needs scraping if full content is required
                    problemDTO.setDescription("Find problem details on Codeforces. Contest ID: " + problem.getContestId() + ", Index: " + problem.getIndex());

                    problemDTO.setDifficulty(Difficulty.fromRating(problem.getRating()).name());
                    problemDTO.setPlatform(Platform.CODEFORCES.name());
                    problemDTO.setProblemUrl(CODEFORCES_PROBLEM_BASE_URL + problem.getContestId() + "/" + problem.getIndex());
                    problemDTO.setPoints(Difficulty.fromRating(problem.getRating()).getPoints());

                    return problemDTO;
                } else {
                    System.out.println("No Codeforces problems found matching the specified criteria.");
                }
            } else {
                System.err.println("Codeforces API call failed or returned empty result. Status: " + (response.getBody() != null ? response.getBody().getStatus() : "N/A"));
            }
        } catch (Exception e) {
            System.err.println("Error fetching Codeforces problem by topic/difficulty: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    // --- Inner classes for JSON mapping ---
    // Made public static to ensure RestTemplate can access them.
    public static class CodeforcesResponse {
        private String status;
        private Result result;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Result getResult() { return result; }
        public void setResult(Result result) { this.result = result; }

        public static class Result {
            private List<Problem> problems;
            // problemStatistics field is also available but not needed for this
            // private List<ProblemStatistics> problemStatistics;

            public List<Problem> getProblems() { return problems; }
            public void setProblems(List<Problem> problems) { this.problems = problems; }
        }

        public static class Problem {
            private int contestId;
            private String index;
            private String name;
            private int rating; // Problem rating, e.g., 800, 1200, 2000
            private List<String> tags; // Tags like "dp", "greedy", "graphs"

            public int getContestId() { return contestId; }
            public void setContestId(int contestId) { this.contestId = contestId; }
            public String getIndex() { return index; }
            public void setIndex(String index) { this.index = index; }
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public int getRating() { return rating; }
            public void setRating(int rating) { this.rating = rating; }
            public List<String> getTags() { return tags; }
            public void setTags(List<String> tags) { this.tags = tags; }
        }
    }
}