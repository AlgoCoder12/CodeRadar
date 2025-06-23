package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.ProblemOfTheDay;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ProblemOfTheDayRepo extends MongoRepository<ProblemOfTheDay, String> {
    Optional<ProblemOfTheDay> findByDate(LocalDate date);
    Optional<ProblemOfTheDay> findByDateAndIsActiveTrue(LocalDate date);
} 