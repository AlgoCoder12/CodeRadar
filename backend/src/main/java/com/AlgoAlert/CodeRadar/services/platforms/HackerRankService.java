package com.AlgoAlert.CodeRadar.services.platforms;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Difficulty;
import com.AlgoAlert.CodeRadar.enums.Platform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class HackerRankService {

    private static final String API_URL = "https://www.hackerrank.com/rest/contests/master/challenges";
    private static final String HACKERRANK_BASE_PROBLEM_URL = "https://www.hackerrank.com/challenges/";

   @Autowired
    private RestTemplate restTemplate;

    public ExternalProblemDTO getDailyProblem() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            System.out.println("Attempting to fetch HackerRank challenges from: " + API_URL);

            ResponseEntity<HackerRankResponse> response = restTemplate.exchange( // THIS IS WHERE HACKERRANKRESPONSE IS USED
                    API_URL,
                    HttpMethod.GET,
                    entity,
                    HackerRankResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().getModels() != null && !response.getBody().getModels().isEmpty()) {
                Challenge challenge = response.getBody().getModels().get(0); // THIS IS WHERE CHALLENGE IS USED
                System.out.println("Successfully fetched a HackerRank challenge: " + challenge.getName());

                ExternalProblemDTO problemDTO = new ExternalProblemDTO();
                problemDTO.setTitle(challenge.getName());

                String cleanDescription = stripHtml(challenge.getDescription());
                problemDTO.setDescription(cleanDescription.isEmpty() ? "Check the problem on HackerRank for full details." : cleanDescription);

                problemDTO.setPlatform(Platform.HACKERRANK.name());
                problemDTO.setProblemUrl(HACKERRANK_BASE_PROBLEM_URL + challenge.getSlug());

                String difficultyName = Optional.ofNullable(challenge.getDifficultyName())
                        .orElse("UNKNOWN")
                        .toUpperCase();
                try {
                    Difficulty mappedDifficulty = Difficulty.valueOf(difficultyName);
                    problemDTO.setDifficulty(mappedDifficulty.name());
                    problemDTO.setPoints(mappedDifficulty.getPoints());
                } catch (IllegalArgumentException e) {
                    System.err.println("Unknown difficulty name from HackerRank: " + challenge.getDifficultyName() + ". Defaulting to MEDIUM.");
                    problemDTO.setDifficulty(Difficulty.Medium.name());
                    problemDTO.setPoints(Difficulty.Medium.getPoints());
                }
                return problemDTO;
            } else {
                System.err.println("HackerRank API call failed or returned empty body. Status: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            System.err.println("HackerRank API Client Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            e.printStackTrace();
        } catch (HttpServerErrorException e) {
            System.err.println("HackerRank API Server Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            e.printStackTrace();
        } catch (ResourceAccessException e) {
            System.err.println("Network/Connection Error fetching HackerRank problem: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("An unexpected error occurred while fetching HackerRank problem: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private String stripHtml(String htmlString) {
        if (htmlString == null || htmlString.isEmpty()) {
            return "";
        }
        return htmlString.replaceAll("<[^>]*>", "").trim();
    }

    // --- Inner classes for JSON mapping ---
    // Changed to public static
    public static class HackerRankResponse { // <--- CHANGED TO PUBLIC STATIC
        private List<Challenge> models;

        public List<Challenge> getModels() { return models; }
        public void setModels(List<Challenge> models) { this.models = models; }
    }

    public static class Challenge { // <--- CHANGED TO PUBLIC STATIC
        private String name;
        private String slug;
        private String description;
        private String difficultyName;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getDifficultyName() { return difficultyName; }
        public void setDifficultyName(String difficultyName) { this.difficultyName = difficultyName; }
    }
}