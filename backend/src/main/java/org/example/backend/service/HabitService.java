package org.example.backend.service;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.entity.Habit;
import org.example.backend.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

@Service
public class HabitService
{

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository)
    {
        this.habitRepository = habitRepository;
    }

    public Habit createHabit(String userId, HabitCreationRequest request) {
        Habit habit = new Habit();
        habit.setUserId(userId);
        habit.setTitle(request.getTitle());
        habit.setFrequency(request.getFrequency() != null ? request.getFrequency() : "DAILY"); // Default to DAILY
        habit.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : "EASY"); // Default to EASY
        habit.setStreak(0);
        habit.setProgress(new ArrayList<>()); // Ensure progress is initialized

        return habitRepository.save(habit); // Save habit
    }


    public List<Habit> getHabits(String userId) {
        // Logic to fetch Habit entities from the repository
        List<Habit> habits = habitRepository.findByUserId(userId);
        return habits;
    }

    public Habit completeHabit(String userId, String habitId) {
        // Retrieve the Habit entity by its ID
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        // Ensure the habit belongs to the authenticated user
        if (!habit.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Habit does not belong to the user");
        }

        // Update habit progress with today's completion
        String today = LocalDate.now().toString();
        boolean alreadyCompleted = habit.getProgress().stream()
                .anyMatch(progress -> progress.getDate().equals(today) && progress.isCompleted());

        if (alreadyCompleted) {
            throw new IllegalArgumentException("Habit is already completed for today");
        }

        Habit.Progress progress = new Habit.Progress();
        progress.setDate(today);
        progress.setCompleted(true);
        habit.getProgress().add(progress);

        // Increment the streak count
        habit.setStreak(habit.getStreak() + 1);

        // Save the updated Habit entity and return it
        return habitRepository.save(habit);
    }
}
