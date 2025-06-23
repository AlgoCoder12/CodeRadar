package com.AlgoAlert.CodeRadar.services.platforms;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Difficulty;
import com.AlgoAlert.CodeRadar.enums.Platform;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AtCoderService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String HOMEPAGE_URL = "https://kenkoooo.com/atcoder/";
    private static final String TASK_INFO_API = "https://kenkoooo.com/atcoder/atcoder-api/v3/task_info?problem_id=";

    public ExternalProblemDTO getDailyProblem() {
        try {
            // 1. Load homepage and parse HTML
            Document doc = Jsoup.connect(HOMEPAGE_URL)
                    .userAgent("Mozilla/5.0")
                    .get();

            // 2. Find the POTD section (usually under class='problem-of-the-day')
            Element potdLink = doc.selectFirst("div.problem-of-the-day a");

            if (potdLink == null) {
                System.err.println("Problem of the Day section not found.");
                return null;
            }

            String href = potdLink.attr("href"); // e.g. /contests/abc123/tasks/abc123_b
            String[] parts = href.split("/");
            String contestId = parts[2];
            String problemId = parts[4];
            String fullProblemUrl = "https://atcoder.jp" + href;

            // 3. Call task info API
            ResponseEntity<TaskInfo> response = restTemplate.getForEntity(
                    TASK_INFO_API + problemId,
                    TaskInfo.class
            );

            TaskInfo taskInfo = response.getBody();
            if (taskInfo == null) {
                System.err.println("No metadata found for problem: " + problemId);
                return null;
            }

            // 4. Build DTO
            ExternalProblemDTO dto = new ExternalProblemDTO();
            dto.setTitle(potdLink.text());
            dto.setProblemUrl(fullProblemUrl);
            dto.setPlatform(Platform.ATCODER.name());
            dto.setDifficulty(String.valueOf(taskInfo.getDifficulty()));
            dto.setDescription("Daily AtCoder problem from contest " + contestId);
            dto.setPoints(Difficulty.fromRating(taskInfo.getDifficulty()).getPoints());

            return dto;

        } catch (Exception e) {
            System.err.println("Error fetching AtCoder POTD: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    // Internal class to parse task info API
    public static class TaskInfo {
        private String problem_id;
        private int difficulty;

        public String getProblem_id() {
            return problem_id;
        }

        public void setProblem_id(String problem_id) {
            this.problem_id = problem_id;
        }

        public int getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(int difficulty) {
            this.difficulty = difficulty;
        }
    }
}
