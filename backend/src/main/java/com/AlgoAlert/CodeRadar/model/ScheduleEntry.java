package com.AlgoAlert.CodeRadar.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Document(collection = "schedule_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleEntry {
    @Id
    private String id;
    private String userId;
    private String classTitle;

    private DayOfWeek day;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime start;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime end;
    private String venue;
    private String lecturer;
} 