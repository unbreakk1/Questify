package org.example.backend.controller;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.dto.HabitResponse;
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

    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(Authentication authentication,
                                                     @RequestBody HabitCreationRequest request)
    {
        String userId = authentication.getName();
        HabitResponse response = habitService.createHabit(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getHabits(Authentication authentication)
    {
        String userId = authentication.getName();
        List<HabitResponse> habits = habitService.getHabits(userId);
        return ResponseEntity.ok(habits);
    }
}