package com.AlgoAlert.CodeRadar.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "problems_of_the_day")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ProblemOfTheDay {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String difficulty; // EASY, MEDIUM, HARD
    private String platform; // LEETCODE, CODEFORCES, etc.
    private String problemUrl;
    private LocalDate date;
    private String category; // ARRAY, STRING, DYNAMIC_PROGRAMMING, etc.
    private int points;
    private boolean isActive;
} 