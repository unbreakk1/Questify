package org.example.backend.controller;

import org.example.backend.dto.TaskCreationRequest;
import org.example.backend.dto.TaskResponse;
import org.example.backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    @ResponseStatus(HttpStatus.OK) // 200 OK, task created successfully
    public TaskResponse createTask(Authentication authentication, @RequestBody TaskCreationRequest request)
    {
        String userId = authentication.getName(); // Extract user ID from the JWT token
        return taskService.createTask(userId, request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK) // 200 OK, successfully retrieved tasks
    public List<TaskResponse> getAllTasks(Authentication authentication)
    {
        System.out.println("GET /tasks called at: " + LocalDateTime.now());

        String userId = authentication.getName(); // Extract user ID from the authentication context

        // Retrieve all tasks for the user
        return taskService.getAllTasksForUser(userId);
    }

    @PutMapping("/{taskId}/complete")
    @ResponseStatus(HttpStatus.OK) // 200 OK, task marked as complete
    public TaskResponse completeTask(Authentication authentication, @PathVariable String taskId)
    {
        String userId = authentication.getName();
        return taskService.completeTask(userId, taskId);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content, task successfully deleted
    public void deleteTask(Authentication authentication, @PathVariable String taskId)
    {
        String userId = authentication.getName();
        taskService.deleteTask(userId, taskId);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgumentException(IllegalArgumentException ex)
    {
        return ex.getMessage();
    }

    @ExceptionHandler({IllegalStateException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleIllegalStateException(IllegalStateException ex)
    {
        return ex.getMessage();
    }
}