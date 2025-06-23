package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.Contest;
import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.model.EmailNotification;
import com.AlgoAlert.CodeRadar.repo.EmailNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private EmailNotificationRepository emailNotificationRepository;

    @Value("${spring.mail.username:noreply@coderadar.com}")
    private String fromEmail;

    @Value("${app.name:CodeRadar}")
    private String appName;

    /**
     * Send contest notification email to a user
     */
    public boolean sendContestNotification(User user, Contest contest) {
        try {
            // Check if notification already sent
            if (emailNotificationRepository.existsByUserIdAndContestId(user.getId(), contest.getId())) {
                System.out.println("Notification already sent to " + user.getEmail() + " for contest " + contest.getName());
                return true;
            }

            // Create email notification record
            EmailNotification notification = EmailNotification.builder()
                .userId(user.getId())
                .contestId(contest.getId())
                .contestName(contest.getName())
                .platform(contest.getPlatform())
                .contestStartTime(contest.getStartTime())
                .emailAddress(user.getEmail())
                .notificationSentAt(java.time.LocalDateTime.now())
                .delivered(false)
                .build();

            try {
                // Send the email
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(user.getEmail());
                helper.setSubject("🚨 Contest Alert: " + contest.getName() + " starts in 12 hours!");

                // Generate email content
                String emailContent = generateContestNotificationEmail(user, contest);
                helper.setText(emailContent, true);

                // Send email
                mailSender.send(message);

                // Mark as delivered
                notification.setDelivered(true);
                emailNotificationRepository.save(notification);

                System.out.println("Contest notification sent successfully to " + user.getEmail() + 
                    " for contest: " + contest.getName());
                return true;

            } catch (MailException | MessagingException e) {
                // Mark as failed
                notification.setDelivered(false);
                notification.setFailureReason(e.getMessage());
                emailNotificationRepository.save(notification);

                System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
                return false;
            }

        } catch (Exception e) {
            System.err.println("Error processing email notification: " + e.getMessage());
            return false;
        }
    }

    /**
     * Send contest notifications to multiple users
     */
    public void sendContestNotifications(List<User> users, Contest contest) {
        System.out.println("Sending contest notifications for: " + contest.getName() + " to " + users.size() + " users");
        
        int successCount = 0;
        int failureCount = 0;

        for (User user : users) {
            try {
                if (sendContestNotification(user, contest)) {
                    successCount++;
                } else {
                    failureCount++;
                }
                
                // Add small delay to avoid overwhelming email server
                Thread.sleep(100);
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                failureCount++;
                System.err.println("Error sending notification to " + user.getEmail() + ": " + e.getMessage());
            }
        }

        System.out.println("Contest notification summary - Success: " + successCount + ", Failed: " + failureCount);
    }

    /**
     * Generate HTML email content for contest notification
     */
    private String generateContestNotificationEmail(User user, Contest contest) {
        try {
            Context context = new Context();
            
            // Add variables to template context
            context.setVariable("userName", user.getFullName() != null ? user.getFullName() : user.getUsername());
            context.setVariable("contestName", contest.getName());
            context.setVariable("platform", contest.getPlatform());
            context.setVariable("contestUrl", contest.getUrl());
            context.setVariable("startTime", contest.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            context.setVariable("endTime", contest.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            context.setVariable("duration", contest.getDurationMinutes() + " minutes");
            context.setVariable("appName", appName);
            context.setVariable("currentYear", LocalDateTime.now().getYear());

            // Calculate time until contest
            LocalDateTime now = LocalDateTime.now();
            long hoursUntil = java.time.Duration.between(now, contest.getStartTime()).toHours();
            context.setVariable("hoursUntil", hoursUntil);

            // Process template
            return templateEngine.process("contest-notification", context);

        } catch (Exception e) {
            System.err.println("Error generating email template: " + e.getMessage());
            // Fallback to simple text email
            return generateSimpleTextEmail(user, contest);
        }
    }

    /**
     * Generate simple text email as fallback
     */
    private String generateSimpleTextEmail(User user, Contest contest) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>");
        sb.append("<html><head><title>Contest Notification</title></head><body>");
        sb.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>");
        
        sb.append("<h2 style='color: #2c3e50;'>🚨 Contest Alert!</h2>");
        sb.append("<p>Hi ").append(user.getFullName() != null ? user.getFullName() : user.getUsername()).append(",</p>");
        
        sb.append("<p>This is a reminder that the contest <strong>").append(contest.getName()).append("</strong> ");
        sb.append("on <strong>").append(contest.getPlatform()).append("</strong> is starting in approximately 12 hours!</p>");
        
        sb.append("<div style='background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;'>");
        sb.append("<h3 style='margin-top: 0; color: #495057;'>Contest Details:</h3>");
        sb.append("<p><strong>Contest:</strong> ").append(contest.getName()).append("</p>");
        sb.append("<p><strong>Platform:</strong> ").append(contest.getPlatform()).append("</p>");
        sb.append("<p><strong>Start Time:</strong> ").append(contest.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("</p>");
        sb.append("<p><strong>Duration:</strong> ").append(contest.getDurationMinutes()).append(" minutes</p>");
        sb.append("</div>");
        
        sb.append("<p><a href='").append(contest.getUrl()).append("' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Join Contest</a></p>");
        
        sb.append("<p>Good luck and happy coding! 🚀</p>");
        sb.append("<hr style='margin: 30px 0;'>");
        sb.append("<p style='color: #6c757d; font-size: 12px;'>You received this email because you have contest notifications enabled in your ").append(appName).append(" account.</p>");
        
        sb.append("</div></body></html>");
        
        return sb.toString();
    }

    /**
     * Send test email to verify email configuration
     */
    public boolean sendTestEmail(String toEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Test Email from " + appName);
            helper.setText(generateTestEmailContent(), true);

            mailSender.send(message);
            System.out.println("Test email sent successfully to " + toEmail);
            return true;

        } catch (Exception e) {
            System.err.println("Failed to send test email: " + e.getMessage());
            return false;
        }
    }

    /**
     * Generate test email content
     */
    private String generateTestEmailContent() {
        return "<!DOCTYPE html>" +
               "<html><head><title>Test Email</title></head><body>" +
               "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
               "<h2 style='color: #28a745;'>✅ Email Configuration Test</h2>" +
               "<p>This is a test email to verify that your " + appName + " email configuration is working correctly.</p>" +
               "<p>If you received this email, your email notifications are set up properly!</p>" +
               "<p><strong>Timestamp:</strong> " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "</p>" +
               "<hr>" +
               "<p style='color: #6c757d; font-size: 12px;'>This is an automated test email from " + appName + ".</p>" +
               "</div></body></html>";
    }

    /**
     * Retry failed notifications
     */
    public void retryFailedNotifications() {
        List<EmailNotification> failedNotifications = emailNotificationRepository.findFailedNotifications();
        System.out.println("Retrying " + failedNotifications.size() + " failed notifications");

        for (EmailNotification notification : failedNotifications) {
            try {
                // Only retry notifications that are not too old (within 24 hours)
                if (notification.getNotificationSentAt().isAfter(LocalDateTime.now().minusHours(24))) {
                    // Here you would need to fetch user and contest data to retry
                    // For now, just log the attempt
                    System.out.println("Would retry notification for user: " + notification.getUserId() + 
                        ", contest: " + notification.getContestName());
                }
            } catch (Exception e) {
                System.err.println("Error retrying notification: " + e.getMessage());
            }
        }
    }

    /**
     * Clean up old email notifications
     */
    public void cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        emailNotificationRepository.deleteOldNotifications(cutoffDate);
        System.out.println("Cleaned up email notifications older than 30 days");
    }
}
