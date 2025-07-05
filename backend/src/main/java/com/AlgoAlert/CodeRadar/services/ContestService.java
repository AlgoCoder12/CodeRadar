package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.AlgoAlert.CodeRadar.repo.ContestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContestService {

    @Autowired
    private ContestRepository contestRepository;

    // Get all contests
    @Cacheable(value = "contests", key = "'all'")
    public List<Contest> getAllContests() {
        return contestRepository.findAllByOrderByStartTimeAsc();
    }

    // Get upcoming contests
    @Cacheable(value = "contests", key = "'upcoming'")
    public List<Contest> getUpcomingContests() {
        return contestRepository.findUpcomingContests(LocalDateTime.now());
    }

    // Get contests by platform
    @Cacheable(value = "contests", key = "#platform")
    public List<Contest> getContestsByPlatform(String platform) {
        return contestRepository.findByPlatformIgnoreCase(platform);
    }

    // Get upcoming contests by platform
    @Cacheable(value = "contests", key = "'upcoming_' + #platform")
    public List<Contest> getUpcomingContestsByPlatform(String platform) {
        return contestRepository.findUpcomingContestsByPlatformIgnoreCase(platform, LocalDateTime.now());
    }

    // Get active contests (currently running)
    @Cacheable(value = "contests", key = "'active'")
    public List<Contest> getActiveContests() {
        return contestRepository.findActiveContests(LocalDateTime.now());
    }

    // Get contests within a date range
    public List<Contest> getContestsBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return contestRepository.findContestsBetween(startTime, endTime);
    }

    // Get contests by multiple platforms
    public List<Contest> getContestsByPlatforms(List<String> platforms) {
        return contestRepository.findByPlatformIn(platforms);
    }

    // Save a contest (avoiding duplicates)
    @CacheEvict(value = "contests", allEntries = true)
    public Contest saveContest(Contest contest) {
        // Check if contest already exists
        Optional<Contest> existingContest = contestRepository.findByNameAndPlatform(
                contest.getName(), contest.getPlatform());

        if (existingContest.isPresent()) {
            // Update existing contest with new information
            Contest existing = existingContest.get();
            existing.setUrl(contest.getUrl());
            existing.setStartTime(contest.getStartTime());
            existing.setEndTime(contest.getEndTime());
            existing.setDurationMinutes(contest.getDurationMinutes());
            existing.setDescription(contest.getDescription());
            existing.setFetchedAt(LocalDateTime.now());
            return contestRepository.save(existing);
        } else {
            // Save new contest
            contest.setFetchedAt(LocalDateTime.now());
            return contestRepository.save(contest);
        }
    }

    // Save multiple contests
    public List<Contest> saveContests(List<Contest> contests) {
        return contests.stream()
                .map(this::saveContest)
                .toList();
    }

    // Delete old contests (older than specified days)
    public void deleteOldContests(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        contestRepository.deleteOldContests(cutoffDate);
    }

    // Get contest by ID
    public Optional<Contest> getContestById(String id) {
        return contestRepository.findById(id);
    }

    // Delete contest by ID
    public void deleteContestById(String id) {
        contestRepository.deleteById(id);
    }

    // Get contest count by platform
    public long getContestCountByPlatform(String platform) {
        return contestRepository.countByPlatformIgnoreCase(platform);
    }

    // Get total contest count
    public long getTotalContestCount() {
        return contestRepository.count();
    }

    // Get upcoming contests count
    public long getUpcomingContestCount() {
        return contestRepository.countUpcomingContests(LocalDateTime.now());
    }

    // Get active contests count
    public long getActiveContestCount() {
        return contestRepository.countActiveContests(LocalDateTime.now());
    }
}
