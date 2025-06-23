package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContestNotificationService {

    @Autowired
    private ContestService contestService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Check for contests needing notifications every hour
    @Scheduled(fixedRate = 60 * 60 * 1000) // 1 hour in milliseconds
    public void checkAndSendContestNotifications() {
        System.out.println("Checking for contests needing 12-hour notifications at: " + LocalDateTime.now());

        try {
            // Get all upcoming contests
            List<Contest> upcomingContests = contestService.getUpcomingContests();
            
            // Find contests that start in approximately 12 hours (11-13 hours window)
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime windowStart = now.plusHours(11);
            LocalDateTime windowEnd = now.plusHours(13);

            List<Contest> contestsToNotify = upcomingContests.stream()
                .filter(contest -> contest.getStartTime().isAfter(windowStart) && 
                                 contest.getStartTime().isBefore(windowEnd))
                .collect(Collectors.toList());

            System.out.println("Found " + contestsToNotify.size() + " contests starting in 12 hours");

            // Send notifications for each contest
            for (Contest contest : contestsToNotify) {
                sendNotificationsForContest(contest);
            }

        } catch (Exception e) {
            System.err.println("Error in contest notification check: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send notifications for a specific contest
     */
    public void sendNotificationsForContest(Contest contest) {
        try {
            System.out.println("Processing notifications for contest: " + contest.getName() + 
                " (" + contest.getPlatform() + ")");

            // Get users who want notifications and are subscribed to this platform
            List<User> usersToNotify = getUsersInterestedInContest(contest);

            if (usersToNotify.isEmpty()) {
                System.out.println("No users found for contest notifications: " + contest.getName());
                return;
            }

            System.out.println("Sending notifications to " + usersToNotify.size() + 
                " users for contest: " + contest.getName());

            // Send notifications
            emailService.sendContestNotifications(usersToNotify, contest);

        } catch (Exception e) {
            System.err.println("Error sending notifications for contest " + contest.getName() + ": " + e.getMessage());
        }
    }

    /**
     * Get users who should receive notifications for a specific contest
     */
    private List<User> getUsersInterestedInContest(Contest contest) {
        // Get all users with email notifications enabled
        List<User> usersWithNotifications = userRepository.findUsersWithEmailNotificationsEnabled();

        // Filter users based on their platform preferences
        return usersWithNotifications.stream()
            .filter(user -> user.getEmail() != null && !user.getEmail().isEmpty())
            .filter(user -> isUserInterestedInPlatform(user, contest.getPlatform()))
            .collect(Collectors.toList());
    }

    /**
     * Check if user is interested in a specific platform
     */
    private boolean isUserInterestedInPlatform(User user, String platform) {
        // If user has no platform preferences, send notifications for all platforms
        if (user.getFavPlatforms() == null || user.getFavPlatforms().isEmpty()) {
            return true;
        }

        // Check if the contest platform is in user's favorite platforms
        return user.getFavPlatforms().stream()
            .anyMatch(favPlatform -> favPlatform.equalsIgnoreCase(platform));
    }

    /**
     * Manual method to send notifications for upcoming contests (for testing)
     */
    public void sendImmediateNotifications() {
        System.out.println("Sending immediate notifications for all upcoming contests...");

        try {
            List<Contest> upcomingContests = contestService.getUpcomingContests();
            
            // For immediate testing, take contests starting within next 24 hours
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime windowEnd = now.plusHours(24);

            List<Contest> contestsToNotify = upcomingContests.stream()
                .filter(contest -> contest.getStartTime().isBefore(windowEnd))
                .limit(5) // Limit to first 5 contests for testing
                .collect(Collectors.toList());

            System.out.println("Sending immediate notifications for " + contestsToNotify.size() + " contests");

            for (Contest contest : contestsToNotify) {
                sendNotificationsForContest(contest);
            }

        } catch (Exception e) {
            System.err.println("Error in immediate notification sending: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Get notification statistics
     */
    public String getNotificationStatistics() {
        try {
            List<User> usersWithNotifications = userRepository.findUsersWithEmailNotificationsEnabled();
            List<Contest> upcomingContests = contestService.getUpcomingContests();

            // Count contests in next 12 hours
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime windowStart = now.plusHours(11);
            LocalDateTime windowEnd = now.plusHours(13);

            long contestsIn12Hours = upcomingContests.stream()
                .filter(contest -> contest.getStartTime().isAfter(windowStart) && 
                                 contest.getStartTime().isBefore(windowEnd))
                .count();

            StringBuilder stats = new StringBuilder();
            stats.append("📊 Contest Notification Statistics\n");
            stats.append("═══════════════════════════════════\n");
            stats.append("👥 Users with notifications enabled: ").append(usersWithNotifications.size()).append("\n");
            stats.append("📅 Total upcoming contests: ").append(upcomingContests.size()).append("\n");
            stats.append("⏰ Contests starting in ~12 hours: ").append(contestsIn12Hours).append("\n");
            stats.append("🕐 Current time: ").append(now).append("\n");
            stats.append("📧 Next notification check: ").append(now.plusHours(1)).append("\n");

            return stats.toString();

        } catch (Exception e) {
            return "Error generating statistics: " + e.getMessage();
        }
    }

    /**
     * Add a test user for notification testing
     */
    public User createTestUser(String email, String name) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return userRepository.findByEmail(email).orElse(null);
            }

            // Create new test user
            User testUser = User.builder()
                .email(email)
                .fullName(name)
                .username(name.toLowerCase().replace(" ", ""))
                .emailPrefs(true)
                .favPlatforms(List.of("Codeforces", "LeetCode", "AtCoder", "GeeksforGeeks", "CS Academy", "TopCoder"))
                .build();

            User savedUser = userRepository.save(testUser);
            System.out.println("Created test user: " + email);
            return savedUser;

        } catch (Exception e) {
            System.err.println("Error creating test user: " + e.getMessage());
            return null;
        }
    }

    /**
     * Send test notification to specific user
     */
    public boolean sendTestNotification(String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                System.err.println("User not found: " + userEmail);
                return false;
            }

            // Get any upcoming contest for testing
            List<Contest> upcomingContests = contestService.getUpcomingContests();
            if (upcomingContests.isEmpty()) {
                System.err.println("No upcoming contests found for test notification");
                return false;
            }

            Contest testContest = upcomingContests.get(0);
            return emailService.sendContestNotification(user, testContest);

        } catch (Exception e) {
            System.err.println("Error sending test notification: " + e.getMessage());
            return false;
        }
    }
}
