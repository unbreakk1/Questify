package org.example.backend.service;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.dto.HabitResponse;
import org.example.backend.entity.Habit;
import org.example.backend.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HabitService
{

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository)
    {
        this.habitRepository = habitRepository;
    }

    public HabitResponse createHabit(String userId, HabitCreationRequest request)
    {
        Habit habit = new Habit();
        habit.setUserId(userId);
        habit.setTitle(request.getTitle());
        habit.setFrequency(request.getFrequency());
        habit.setDifficulty(request.getDifficulty());
        habit.setStreak(0); // Initialize streak
        habit.setProgress(List.of()); // Empty progress initially

        Habit savedHabit = habitRepository.save(habit);
        return new HabitResponse(savedHabit.getId(), habit.getTitle(), habit.getFrequency(), habit.getDifficulty(), 0);
    }

    public List<HabitResponse> getHabits(String userId)
    {
        return habitRepository.findByUserId(userId)
                .stream()
                .map(habit -> new HabitResponse(
                        habit.getId(), habit.getTitle(), habit.getFrequency(), habit.getDifficulty(), habit.getStreak()))
                .collect(Collectors.toList());
    }
}