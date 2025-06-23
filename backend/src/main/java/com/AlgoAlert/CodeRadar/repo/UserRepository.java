package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Find user by username
    Optional<User> findByUsername(String username);
    
    // Find all users with email notifications enabled
    @Query("{'emailPrefs': true}")
    List<User> findUsersWithEmailNotificationsEnabled();
    
    // Find users who have subscribed to specific platforms
    @Query("{'emailPrefs': true, 'favPlatforms': {$in: ?0}}")
    List<User> findUsersSubscribedToPlatforms(List<String> platforms);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
}
