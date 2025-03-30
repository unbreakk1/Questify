package org.example.backend.repository;

import org.example.backend.entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String>
{
    List<Task> findByUserIdAndDueDate(String userId, String dueDate);// Find tasks for a specific user and day
    List<Task> findByUserId(String userId);
}