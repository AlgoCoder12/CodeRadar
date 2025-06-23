package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.Contest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContestRepository extends MongoRepository<Contest, String> {
    
    // Find contests by platform
    List<Contest> findByPlatform(String platform);
    
    // Find contests by platform (case insensitive)
    List<Contest> findByPlatformIgnoreCase(String platform);
    
    // Find upcoming contests (start time is in the future)
    @Query("{'startTime': {$gte: ?0}}")
    List<Contest> findUpcomingContests(LocalDateTime currentTime);
    
    // Find upcoming contests by platform
    @Query("{'platform': ?0, 'startTime': {$gte: ?1}}")
    List<Contest> findUpcomingContestsByPlatform(String platform, LocalDateTime currentTime);
    
    // Find upcoming contests by platform (case insensitive)
    @Query("{'platform': {$regex: ?0, $options: 'i'}, 'startTime': {$gte: ?1}}")
    List<Contest> findUpcomingContestsByPlatformIgnoreCase(String platform, LocalDateTime currentTime);
    
    // Find contests within a time range
    @Query("{'startTime': {$gte: ?0, $lte: ?1}}")
    List<Contest> findContestsBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    // Find contest by name and platform to avoid duplicates
    Optional<Contest> findByNameAndPlatform(String name, String platform);
    
    // Find contests ordered by start time
    List<Contest> findAllByOrderByStartTimeAsc();
    
    // Find upcoming contests ordered by start time
    @Query("{'startTime': {$gte: ?0}}")
    List<Contest> findUpcomingContestsOrderByStartTime(LocalDateTime currentTime);
    
    // Delete old contests (older than specified date)
    @Query(value = "{'startTime': {$lt: ?0}}", delete = true)
    void deleteOldContests(LocalDateTime cutoffDate);
    
    // Count contests by platform
    long countByPlatform(String platform);
    
    // Find contests by multiple platforms
    @Query("{'platform': {$in: ?0}}")
    List<Contest> findByPlatformIn(List<String> platforms);
    
    // Find active contests (currently running)
    @Query("{'startTime': {$lte: ?0}, 'endTime': {$gte: ?0}}")
    List<Contest> findActiveContests(LocalDateTime currentTime);
}
