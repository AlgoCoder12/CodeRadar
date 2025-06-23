package com.AlgoAlert.CodeRadar.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "contests")
public class Contest {
    
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    @Indexed
    private String platform;
    
    private String url;
    
    @Indexed
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private Long durationMinutes;
    
    private String description;
    
    private LocalDateTime fetchedAt;
}
