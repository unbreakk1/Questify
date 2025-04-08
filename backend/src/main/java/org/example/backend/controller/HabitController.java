package org.example.backend.controller;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.dto.HabitResponse;
import org.example.backend.entity.Habit;
import org.example.backend.service.HabitService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController
{

    private final HabitService habitService;

    public HabitController(HabitService habitService)
    {
        this.habitService = habitService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK) // 200 OK, successfully retrieved habits
    public List<HabitResponse> getHabits(Authentication authentication)
    {
        String userId = authentication.getName();
        List<Habit> habits = habitService.getHabits(userId); // Get Habit entities

        // Convert Habit entities to DTOs
        return habits.stream()
                .map(HabitResponse::new) // Convert Habit to HabitResponse
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK) // 200 OK, habit created successfully
    public HabitResponse createHabit(Authentication authentication, @RequestBody HabitCreationRequest request)
    {
        String userId = authentication.getName();
        Habit habit = habitService.createHabit(userId, request);
        return new HabitResponse(habit);
    }

    @PutMapping("/{habitId}/complete")
    @ResponseStatus(HttpStatus.OK) // 200 OK, habit completed successfully
    public HabitResponse completeHabit(Authentication authentication, @PathVariable String habitId)
    {
        String userId = authentication.getName();
        Habit completedHabit = habitService.completeHabit(userId, habitId);
        return new HabitResponse(completedHabit);
    }

    @PutMapping("/{habitId}/reset")
    @ResponseStatus(HttpStatus.OK) // 200 OK, habit reset successfully
    public HabitResponse resetHabit(Authentication authentication, @PathVariable String habitId)
    {
        String userId = authentication.getName();
        Habit resetHabit = habitService.resetHabit(userId, habitId);
        return new HabitResponse(resetHabit);
    }

    @DeleteMapping("/{habitId}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content, habit successfully deleted
    public void deleteHabit(Authentication authentication, @PathVariable String habitId)
    {
        String userId = authentication.getName();
        habitService.deleteHabit(userId, habitId);
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