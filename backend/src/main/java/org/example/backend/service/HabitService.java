package org.example.backend.service;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.entity.Habit;
import org.example.backend.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.IsoFields;
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

    public List<Habit> getHabits(String userId)
    {
        List<Habit> habits = habitRepository.findByUserId(userId);

        LocalDate today = LocalDate.now();

        // Reset incomplete habits based on their frequency
        habits.forEach(habit ->
        {
            if (habit.getLastCompletedDate() != null)
            {
                LocalDate lastCompletedDate = LocalDate.parse(habit.getLastCompletedDate());
                boolean needReset = false;

                if (habit.getFrequency().equalsIgnoreCase("DAILY"))
                {
                    needReset = !lastCompletedDate.equals(today); // Reset if not completed today
                } else if (habit.getFrequency().equalsIgnoreCase("WEEKLY"))
                {
                    needReset = today.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) !=
                            lastCompletedDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
                }

                if (needReset)
                {
                    habit.setCompleted(false); // Reset completion status
                    habitRepository.save(habit); // Save the reset habit
                }
            }
        });

        return habits;
    }

    public Habit completeHabit(String userId, String habitId)
    {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (!habit.getUserId().equals(userId))
        {
            throw new IllegalArgumentException("Habit does not belong to the user");
        }

        String today = LocalDate.now().toString();
        if (today.equals(habit.getLastCompletedDate()))
        {
            throw new IllegalArgumentException("Habit has already been completed today");
        }

        habit.setCompleted(true);
        habit.setLastCompletedDate(today);

        // Update streak logic
        LocalDate lastCompletedDate = habit.getLastCompletedDate() == null
                ? null : LocalDate.parse(habit.getLastCompletedDate());

        if (lastCompletedDate != null && lastCompletedDate.plusDays(1).toString().equals(today))
        {
            habit.setStreak(habit.getStreak() + 1);
        } else
        {
            habit.setStreak(1);
        }

        return habitRepository.save(habit);
    }

    public Habit resetHabit(String userId, String habitId)
    {
        // Retrieve the habit by its ID
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        // Ensure the habit belongs to the authenticated user
        if (!habit.getUserId().equals(userId))
        {
            throw new IllegalArgumentException("Habit does not belong to the user");
        }

        // Reset the completion state
        habit.setCompleted(false);
        habit.setLastCompletedDate(null);

        // Optionally reset the streak if needed (comment out if you want to preserve it)
        habit.setStreak(0);

        // Save and return the updated habit
        return habitRepository.save(habit);
    }

    public Habit createHabit(String userId, HabitCreationRequest request)
    {
        Habit habit = new Habit();
        habit.setUserId(userId);
        habit.setTitle(request.getTitle());
        habit.setFrequency(request.getFrequency());
        habit.setDifficulty(request.getDifficulty());
        habit.setStreak(0);
        habit.setCompleted(false);

        return habitRepository.save(habit);
    }

    public void deleteHabit(String userId, String habitId)
    {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (!habit.getUserId().equals(userId))
        {
            throw new IllegalArgumentException("Habit does not belong to the user");
        }

        habitRepository.delete(habit);
    }

}


