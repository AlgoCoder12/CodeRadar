package com.AlgoAlert.CodeRadar.services.platforms;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;

@Service
public class CodeforcesParticipationService implements PlatformContestParticipationService {
    private static final String API_URL = "https://codeforces.com/api/contest.standings?contestId=%s&handles=%s";

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public Map<String, Object> checkParticipation(String handle, String contestId) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = String.format(API_URL, contestId, handle);
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && "OK".equals(response.get("status"))) {
                Map resultObj = (Map) response.get("result");
                java.util.List rows = (java.util.List) resultObj.get("rows");
                if (rows != null && !rows.isEmpty()) {
                    Map row = (Map) rows.get(0);
                    Integer rank = (Integer) row.get("rank");
                    Map party = (Map) row.get("party");
                    java.util.List members = (java.util.List) party.get("members");
                    boolean participated = members != null && !members.isEmpty();
                    Double points = null;
                    if (row.get("points") instanceof Number) {
                        points = ((Number) row.get("points")).doubleValue();
                    }
                    result.put("participated", participated);
                    result.put("rank", rank);
                    result.put("score", points);
                    result.put("message", "User participated in this contest");
                } else {
                    result.put("participated", false);
                    result.put("message", "User didn't participate in this contest");
                }
            } else {
                result.put("participated", false);
                result.put("message", "Could not fetch contest info from Codeforces");
            }
        } catch (Exception e) {
            result.put("participated", false);
            result.put("message", "Error: " + e.getMessage());
        }
        return result;
    }
} 