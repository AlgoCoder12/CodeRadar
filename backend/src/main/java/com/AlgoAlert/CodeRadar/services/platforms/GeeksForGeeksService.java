package com.AlgoAlert.CodeRadar.services.platforms;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Difficulty;
import com.AlgoAlert.CodeRadar.enums.Platform;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeeksForGeeksService {

    private static final String GFG_POTD_URL = "https://www.geeksforgeeks.org/problem-of-the-day/";
    private static final Pattern URL_PATTERN = Pattern.compile("window\\.location\\.href='(.*?)'");

    public ExternalProblemDTO getDailyProblem() {
        try {
            Document doc = Jsoup.connect(GFG_POTD_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36") // More detailed User-Agent
                    .timeout(15000) // Increased timeout
                    .get();

            ExternalProblemDTO dto = new ExternalProblemDTO();
            dto.setPlatform(Platform.GEEKSFORGEEKS.name());

            // --- 1. Extract Problem Title ---
            String title = "GeeksforGeeks Problem of the Day"; // Default fallback
            Element titleElement = doc.selectFirst("div.problem-of-the-day-data h2, span.explore_problemOfTheDayLabelMobile__Kz4Rx");
            if (titleElement != null) {
                title = titleElement.text().trim();
                // Clean up "Problem of the Day: " prefix if present
                if (title.startsWith("Problem of the Day: ")) {
                    title = title.substring("Problem of the Day: ".length()).trim();
                }
            } else {
                System.err.println("Warning: Could not find specific title element. Using fallback title.");
            }
            dto.setTitle(title);

            // --- 2. Extract Problem URL ---
            String problemUrl = GFG_POTD_URL; // Fallback URL
            Element button = doc.selectFirst("button.explore_POTDCntBtn__O1jcw");

            if (button != null) {
                String onClickAttr = button.attr("onclick");
                Matcher matcher = URL_PATTERN.matcher(onClickAttr);
                if (matcher.find()) {
                    problemUrl = matcher.group(1);
                    System.out.println("Extracted GFG Problem URL: " + problemUrl);
                } else {
                    System.err.println("Warning: Could not parse problem URL from onclick attribute. Using fallback URL.");
                }
            } else {
                System.err.println("Warning: 'Solve Problem' button not found. Using fallback URL.");
            }
            dto.setProblemUrl(problemUrl);

            // --- 3. Extract Difficulty ---
            String difficultyStr = "Medium"; // Default
            int points = Difficulty.Medium.getPoints(); // Default
            Element difficultyElement = doc.selectFirst("div.explore_problemOfTheDayData__5C7Kn > p > span"); // Check for common difficulty element
            if (difficultyElement != null) {
                String rawDifficulty = difficultyElement.text().trim();
                if (rawDifficulty.contains("Easy")) {
                    difficultyStr = "Easy";
                    points = Difficulty.Easy.getPoints();
                } else if (rawDifficulty.contains("Medium")) {
                    difficultyStr = "Medium";
                    points = Difficulty.Medium.getPoints();
                } else if (rawDifficulty.contains("Hard")) {
                    difficultyStr = "Hard";
                    points = Difficulty.Hard.getPoints();
                }
            } else {
                System.err.println("Warning: Could not find difficulty element. Using default difficulty.");
            }
            dto.setDifficulty(difficultyStr);
            dto.setPoints(points);

            // --- 4. Extract Description (optional, may vary) ---
            // GFG's POTD page usually has a brief description or intro.
            // This is highly dependent on the current HTML structure.
            // You might look for a paragraph near the title or within the POTD container.
            Element descriptionElement = doc.selectFirst("div.problem-of-the-day-data p.description-text"); // Example selector
            if (descriptionElement != null) {
                dto.setDescription(descriptionElement.text().trim());
            } else {
                // Fallback to a generic description if not found
                dto.setDescription("Solve the Problem of the Day on GeeksforGeeks!");
            }


            return dto;

        } catch (Exception e) {
            System.err.println("Error scraping GFG POTD: " + e.getMessage());
            e.printStackTrace();
            return null; // Or throw a custom exception
        }
    }
}