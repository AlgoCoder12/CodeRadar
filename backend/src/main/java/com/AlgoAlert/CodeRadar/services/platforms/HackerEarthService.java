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
import java.util.Optional;

@Service
public class HackerEarthService {

    private static final String PRACTICE_HOME_URL = "https://www.hackerearth.com/practice/";
    private static final String HACKEREARTH_BASE_URL = "https://www.hackerearth.com";
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    private static final int TIMEOUT_MILLIS = 15000;

    public ExternalProblemDTO getDailyProblem() {
        try {
            System.out.println("Attempting to fetch HackerEarth daily problem from: " + PRACTICE_HOME_URL);

            Document practicePageDoc = Jsoup.connect(PRACTICE_HOME_URL)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT_MILLIS)
                    .get();

            // --- STEP 1: Find the "Problem of the Day" section based on unique text ---
            // Find the element containing "Problem of the day" text (e.g., h2, h3, div, span)
            // Then, navigate up to its parent or a common ancestor that contains the problem card.
            Element potdTextElement = practicePageDoc.selectFirst("h2:contains(Problem of the day), h3:contains(Problem of the day), div:contains(Problem of the day)");

            if (potdTextElement == null) {
                System.err.println("CRITICAL: Could not find the text 'Problem of the day' on the practice page. HTML structure might have significantly changed.");
                System.err.println("Current URL: " + PRACTICE_HOME_URL + " Time: " + java.time.LocalDateTime.now());
                return null;
            }

            // Now, find the actual problem card.
            // This requires you to inspect what's the common parent or sibling relationship
            // between the 'Problem of the day' text and the 'problem-card' (or whatever its new name is).
            // Example guesses based on common patterns (YOU MUST VERIFY):
            Element dailyProblemSection = null;

            // Scenario 1: The problem card is a direct sibling or child of the parent of the text.
            // Try to find the closest ancestor that contains both the text and the problem card.
            // OR find a sibling of the text element that IS the problem card.

            // Common pattern: The text and the problem card are within the same large section/div.
            // Try going up to a parent with a general section class and then looking for a unique class inside.

            // *** Replace this with your actual inspection: ***
            // Example 1: If the text is directly inside the problem card's parent:
            // dailyProblemSection = potdTextElement.parents().select("div.some-potd-container-class").first();
            // Example 2: If the problem card is a sibling of the header:
            // dailyProblemSection = potdTextElement.nextElementSibling().selectFirst("div.problem-card"); // if 'problem-card' is still the class
            // Example 3: If 'problem-card' is still the correct class and it's a child of a common parent with the text:
            dailyProblemSection = potdTextElement.parents().select("div.problem-card-wrapper").first(); // A new wrapper class?
            if (dailyProblemSection == null) {
                // If the direct parent or a specific wrapper isn't found, try a broader search within the main content
                // Or simply re-try the original "div.problem-card" if it's there but hard to reach from the text.
                dailyProblemSection = practicePageDoc.selectFirst("div.problem-card"); // Fallback to original, if it exists elsewhere
            }

            if (dailyProblemSection == null) {
                System.err.println("CRITICAL: After finding 'Problem of the day' text, could not locate the associated problem card/section. Verify parent/sibling structure.");
                return null;
            }

            // Get problem title from within the problem card
            // Based on your screenshot, this selector should still be valid IF dailyProblemSection is correctly identified.
            Element problemTitleElement = dailyProblemSection.selectFirst("div.problem-title");
            String problemTitle = (problemTitleElement != null) ? problemTitleElement.text().trim() : "HackerEarth Problem of the Day";

            // Get problem URL from the "Start Now" button (a.solve-btn)
            // Based on your screenshot, this selector should still be valid.
            Element problemLinkElement = dailyProblemSection.selectFirst("a.solve-btn");
            String problemUrl = null;
            if (problemLinkElement != null) {
                problemUrl = HACKEREARTH_BASE_URL + problemLinkElement.attr("href"); // Handle relative URL
            }

            if (problemUrl == null || problemUrl.isEmpty()) {
                System.err.println("CRITICAL: Could not find problem link ('a.solve-btn') in 'Problem of the day' section. Cannot proceed.");
                return null;
            }

            System.out.println("Identified HackerEarth Problem of the Day: " + problemTitle + " at " + problemUrl);

            // Extract short description from the practice page (if available) - based on screenshot
            Element shortDescElement = dailyProblemSection.selectFirst("div.problem-desc");
            String shortDescription = (shortDescElement != null) ? Jsoup.parse(shortDescElement.html()).text().trim() : "Check the problem on HackerEarth for full details.";


            // --- STEP 2: Fetch the full problem details (description, and hopefully difficulty) from the problem's dedicated page ---
            System.out.println("Connecting to HackerEarth problem page for full details: " + problemUrl);
            Document problemDoc = Jsoup.connect(problemUrl)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT_MILLIS)
                    .get();

