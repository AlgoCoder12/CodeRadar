package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.EmailNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailNotificationRepository extends MongoRepository<EmailNotification, String> {
    
    // Find notification by user and contest
    Optional<EmailNotification> findByUserIdAndContestId(String userId, String contestId);
    
    // Check if notification already sent for user and contest
    boolean existsByUserIdAndContestId(String userId, String contestId);
    
    // Find all notifications for a user
    List<EmailNotification> findByUserId(String userId);
    
    // Find all notifications for a contest
    List<EmailNotification> findByContestId(String contestId);
    
    // Find failed notifications (for retry)
    @Query("{'delivered': false, 'failureReason': {$ne: null}}")
    List<EmailNotification> findFailedNotifications();
    
    // Find successful notifications
    @Query("{'delivered': true}")
    List<EmailNotification> findSuccessfulNotifications();
    
    // Delete old notifications (cleanup)
    @Query(value = "{'notificationSentAt': {$lt: ?0}}", delete = true)
    void deleteOldNotifications(LocalDateTime cutoffDate);
    
    // Find notifications sent within a time range
    @Query("{'notificationSentAt': {$gte: ?0, $lte: ?1}}")
    List<EmailNotification> findNotificationsBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    // Count successful notifications for a user
    @Query(value = "{'userId': ?0, 'delivered': true}", count = true)
    long countSuccessfulNotificationsByUser(String userId);
}
