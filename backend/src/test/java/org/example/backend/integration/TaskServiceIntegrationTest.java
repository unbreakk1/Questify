package org.example.backend.integration;

import org.example.backend.dto.TaskCreationRequest;
import org.example.backend.dto.TaskResponse;
import org.example.backend.entity.Task;
import org.example.backend.repository.TaskRepository;
import org.example.backend.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class TaskServiceIntegrationTest
{

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp()
    {
        // Clean up the database before each test
        taskRepository.deleteAll();
    }


    @Test
    void createTask_Success()
    {
        // Arrange
        String userId = "testUser";
        TaskCreationRequest request = new TaskCreationRequest();
        request.setTitle("Integration Test Task");
        request.setDueDate(LocalDate.now().toString());

        // Act
        TaskResponse result = taskService.createTask(userId, request);

        // Assert
        assertNotNull(result);
        assertEquals(request.getTitle(), result.getTitle());
        assertEquals(request.getDueDate(), result.getDueDate());
        assertFalse(result.isCompleted());

        // Verify in database
        Task savedTask = taskRepository.findById(result.getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        assertEquals(request.getTitle(), savedTask.getTitle());
        assertEquals(userId, savedTask.getUserId());
    }

    @Test
    void getAllTasksForUser_Success()
    {
        // Arrange
        String userId = "testUser";

        // Create two test tasks
        createTestTask(userId, "Test Task 1");
        createTestTask(userId, "Test Task 2");

        // Act
        List<TaskResponse> results = taskService.getAllTasksForUser(userId);

        // Assert
        assertEquals(2, results.size());

        // First, collect all IDs
        List<String> taskIds = results.stream()
                .map(TaskResponse::getId)
                .toList();

        // Then, find all tasks
        List<Task> savedTasks = taskIds.stream()
                .map(id -> taskRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Task not found: " + id)))
                .toList();

        // Finally, verify user IDs
        boolean allTasksBelongToUser = savedTasks.stream()
                .map(Task::getUserId)
                .allMatch(userId::equals);

        assertTrue(allTasksBelongToUser);
    }


    @Test
    void completeTask_Success()
    {
        // Arrange
        String userId = "testUser";
        Task task = createTestTask(userId, "Task to Complete");

        // Act
        TaskResponse result = taskService.completeTask(userId, task.getId());

        // Assert
        assertTrue(result.isCompleted());

        // Verify in database
        Task savedTask = taskRepository.findById(task.getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        assertTrue(savedTask.isCompleted());
        assertEquals(LocalDate.now().toString(), savedTask.getLastCompletedDate());
    }

    @Test
    void completeTask_WrongUser()
    {
        // Arrange
        String userId = "testUser";
        Task task = createTestTask(userId, "Test Task");
        String taskId = task.getId();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
        {
            taskService.completeTask("wrongUser", taskId);
        });
    }


    @Test
    void completeTask_AlreadyCompletedToday()
    {
        // Arrange
        String userId = "testUser";
        Task task = createTestTask(userId, "Test Task");
        String taskId = task.getId();
        task.setCompleted(true);
        task.setLastCompletedDate(LocalDate.now().toString());
        taskRepository.save(task);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
        {
            taskService.completeTask(userId, taskId);
        });
    }


    @Test
    void deleteTask_Success()
    {
        // Arrange
        String userId = "testUser";
        Task task = createTestTask(userId, "Task to Delete");

        // Act
        taskService.deleteTask(userId, task.getId());

        // Assert
        Optional<Task> deletedTask = taskRepository.findById(task.getId());
        assertTrue(deletedTask.isEmpty());
    }

    @Test
    void deleteTask_WrongUser()
    {
        // Arrange
        String userId = "testUser";
        Task task = createTestTask(userId, "Test Task");
        String taskId = task.getId();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
        {
            taskService.deleteTask("wrongUser", taskId);
        });
    }


    private Task createTestTask(String userId, String title)
    {
        Task task = new Task();
        task.setUserId(userId);
        task.setTitle(title);
        task.setDueDate(LocalDate.now().toString());
        task.setCompleted(false);
        return taskRepository.save(task);
    }
}