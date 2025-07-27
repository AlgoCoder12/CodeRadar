package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.ContestPerformance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContestPerformanceRepository extends MongoRepository<ContestPerformance, String> {
    
    // Find performances by user
    List<ContestPerformance> findByUserIdOrderByContestStartTimeDesc(String userId);
    
    // Find performances by user and platform
    List<ContestPerformance> findByUserIdAndPlatformOrderByContestStartTimeDesc(String userId, String platform);
    
    // Find performances by contest
    List<ContestPerformance> findByContestId(String contestId);
    
    // Find performances where user participated
    List<ContestPerformance> findByUserIdAndParticipatedTrueOrderByContestStartTimeDesc(String userId);
    
    // Find performances where user was registered but didn't participate
    List<ContestPerformance> findByUserIdAndWasRegisteredTrueAndParticipatedFalseOrderByContestStartTimeDesc(String userId);
    
    // Find performances in date range
    @Query("{'userId': ?0, 'contestStartTime': {$gte: ?1, $lte: ?2}}")
    List<ContestPerformance> findByUserIdAndContestStartTimeBetween(String userId, LocalDateTime start, LocalDateTime end);
    
    // Find performances by platform in date range
    @Query("{'userId': ?0, 'platform': ?1, 'contestStartTime': {$gte: ?2, $lte: ?3}}")
    List<ContestPerformance> findByUserIdAndPlatformAndContestStartTimeBetween(String userId, String platform, LocalDateTime start, LocalDateTime end);
    
    // Count total contests participated by user
    long countByUserIdAndParticipatedTrue(String userId);
    
    // Count contests by platform for user
    long countByUserIdAndPlatformAndParticipatedTrue(String userId, String platform);
    
    // Find average rating change by platform
    @Query("{'userId': ?0, 'platform': ?1, 'ratingChange': {$exists: true}}")
    List<ContestPerformance> findByUserIdAndPlatformAndRatingChangeExists(String userId, String platform);
} 