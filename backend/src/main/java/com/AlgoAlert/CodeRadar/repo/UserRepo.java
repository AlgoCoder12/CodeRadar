package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableMongoRepositories
public interface UserRepo extends MongoRepository<User, String> {
    public User findByUsername(String username);
    public User findByEmail(String email);
    public Optional<User> findById(ObjectId id);
}
