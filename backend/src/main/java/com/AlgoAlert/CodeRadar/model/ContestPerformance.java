package com.AlgoAlert.CodeRadar.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "contest_performances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ContestPerformance {
    @Id
    private String id;
    
    private String userId;
    private String contestId;
    private String contestName;
    private String platform;
    
    // Performance metrics
    private Integer rank;
    private Integer totalParticipants;
    private Integer problemsSolved;
    private Integer totalProblems;
    private Integer score;
    private Integer maxScore;
    
    // Contest details
    private LocalDateTime contestStartTime;
    private LocalDateTime contestEndTime;
    private LocalDateTime performanceRecordedAt;
    
    // Registration status
    private boolean wasRegistered;
    private boolean participated;
    
    // Additional metrics
    private Long timeSpent; // in minutes
    private Integer ratingChange;
    private Integer previousRating;
    private Integer newRating;
} 