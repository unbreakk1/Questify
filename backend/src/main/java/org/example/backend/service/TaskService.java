package org.example.backend.service;

import org.example.backend.dto.TaskCreationRequest;
import org.example.backend.dto.TaskResponse;
import org.example.backend.entity.Task;
import org.example.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService
{
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository)
    {
        this.taskRepository = taskRepository;
    }

    // Create a new task
    public TaskResponse createTask(String userId, TaskCreationRequest request)
    {
        Task task = new Task();
        task.setUserId(userId);
        task.setTitle(request.getTitle());
        task.setCompleted(false);
        task.setDueDate(request.getDueDate());

        Task savedTask = taskRepository.save(task);
        return new TaskResponse(savedTask.getId(), savedTask.getTitle(), savedTask.isCompleted(), savedTask.getDueDate());
    }

    // Retrieve all tasks for a specific user on a given day
    public List<TaskResponse> getAllTasksForUser(String userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        LocalDate today = LocalDate.now();

        System.out.println("Found " + tasks.size() + " tasks for user: " + userId);

        List<Task> tasksToUpdate = new ArrayList<>();

        // First, collect tasks that need updating
        for (Task task : tasks) {
            if (task.isCompleted() && !today.toString().equals(task.getLastCompletedDate())) {
                task.setCompleted(false);
                task.setLastCompletedDate(null);
                tasksToUpdate.add(task);
            }
        }

        // Then, if there are any tasks to update, save them all at once
        if (!tasksToUpdate.isEmpty()) {
            taskRepository.saveAll(tasksToUpdate);
        }

        // Return the responses
        return tasks.stream()
                .map(task -> new TaskResponse(task.getId(), task.getTitle(), task.isCompleted(), task.getDueDate()))
                .toList();
    }



    // Mark a task as completed
    public TaskResponse completeTask(String userId, String taskId)
    {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUserId().equals(userId))
        {
            throw new IllegalArgumentException("Task does not belong to the user");
        }

        LocalDate today = LocalDate.now();

        // Check if the task is already completed today
        if (today.toString().equals(task.getLastCompletedDate()))
        {
            throw new IllegalArgumentException("Task has already been completed today");
        }

        task.setCompleted(true);
        task.setLastCompletedDate(today.toString()); // Track the completion date
        Task updatedTask = taskRepository.save(task);

        return new TaskResponse(updatedTask.getId(), updatedTask.getTitle(), updatedTask.isCompleted(), updatedTask.getDueDate());
    }

    public void deleteTask(String userId, String taskId)
    {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUserId().equals(userId))
        {
            throw new IllegalArgumentException("Task does not belong to the user");
        }

        taskRepository.delete(task);
    }

}
