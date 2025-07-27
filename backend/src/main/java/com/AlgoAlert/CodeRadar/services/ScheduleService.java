package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.ScheduleEntry;
import com.AlgoAlert.CodeRadar.repo.ScheduleEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import okhttp3.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleEntryRepository scheduleEntryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;
    @Value("${openrouter.api.url}")
    private String openRouterApiUrl;
    @Value("${openrouter.model}")
    private String openRouterModel;

    /**
     * Extracts raw text from a PDF file using PDFBox.
     */
    public String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    /**
     * Calls OpenRouter API to parse the extracted text into structured schedule entries.
     */
    public String callOpenRouterAPI(String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Map<String, Object> requestBody = Map.of(
            "model", openRouterModel,
            "messages", List.of(Map.of("role", "user", "content", prompt)),
            "temperature", 0.2
        );
        Request request = new Request.Builder()
                .url(openRouterApiUrl)
                .addHeader("Authorization", "Bearer " + openRouterApiKey)
                .addHeader("Content-Type", "application/json")
                .addHeader("HTTP-Referer", "http://localhost:8080")  // Required for free tier
                .addHeader("X-Title", "CodeRadar")  // Your application name
                .post(RequestBody.create(objectMapper.writeValueAsBytes(requestBody), MediaType.parse("application/json")))
                .build();
        System.out.println("Request "+ request);

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                throw new IOException("OpenRouter API error: " + response + " - " + errorBody);
            }
            System.out.println("Response "+ response);
            String responseBody = response.body().string();
            System.out.println("responseBody "+responseBody);
            // Parse the JSON array from the response (extract from choices[0].message.content)
            return objectMapper.readTree(responseBody)
                    .get("choices").get(0).get("message").get("content").asText();
        } catch (Exception e) {
            System.err.println("Error calling OpenRouter API: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Uses OpenRouter API to parse the extracted text into structured schedule entries.
     * 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
     */
    public List<ScheduleEntry> parseScheduleWithAI(String userId, String rawText) throws IOException {
        String prompt = "Extract a list of class schedule entries from the following university timetable text. " +
                "Return a JSON array of objects with fields: classTitle (String), day (full English, ALL UPPERCASE, e.g. MONDAY), start (HH:mm), end (HH:mm), venue (String), lecturer (String). " +
                "The venue and lecturer must be separated: do not combine them in one field. If the venue contains a comma, only the part before the comma is the venue, and the part after the comma is the lecturer. " +
                "If a field is missing, use null. Only output the JSON array.\n\n" + rawText;

        String jsonArray = callOpenRouterAPI(prompt);
        System.out.println("JSon array: " + jsonArray);
        ScheduleEntry[] entries = objectMapper.readValue(jsonArray, ScheduleEntry[].class);
        System.out.println("Entries: " + Arrays.toString(entries));
        for (ScheduleEntry entry : entries) {
            entry.setUserId(userId);
            if (entry.getVenue() != null && entry.getVenue().contains(",") &&
                (entry.getLecturer() == null || entry.getLecturer().isEmpty())) {
                String[] parts = entry.getVenue().split(",", 2);
                entry.setVenue(parts[0].trim());
                entry.setLecturer(parts[1].trim());
            }
        }
        return Arrays.asList(entries);
    }

    /**
     * Saves the schedule for a user, replacing any previous entries.
     */
    public void saveScheduleForUser(String userId, List<ScheduleEntry> entries) {
        scheduleEntryRepository.deleteByUserId(userId);
        scheduleEntryRepository.saveAll(entries);
    }

    /**
     * Retrieves the schedule for a user.
     */
    public List<ScheduleEntry> getScheduleForUser(String userId) {
        return scheduleEntryRepository.findByUserId(userId);
    }

    /**
     * Scheduled job: logs upcoming classes for all users in the next hour (demo reminder).
     */
    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void logUpcomingClasses() {
        LocalDateTime now = LocalDateTime.now();
        DayOfWeek today = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();
        LocalTime oneHourLater = currentTime.plusHours(1);

        List<ScheduleEntry> allEntries = scheduleEntryRepository.findAll();
        for (ScheduleEntry entry : allEntries) {
            if (entry.getDay() == today &&
                entry.getStart() != null &&
                !entry.getStart().isBefore(currentTime) &&
                entry.getStart().isBefore(oneHourLater)) {
                System.out.printf("Reminder: User %s has class '%s' at %s in %s%n",
                    entry.getUserId(), entry.getClassTitle(), entry.getStart(), entry.getVenue());
            }
        }
    }
} 