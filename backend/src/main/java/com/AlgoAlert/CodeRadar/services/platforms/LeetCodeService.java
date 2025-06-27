package com.AlgoAlert.CodeRadar.services.platforms;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Difficulty;
import com.AlgoAlert.CodeRadar.enums.Platform;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class LeetCodeService {
    
    private static final String API_URL = "https://leetcode.com/graphql";
    
   @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;

    public ExternalProblemDTO getDailyProblem() {
        String query = """
            {
                "query": "query questionOfToday { activeDailyCodingChallengeQuestion { date link question { title difficulty content } } }",
                "variables": {}
            }
            """;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(query, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                API_URL,
                HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode data = root.get("data");
                JsonNode questionNode = data.get("activeDailyCodingChallengeQuestion");
                
                if (questionNode != null && !questionNode.isNull()) {
                    JsonNode question = questionNode.get("question");
                    ExternalProblemDTO problem = new ExternalProblemDTO();
                    problem.setTitle(question.get("title").asText());
                    problem.setDescription(question.get("content").asText());
                    problem.setDifficulty(question.get("difficulty").asText());
                    problem.setPlatform(Platform.LEETCODE.name());
                    problem.setProblemUrl("https://leetcode.com" + questionNode.get("link").asText());
                    problem.setPoints(Difficulty.valueOf(question.get("difficulty").asText()).getPoints());
                    return problem;
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching LeetCode daily problem: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
} 