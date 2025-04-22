package org.example.backend.service;

import org.example.backend.dto.TaskCreationRequest;
import org.example.backend.dto.TaskResponse;
import org.example.backend.entity.Task;
import org.example.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest
{

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task testTask;
    private TaskCreationRequest testRequest;
    private String userId = "testUser";

    @BeforeEach
    void setUp()
    {
        testTask = new Task();
        testTask.setId("testTaskId");
        testTask.setUserId(userId);
        testTask.setTitle("Test Task");
        testTask.setCompleted(false);
        testTask.setDueDate(LocalDate.now().toString());

        testRequest = new TaskCreationRequest();
        testRequest.setTitle("Test Task");
        testRequest.setDueDate(LocalDate.now().toString());
    }

    @Test
    void createTask_Success()
    {
        // Arrange
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // Act
        TaskResponse result = taskService.createTask(userId, testRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testTask.getTitle(), result.getTitle());
        assertEquals(testTask.getDueDate(), result.getDueDate());
        assertFalse(result.isCompleted());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void getAllTasksForUser_Success()
    {
        // Arrange
        List<Task> tasks = Arrays.asList(testTask);
        when(taskRepository.findByUserId(userId)).thenReturn(tasks);

        // Act
        List<TaskResponse> results = taskService.getAllTasksForUser(userId);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(testTask.getTitle(), results.get(0).getTitle());
        verify(taskRepository).findByUserId(userId);
    }

    @Test
    void getAllTasksForUser_ResetsCompletedTasks()
    {
        // Arrange
        Task completedTask = new Task();
        completedTask.setId("task2");
        completedTask.setUserId(userId);
        completedTask.setCompleted(true);
        completedTask.setLastCompletedDate(LocalDate.now().minusDays(1).toString());

        List<Task> tasks = Arrays.asList(completedTask);
        when(taskRepository.findByUserId(userId)).thenReturn(tasks);
        when(taskRepository.saveAll(any())).thenReturn(tasks);

        // Act
        List<TaskResponse> results = taskService.getAllTasksForUser(userId);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        verify(taskRepository).saveAll(any());
    }

    @Test
    void completeTask_Success()
    {
        // Arrange
        Task taskToComplete = new Task();
        taskToComplete.setId("testTaskId");
        taskToComplete.setUserId(userId);
        taskToComplete.setCompleted(false);

        Task completedTask = new Task();
        completedTask.setId("testTaskId");
        completedTask.setUserId(userId);
        completedTask.setCompleted(true);
        completedTask.setLastCompletedDate(LocalDate.now().toString());

        when(taskRepository.findById("testTaskId")).thenReturn(Optional.of(taskToComplete));
        when(taskRepository.save(any(Task.class))).thenReturn(completedTask);

        // Act
        TaskResponse result = taskService.completeTask(userId, "testTaskId");

        // Assert
        assertTrue(result.isCompleted());
        assertEquals(LocalDate.now().toString(), completedTask.getLastCompletedDate());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void completeTask_TaskNotFound()
    {
        // Arrange
        when(taskRepository.findById("nonExistentId")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                taskService.completeTask(userId, "nonExistentId")
        );
    }

    @Test
    void completeTask_WrongUser()
    {
        // Arrange
        when(taskRepository.findById("testTaskId")).thenReturn(Optional.of(testTask));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                taskService.completeTask("wrongUser", "testTaskId")
        );
    }

    @Test
    void completeTask_AlreadyCompletedToday()
    {
        // Arrange
        testTask.setCompleted(true);
        testTask.setLastCompletedDate(LocalDate.now().toString());
        when(taskRepository.findById("testTaskId")).thenReturn(Optional.of(testTask));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                taskService.completeTask(userId, "testTaskId")
        );
    }

    @Test
    void deleteTask_Success()
    {
        // Arrange
        when(taskRepository.findById("testTaskId")).thenReturn(Optional.of(testTask));
        doNothing().when(taskRepository).delete(any(Task.class));

        // Act
        taskService.deleteTask(userId, "testTaskId");

        // Assert
        verify(taskRepository).delete(testTask);
    }

    @Test
    void deleteTask_TaskNotFound()
    {
        // Arrange
        when(taskRepository.findById("testTaskId")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                taskService.deleteTask(userId, "testTaskId")
        );
    }

    @Test
    void deleteTask_WrongUser()
    {
        // Arrange
        when(taskRepository.findById("testTaskId")).thenReturn(Optional.of(testTask));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                taskService.deleteTask("wrongUser", "testTaskId")
        );
    }
}
