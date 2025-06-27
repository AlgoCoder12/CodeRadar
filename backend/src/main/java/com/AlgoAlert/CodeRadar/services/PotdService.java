package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Platform;
import com.AlgoAlert.CodeRadar.services.platforms.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PotdService {
    
    @Autowired
    private LeetCodeService leetCodeService;
    
    @Autowired
    private CodeforcesService codeforcesService;
    
    @Autowired
    private GeeksForGeeksService geeksForGeeksService;


    
    @Autowired
    private CodeChefService codeChefService;
    
    @Autowired
    private HackerRankService hackerRankService;


    public ExternalProblemDTO getProblemByPlatform(String platform) {
        return switch (Platform.valueOf(platform.toUpperCase())) {
            case LEETCODE -> leetCodeService.getDailyProblem();
            case CODEFORCES -> codeforcesService.getDailyProblem();
            case GEEKSFORGEEKS -> geeksForGeeksService.getDailyProblem();
            case CODECHEF -> codeChefService.getDailyProblem();
            case HACKERRANK -> hackerRankService.getDailyProblem();
        };
    }


    public ExternalProblemDTO getProblemByRangeOnCF(String topic, Integer minRating, Integer maxRating) {
        return codeforcesService.getProblemByTopicAndDifficulty(topic, minRating, maxRating);
    }

    public List<ExternalProblemDTO> getAllProblems() {
        return List.of(
            leetCodeService.getDailyProblem(),
            codeforcesService.getDailyProblem(),
            geeksForGeeksService.getDailyProblem(),
            codeChefService.getDailyProblem(),
            hackerRankService.getDailyProblem()
        ).stream()
        .filter(problem -> problem != null)
        .toList();
    }
}
