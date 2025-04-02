package org.example.backend.controller;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.dto.HabitResponse;
import org.example.backend.entity.Habit;
import org.example.backend.service.HabitService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<HabitResponse>> getHabits(Authentication authentication)
    {
        String userId = authentication.getName();
        List<Habit> habits = habitService.getHabits(userId); // Get Habit entities

        // Convert Habit entities to DTOs
        List<HabitResponse> habitResponses = habits.stream()
                .map(HabitResponse::new) // Convert Habit to HabitResponse
                .toList();

        return ResponseEntity.ok(habitResponses);
    }


    //  @PostMapping
    //  public ResponseEntity<HabitResponse> createHabit(Authentication authentication, @RequestBody HabitCreationRequest request)
    //  {
    //      String userId = authentication.getName();
    //      Habit habit = habitService.createHabit(userId, request); // Get Habit entity
    //      HabitResponse response = new HabitResponse(habit); // Convert entity to DTO
    //      return ResponseEntity.ok(response); // Return DTO
    //  }

    @PutMapping("/{habitId}/complete")
    public ResponseEntity<HabitResponse> completeHabit(Authentication authentication,
                                                       @PathVariable String habitId)
    {
        // Extract the authenticated user ID
        String userId = authentication.getName();

        // Call the service to mark the habit as completed
        Habit completedHabit = habitService.completeHabit(userId, habitId);

        // Convert the updated Habit entity into HabitResponse
        HabitResponse response = new HabitResponse(completedHabit);

        // Return the response
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{habitId}/reset")
    public ResponseEntity<HabitResponse> resetHabit(
            Authentication authentication,
            @PathVariable String habitId
    )
    {
        // Extract the userId from the authentication context
        String userId = authentication.getName();

        // Call the service to reset the habit
        Habit resetHabit = habitService.resetHabit(userId, habitId);

        // Convert and return the reset habit as a DTO
        HabitResponse response = new HabitResponse(resetHabit);
        return ResponseEntity.ok(response);
    }


}
