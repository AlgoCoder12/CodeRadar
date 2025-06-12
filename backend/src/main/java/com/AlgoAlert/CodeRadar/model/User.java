package com.AlgoAlert.CodeRadar.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class User {
    @Id
    private String id;
    private String username;

    private String fullName;
    private String email;
    private String password;

    private List<String> favPlatforms;
    private Map<String, List<String>> timeTable;
    private boolean emailPrefs;
    private String codeforcesHandle;
    private String leetcodeHandle;
    private int streak;
    private int points;
}
