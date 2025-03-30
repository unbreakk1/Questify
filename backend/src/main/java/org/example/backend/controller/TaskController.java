package org.example.backend.controller;

import org.example.backend.dto.TaskCreationRequest;
import org.example.backend.dto.TaskResponse;
import org.example.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController
{

    private final TaskService taskService;

    public TaskController(TaskService taskService)
    {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(Authentication authentication, @RequestBody TaskCreationRequest request)
    {
        String userId = authentication.getName(); // Extract user ID from JWT token
        TaskResponse taskResponse = taskService.createTask(userId, request);
        return ResponseEntity.ok(taskResponse);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication)
    {
        String userId = authentication.getName(); // Extract userId from the authentication context
        System.out.println("Authenticated userId: " + userId); // Debug log

        // Retrieve all tasks for the user, ignoring the date
        List<TaskResponse> tasks = taskService.getAllTasksForUser(userId);
        return ResponseEntity.ok(tasks);
    }


    @PutMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(Authentication authentication,
                                                     @PathVariable String taskId)
    {
        String userId = authentication.getName();
        TaskResponse updatedTask = taskService.completeTask(userId, taskId);
        return ResponseEntity.ok(updatedTask);
    }
}