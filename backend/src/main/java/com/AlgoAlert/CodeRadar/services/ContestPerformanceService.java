package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.AlgoAlert.CodeRadar.model.ContestPerformance;
import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.repo.ContestPerformanceRepository;
import com.AlgoAlert.CodeRadar.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ContestPerformanceService {

    @Autowired
    private ContestPerformanceRepository performanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlatformVerificationService platformVerificationService;

    /**
     * Track contest performance for a user
     */
    public ContestPerformance trackPerformance(String userId, String contestId, Contest contest, 
                                            boolean wasRegistered, boolean participated, 
                                            Integer rank, Integer score, Integer maxScore) {
        
        ContestPerformance performance = ContestPerformance.builder()
                .userId(userId)
                .contestId(contestId)
                .contestName(contest.getName())
                .platform(contest.getPlatform())
                .contestStartTime(contest.getStartTime())
                .contestEndTime(contest.getEndTime())
                .performanceRecordedAt(LocalDateTime.now())
                .wasRegistered(wasRegistered)
                .participated(participated)
                .rank(rank)
                .score(score)
                .maxScore(maxScore)
                .build();

        return performanceRepository.save(performance);
    }

    /**
     * Get user's contest performances
     */
    public List<ContestPerformance> getUserPerformances(String userId) {
        return performanceRepository.findByUserIdOrderByContestStartTimeDesc(userId);
    }

    /**
     * Get user's performances by platform
     */
    public List<ContestPerformance> getUserPerformancesByPlatform(String userId, String platform) {
        return performanceRepository.findByUserIdAndPlatformOrderByContestStartTimeDesc(userId, platform);
    }

    /**
     * Get user's participation statistics
     */
    public Map<String, Object> getUserParticipationStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Total contests participated
        long totalParticipated = performanceRepository.countByUserIdAndParticipatedTrue(userId);
        stats.put("totalParticipated", totalParticipated);
        
        // Contests by platform
        List<String> platforms = Arrays.asList("Codeforces", "LeetCode", "CodeChef", "AtCoder");
        Map<String, Long> platformStats = new HashMap<>();
        
        for (String platform : platforms) {
            long count = performanceRepository.countByUserIdAndPlatformAndParticipatedTrue(userId, platform);
            platformStats.put(platform, count);
        }
        stats.put("platformStats", platformStats);
        
        // Recent performances
        List<ContestPerformance> recentPerformances = performanceRepository
                .findByUserIdAndParticipatedTrueOrderByContestStartTimeDesc(userId)
                .stream()
                .limit(10)
                .collect(Collectors.toList());
        stats.put("recentPerformances", recentPerformances);
        
        return stats;
    }

    /**
     * Get user's performance analytics
     */
    public Map<String, Object> getUserPerformanceAnalytics(String userId) {
        Map<String, Object> analytics = new HashMap<>();
        
        List<ContestPerformance> performances = performanceRepository
                .findByUserIdAndParticipatedTrueOrderByContestStartTimeDesc(userId);
        
        if (performances.isEmpty()) {
            analytics.put("message", "No performance data available");
            return analytics;
        }
        
        // Overall statistics
        double avgRank = performances.stream()
                .filter(p -> p.getRank() != null)
                .mapToInt(ContestPerformance::getRank)
                .average()
                .orElse(0.0);
        
        double avgScore = performances.stream()
                .filter(p -> p.getScore() != null && p.getMaxScore() != null)
                .mapToDouble(p -> (double) p.getScore() / p.getMaxScore() * 100)
                .average()
                .orElse(0.0);
        
        analytics.put("avgRank", avgRank);
        analytics.put("avgScore", avgScore);
        analytics.put("totalContests", performances.size());
        
        // Platform-wise analytics
        Map<String, Map<String, Object>> platformAnalytics = new HashMap<>();
        Set<String> platforms = performances.stream()
                .map(ContestPerformance::getPlatform)
                .collect(Collectors.toSet());
        
        for (String platform : platforms) {
            List<ContestPerformance> platformPerformances = performances.stream()
                    .filter(p -> platform.equals(p.getPlatform()))
                    .collect(Collectors.toList());
            
            Map<String, Object> platformStats = new HashMap<>();
            platformStats.put("totalContests", platformPerformances.size());
            
            double platformAvgRank = platformPerformances.stream()
                    .filter(p -> p.getRank() != null)
                    .mapToInt(ContestPerformance::getRank)
                    .average()
                    .orElse(0.0);
            platformStats.put("avgRank", platformAvgRank);
            
            double platformAvgScore = platformPerformances.stream()
                    .filter(p -> p.getScore() != null && p.getMaxScore() != null)
                    .mapToDouble(p -> (double) p.getScore() / p.getMaxScore() * 100)
                    .average()
                    .orElse(0.0);
            platformStats.put("avgScore", platformAvgScore);
            
            platformAnalytics.put(platform, platformStats);
        }
        
        analytics.put("platformAnalytics", platformAnalytics);
        
        return analytics;
    }

    /**
     * Get contests where user missed registration
     */
    public List<ContestPerformance> getMissedRegistrations(String userId) {
        return performanceRepository.findByUserIdAndWasRegisteredTrueAndParticipatedFalseOrderByContestStartTimeDesc(userId);
    }

    /**
     * Update performance data for a contest
     */
    public ContestPerformance updatePerformance(String performanceId, ContestPerformance updatedPerformance) {
        Optional<ContestPerformance> existing = performanceRepository.findById(performanceId);
        if (existing.isPresent()) {
            ContestPerformance current = existing.get();
            current.setRank(updatedPerformance.getRank());
            current.setScore(updatedPerformance.getScore());
            current.setMaxScore(updatedPerformance.getMaxScore());
            current.setParticipated(updatedPerformance.isParticipated());
            current.setTimeSpent(updatedPerformance.getTimeSpent());
            current.setRatingChange(updatedPerformance.getRatingChange());
            current.setNewRating(updatedPerformance.getNewRating());
            current.setPerformanceRecordedAt(LocalDateTime.now());
            
            return performanceRepository.save(current);
        }
        return null;
    }
} 