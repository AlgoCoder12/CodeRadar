package com.AlgoAlert.CodeRadar.repo;

import com.AlgoAlert.CodeRadar.model.ScheduleEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleEntryRepository extends MongoRepository<ScheduleEntry, String> {
    List<ScheduleEntry> findByUserId(String userId);
    void deleteByUserId(String userId);
} 