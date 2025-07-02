package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.model.ScheduleEntry;
import com.AlgoAlert.CodeRadar.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScheduleController {
    private final ScheduleService scheduleService;

    // 1. PDF upload endpoint
    @PostMapping("/upload-pdf")
    public ResponseEntity<?> uploadSchedulePdf(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = userDetails.getUsername(); // or getId() if available
            String text = scheduleService.extractTextFromPdf(file);
//            System.out.println(userId+" "+ text);
            List<ScheduleEntry> entries = scheduleService.parseScheduleWithAI(userId, text);
            scheduleService.saveScheduleForUser(userId, entries);
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process PDF: " + e.getMessage());
        }
    }

    // 2. Get current user's schedule
    @GetMapping("/my")
    public ResponseEntity<List<ScheduleEntry>> getMySchedule(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(scheduleService.getScheduleForUser(userId));
    }
} 