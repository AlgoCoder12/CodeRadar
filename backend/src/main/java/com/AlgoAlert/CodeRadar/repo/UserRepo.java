package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public interface UserRepo extends MongoRepository<User, String> {
    public User findByUsername(String username);
    public User findByEmail(String email);
    public Optional<User> findById(ObjectId id);
}
