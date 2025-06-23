package com.AlgoAlert.CodeRadar.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ExternalProblemDTO {
    private String title;
    private String description;
    private String difficulty;
    private String platform;
    private String problemUrl;
    private String category;
    private int points;
} 