            ExternalProblemDTO problemDTO = new ExternalProblemDTO();
            problemDTO.setTitle(problemTitle);
            problemDTO.setPlatform(Platform.HACKEREARTH.name());
            problemDTO.setProblemUrl(problemUrl);

            problemDTO.setDescription(shortDescription); // Start with short description as fallback

            // **** YOU MUST INSPECT THE INDIVIDUAL PROBLEM PAGE HTML for these selectors ****
            // (e.g., the specific problem link from today's POTD on HackerEarth)

            // Attempt to get the full problem description from the problem page
            // Look for the main container (div, section) that holds the problem statement on the individual problem page.
            // Common selectors: "div.problem-statement-body", "div#problem-details-content", "div.problem-details", "div.markdown-content"
            Elements fullDescriptionElements = problemDoc.select("div.problem-statement-body, div#problem-details-content, div.problem-details, div.markdown-content");
            if (!fullDescriptionElements.isEmpty()) {
                problemDTO.setDescription(stripHtml(fullDescriptionElements.first().html()).trim().replaceAll("\\s{2,}", " ").replaceAll("\n{2,}", "\n\n"));
            } else {
                System.err.println("Warning: Could not find full description elements on HackerEarth problem page. Using short description.");
            }

            // Attempt to get difficulty from the problem page (often more accurate than summary)
            String difficultyStr = "Medium"; // Default difficulty
            // Look for common difficulty indicators on the problem page (span, div, p with specific classes)
            // Example: <span class="difficulty-level easy">Easy</span>, or within a metadata div
            Element difficultyElementOnProblemPage = problemDoc.selectFirst("span.difficulty-level, span.difficulty-label, div.difficulty, p.difficulty-text");
            if (difficultyElementOnProblemPage != null) {
                difficultyStr = difficultyElementOnProblemPage.text().trim();
            } else {
                System.err.println("Warning: Could not find explicit difficulty on problem page. Using default.");
            }

            // Map difficulty string to enum and points
            String finalDifficultyName = Optional.ofNullable(difficultyStr)
                    .orElse("UNKNOWN")
                    .toUpperCase();
            try {
                Difficulty mappedDifficulty = Difficulty.valueOf(finalDifficultyName);
                problemDTO.setDifficulty(mappedDifficulty.name());
                problemDTO.setPoints(mappedDifficulty.getPoints());
            } catch (IllegalArgumentException e) {
                System.err.println("Unknown difficulty name from HackerEarth: '" + difficultyStr + "'. Defaulting to MEDIUM.");
                problemDTO.setDifficulty(Difficulty.Medium.name());
                problemDTO.setPoints(Difficulty.Medium.getPoints());
            }

            return problemDTO;

        } catch (IOException e) {
            System.err.println("Network/IO Error fetching HackerEarth problem: " + e.getMessage());
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            System.err.println("An unexpected error occurred while fetching HackerEarth problem: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String stripHtml(String htmlString) {
        if (htmlString == null || htmlString.isEmpty()) {
            return "";
        }
        return Jsoup.parse(htmlString).text();
    }
}