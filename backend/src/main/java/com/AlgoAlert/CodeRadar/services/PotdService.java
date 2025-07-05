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


    public ExternalProblemDTO getProblemByPlatform(String platform) {
        return switch (Platform.valueOf(platform.toUpperCase())) {
            case LEETCODE -> leetCodeService.getDailyProblem();
            case CODEFORCES -> codeforcesService.getDailyProblem();
        };
    }


    public ExternalProblemDTO getProblemByRangeOnCF(String topic, Integer minRating, Integer maxRating) {
        return codeforcesService.getProblemByTopicAndDifficulty(topic, minRating, maxRating);
    }

    public List<ExternalProblemDTO> getAllProblems() {
        return List.of(
            leetCodeService.getDailyProblem(),
            codeforcesService.getDailyProblem()
        ).stream()
        .filter(problem -> problem != null)
        .toList();
    }
}
