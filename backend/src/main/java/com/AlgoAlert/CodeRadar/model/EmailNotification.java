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
@Document(collection = "email_notifications")
public class EmailNotification {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String contestId;
    
    private String contestName;
    
    private String platform;
    
    private LocalDateTime contestStartTime;
    
    private LocalDateTime notificationSentAt;
    
    private String emailAddress;
    
    private boolean delivered;
    
    private String failureReason;
}
