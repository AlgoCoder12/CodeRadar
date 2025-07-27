package com.AlgoAlert.CodeRadar.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContestPerformanceResponse {

    private String username;
    private String platform;
    private boolean hasParticipated;
    private int totalContests;
    private Double averageRank;
    private Double averageScore;
    private Integer bestRank;
    private Double bestScore;
    private String currentRating;
    private String maxRating;
    private List<ContestResult> recentContests;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContestResult {
        private String contestId;
        private String contestName;
        private LocalDateTime contestTime;
        private Integer rank;
        private Double score;
        private String ratingChange;
        private String newRating;
        private boolean participated;
        private int totalParticipants;
        private List<ProblemResult> problemResults;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ProblemResult {
            private String problemId;
            private String problemName;
            private boolean solved;
            private int attempts;
            private String submissionTime;
            private Double points;
        }
    }
}