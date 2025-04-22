package org.example.backend.integration;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.entity.Habit;
import org.example.backend.repository.HabitRepository;
import org.example.backend.service.HabitService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class HabitServiceIntegrationTest
{

    @Autowired
    private HabitService habitService;

    @Autowired
    private HabitRepository habitRepository;

    @Test
    void createHabit_Success()
    {
        // Arrange
        String userId = "testUser";
        HabitCreationRequest request = new HabitCreationRequest("Test Habit", "DAILY", "MEDIUM");

        // Act
        Habit result = habitService.createHabit(userId, request);

        // Assert
        assertNotNull(result);
        assertEquals("Test Habit", result.getTitle());
        assertEquals("DAILY", result.getFrequency());
        assertEquals("MEDIUM", result.getDifficulty());

        // Verify in database
        Habit savedHabit = habitRepository.findById(result.getId()).orElseThrow();
        assertEquals(request.getTitle(), savedHabit.getTitle());
    }

    @Test
    void getHabits_Success()
    {
        // Arrange
        String userId = "testUser";
        createTestHabit(userId, "DAILY");

        // Act
        List<Habit> results = habitService.getHabits(userId);

        // Assert
        assertFalse(results.isEmpty());
        assertEquals(userId, results.get(0).getUserId());
    }

    @Test
    void completeHabit_Success()
    {
        // Arrange
        String userId = "testUser";
        Habit habit = createTestHabit(userId, "DAILY");

        // Act
        Habit result = habitService.completeHabit(userId, habit.getId());

        // Assert
        assertTrue(result.isCompleted());
        assertEquals(LocalDate.now().toString(), result.getLastCompletedDate());
        assertEquals(1, result.getStreak());

        // Verify in database
        Habit savedHabit = habitRepository.findById(habit.getId()).orElseThrow();
        assertTrue(savedHabit.isCompleted());
    }

    @Test
    void completeHabit_MaintainStreak()
    {
        // Arrange
        String userId = "testUser";
        Habit habit = createTestHabit(userId, "DAILY");
        habit.setStreak(5);
        habit.setLastCompletedDate(LocalDate.now().minusDays(1).toString());
        habit = habitRepository.save(habit);

        // Act
        Habit result = habitService.completeHabit(userId, habit.getId());

        // Assert
        assertTrue(result.isCompleted());
        assertEquals(6, result.getStreak());
    }

    @Test
    void resetHabit_Success()
    {
        // Arrange
        String userId = "testUser";
        Habit habit = createTestHabit(userId, "DAILY");
        habit.setCompleted(true);
        habit.setStreak(5);
        habit = habitRepository.save(habit);

        // Act
        Habit result = habitService.resetHabit(userId, habit.getId());

        // Assert
        assertFalse(result.isCompleted());
        assertEquals(0, result.getStreak());
        assertNull(result.getLastCompletedDate());
    }

    private Habit createTestHabit(String userId, String frequency)
    {
        Habit habit = new Habit();
        habit.setUserId(userId);
        habit.setTitle("Test Habit");
        habit.setFrequency(frequency);
        habit.setDifficulty("MEDIUM");
        return habitRepository.save(habit);
    }
}