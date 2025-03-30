package org.example.backend.repository;

import org.example.backend.entity.Habit;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HabitRepository extends MongoRepository<Habit, String>
{
    List<Habit> findByUserId(String userId); // Retrieve all habits for a user
}