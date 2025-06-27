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
            // Step 1: Fetch the POTD redirect page
            Document doc = Jsoup.connect(GFG_POTD_URL)
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            // Step 2: Extract the actual problem URL from the button onclick
            Element button = doc.selectFirst("button.explore_POTDCntBtn__O1jcw");
            String problemUrl = GFG_POTD_URL;

            if (button != null) {
                String onclick = button.attr("onclick");
                Matcher matcher = URL_PATTERN.matcher(onclick);
                if (matcher.find()) {
                    problemUrl = matcher.group(1);
                }
            }

            // Step 3: Load the actual problem page
            Document problemPage = Jsoup.connect(problemUrl)
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            ExternalProblemDTO dto = new ExternalProblemDTO();
            dto.setPlatform(Platform.GEEKSFORGEEKS.name());
            dto.setProblemUrl(problemUrl);

            // Step 4: Extract Title
            String title = problemPage.selectFirst("h1.entry-title").text();
            dto.setTitle(title);

            // Step 5: Extract Description snippet
            Element descriptionEl = problemPage.selectFirst("div.text");
            String description = (descriptionEl != null)
                    ? descriptionEl.text().split("\\.")[0] + "."
                    : "Solve today's coding problem on GFG!";
            dto.setDescription(description);

            // Step 6: Extract Difficulty from tags or hardcode fallback
            String lowerText = problemPage.text().toLowerCase();
            String difficultyStr = "Medium";
            int points = Difficulty.Medium.getPoints();

            if (lowerText.contains("easy")) {
                difficultyStr = "Easy";
                points = Difficulty.Easy.getPoints();
            } else if (lowerText.contains("hard")) {
                difficultyStr = "Hard";
                points = Difficulty.Hard.getPoints();
            }

            dto.setDifficulty(difficultyStr);
            dto.setPoints(points);

            return dto;

        } catch (Exception e) {
            System.err.println("Failed to fetch GFG POTD: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
