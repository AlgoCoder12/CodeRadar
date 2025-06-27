package com.AlgoAlert.CodeRadar.services.platforms;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Difficulty;
import com.AlgoAlert.CodeRadar.enums.Platform;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class CodeChefService {

    // You'd need to identify a reliable URL for "daily" problems, e.g., a recent contest, or a specific practice section.
    // This is purely illustrative and needs actual HTML inspection.
    private static final String CODECHEF_BASE_URL = "https://www.codechef.com/";
    private static final String CODECHEF_PRACTICE_URL = "https://www.codechef.com/practice"; // Example: Could scrape from here
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    private static final int TIMEOUT_MILLIS = 15000;

    public ExternalProblemDTO getDailyProblem() {
        try {
            // Step 1: Identify the problem URL. This is the hardest part for CodeChef.
            // For example, let's try to get the first problem from the practice page.
            // This is a simplified example; actual logic might involve parsing contest lists.
            String problemListUrl = CODECHEF_PRACTICE_URL;
            Document practicePageDoc = Jsoup.connect(problemListUrl)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT_MILLIS)
                    .get();

            // *** YOU NEED TO INSPECT CODECHEF'S PRACTICE PAGE HTML TO FIND THESE SELECTORS ***
            // This is a placeholder selector. Look for tables/lists of problems.
            Element firstProblemLinkElement = practicePageDoc.selectFirst("a.problem-tag-name"); // Example: common selector for problem links
            String problemCode = null;
            String problemName = "CodeChef Problem"; // Fallback
            String problemUrl = null;

            if (firstProblemLinkElement != null) {
                problemUrl = CODECHEF_BASE_URL + firstProblemLinkElement.attr("href");
                problemCode = firstProblemLinkElement.attr("href").substring(firstProblemLinkElement.attr("href").lastIndexOf('/') + 1); // Extract code from URL
                problemName = firstProblemLinkElement.text().trim();
                System.out.println("Identified CodeChef problem: " + problemName + " at " + problemUrl);
            } else {
                System.err.println("Could not find any problem link on CodeChef practice page. Cannot proceed with scraping.");
                return null;
            }

            // Step 2: Connect to the actual problem page using the extracted URL
            if (problemUrl == null) {
                System.err.println("No problem URL found after initial scrape. Returning null.");
                return null;
            }

            System.out.println("Connecting to CodeChef problem page: " + problemUrl);
            Document problemDoc = Jsoup.connect(problemUrl)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT_MILLIS)
                    .get();

            ExternalProblemDTO dto = new ExternalProblemDTO();
            dto.setPlatform(Platform.CODECHEF.name());
            dto.setProblemUrl(problemUrl);

            // Set the title from the initially scraped name, or refine from problem page
            dto.setTitle(problemName);

            // --- Extract Description from problem page ---
            StringBuilder descriptionBuilder = new StringBuilder();
            // *** YOU NEED TO INSPECT CODECHEF'S PROBLEM PAGE HTML TO FIND THESE SELECTORS ***
            // Look for the main div/section containing the problem statement.
            Elements descriptionElements = problemDoc.select("div.problem-statement, div.problem-content"); // Placeholder selectors
            if (!descriptionElements.isEmpty()) {
                // You might need to refine this to get just the actual problem text,
                // avoiding input/output formats, examples, etc.
                descriptionBuilder.append(descriptionElements.first().text()); // Get text from the first matched element
                dto.setDescription(descriptionBuilder.toString().trim().replaceAll("\n{3,}", "\n\n"));
            } else {
                System.err.println("Warning: Could not find description elements on CodeChef problem page. Using generic description.");
                dto.setDescription("Full problem description available on CodeChef.");
            }

            // --- Extract Difficulty from problem page ---
            String difficultyStr = "Medium"; // Default
            int points = Difficulty.Medium.getPoints(); // Default
            // *** YOU NEED TO INSPECT CODECHEF'S PROBLEM PAGE HTML TO FIND THESE SELECTORS ***
            // Difficulty might be in a span/div near the title or in problem metadata.
            Element difficultyElement = problemDoc.selectFirst("span.difficulty_level, div.problem-meta span.difficulty"); // Placeholder
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
                System.err.println("Warning: Could not find difficulty element on CodeChef problem page. Using default difficulty.");
            }
            dto.setDifficulty(difficultyStr);
            dto.setPoints(points);

            return dto;

        } catch (IOException e) {
            System.err.println("Network/IO Error fetching CodeChef problem: " + e.getMessage());
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            System.err.println("An unexpected error occurred while fetching CodeChef problem: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    // You would still need the HackerRankResponse and Challenge classes
    // if you combine services, or remove them if they are not used.
    // Or, as discussed, move them to their own public files.
    // ... (Your HackerRankResponse/Challenge DTOs if they are here) ...
}