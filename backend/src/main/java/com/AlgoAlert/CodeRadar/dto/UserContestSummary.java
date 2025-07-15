package com.AlgoAlert.CodeRadar.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserContestSummary {
    private String username;
    private Map<String, PlatformSummary> platformSummaries;
    private int totalContestsAcrossPlatforms;
    private Double overallAverageRank;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformSummary {
        private String platform;
        private int contestCount;
        private Double averageRank;
        private Double averageScore;
        private String currentRating;
        private String maxRating;
        private Integer bestRank;
        private boolean isActive;
    }
}
