package com.AlgoAlert.CodeRadar.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "contests")
@CompoundIndexes({
    @CompoundIndex(name = "platform_startTime", def = "{'platform': 1, 'startTime': 1}"),
    @CompoundIndex(name = "startTime_endTime", def = "{'startTime': 1, 'endTime': 1}"),
    @CompoundIndex(name = "name_platform", def = "{'name': 1, 'platform': 1}", unique = true)
})
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
