package org.example.backend.service;

import org.example.backend.dto.HabitCreationRequest;
import org.example.backend.entity.Habit;
import org.example.backend.repository.HabitRepository;
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
class HabitServiceTest
{

    @Mock
    private HabitRepository habitRepository;

    @InjectMocks
    private HabitService habitService;

    private Habit testHabit;
    private HabitCreationRequest testRequest;
    private String userId = "testUser";

    @BeforeEach
    void setUp()
    {
        testHabit = new Habit();
        testHabit.setId("testHabitId");
        testHabit.setUserId(userId);
        testHabit.setTitle("Test Habit");
        testHabit.setFrequency("DAILY");
        testHabit.setDifficulty("MEDIUM");
        testHabit.setCompleted(false);
        testHabit.setStreak(0);

        testRequest = new HabitCreationRequest("Test Habit", "DAILY", "MEDIUM");
    }

    @Test
    void createHabit_Success()
    {
        when(habitRepository.save(any(Habit.class))).thenReturn(testHabit);

        Habit result = habitService.createHabit(userId, testRequest);

        assertNotNull(result);
        assertEquals(testHabit.getTitle(), result.getTitle());
        assertEquals(testHabit.getFrequency(), result.getFrequency());
        assertEquals(0, result.getStreak());
        verify(habitRepository).save(any(Habit.class));
    }

    @Test
    void getHabits_Success()
    {
        when(habitRepository.findByUserId(userId)).thenReturn(Arrays.asList(testHabit));

        List<Habit> results = habitService.getHabits(userId);

        assertNotNull(results);
        assertEquals(1, results.size());
        verify(habitRepository).findByUserId(userId);
    }

    @Test
    void completeHabit_Success()
    {
        // Arrange
        testHabit.setLastCompletedDate(LocalDate.now().minusDays(1).toString());
        testHabit.setStreak(1);

        Habit updatedHabit = new Habit();
        updatedHabit.setId("testHabitId");
        updatedHabit.setUserId(userId);
        updatedHabit.setTitle("Test Habit");
        updatedHabit.setFrequency("DAILY");
        updatedHabit.setDifficulty("MEDIUM");
        updatedHabit.setCompleted(true);
        updatedHabit.setStreak(2);
        updatedHabit.setLastCompletedDate(LocalDate.now().toString());

        when(habitRepository.findById("testHabitId")).thenReturn(Optional.of(testHabit));
        when(habitRepository.save(any(Habit.class))).thenReturn(updatedHabit);

        // Act
        Habit result = habitService.completeHabit(userId, "testHabitId");

        // Assert
        assertTrue(result.isCompleted());
        assertEquals(2, result.getStreak());
        assertEquals(LocalDate.now().toString(), result.getLastCompletedDate());
        verify(habitRepository).save(any(Habit.class));
    }


    @Test
    void completeHabit_AlreadyCompletedToday()
    {
        testHabit.setCompleted(true);
        testHabit.setLastCompletedDate(LocalDate.now().toString());

        when(habitRepository.findById("testHabitId")).thenReturn(Optional.of(testHabit));

        assertThrows(IllegalArgumentException.class, () ->
                habitService.completeHabit(userId, "testHabitId")
        );
    }

    @Test
    void deleteHabit_Success()
    {
        // Arrange
        when(habitRepository.findById("testHabitId")).thenReturn(Optional.of(testHabit));
        doNothing().when(habitRepository).delete(any(Habit.class));

        // Act
        habitService.deleteHabit(userId, "testHabitId");

        // Assert
        verify(habitRepository).delete(testHabit);
    }

    @Test
    void deleteHabit_NotFound()
    {
        // Arrange
        when(habitRepository.findById("testHabitId")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                habitService.deleteHabit(userId, "testHabitId")
        );
    }

    @Test
    void deleteHabit_WrongUser()
    {
        // Arrange
        when(habitRepository.findById("testHabitId")).thenReturn(Optional.of(testHabit));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                habitService.deleteHabit("wrongUser", "testHabitId")
        );
    }

    @Test
    void resetHabit_Success()
    {
        // Arrange
        testHabit.setCompleted(true);
        testHabit.setLastCompletedDate(LocalDate.now().toString());
        testHabit.setStreak(5);

        Habit resetHabit = new Habit();
        resetHabit.setId("testHabitId");
        resetHabit.setUserId(userId);
        resetHabit.setTitle("Test Habit");
        resetHabit.setCompleted(false);
        resetHabit.setLastCompletedDate(null);
        resetHabit.setStreak(0);

        when(habitRepository.findById("testHabitId")).thenReturn(Optional.of(testHabit));
        when(habitRepository.save(any(Habit.class))).thenReturn(resetHabit);

        // Act
        Habit result = habitService.resetHabit(userId, "testHabitId");

        // Assert
        assertFalse(result.isCompleted());
        assertNull(result.getLastCompletedDate());
        assertEquals(0, result.getStreak());
        verify(habitRepository).save(any(Habit.class));
    }

    @Test
    void getHabits_ResetsDailyHabits()
    {
        // Arrange
        Habit dailyHabit = new Habit();
        dailyHabit.setId("habit1");
        dailyHabit.setUserId(userId);
        dailyHabit.setFrequency("DAILY");
        dailyHabit.setCompleted(true);
        dailyHabit.setLastCompletedDate(LocalDate.now().minusDays(1).toString());

        when(habitRepository.findByUserId(userId)).thenReturn(Arrays.asList(dailyHabit));
        when(habitRepository.save(any(Habit.class))).thenReturn(dailyHabit);

        // Act
        List<Habit> results = habitService.getHabits(userId);

        // Assert
        assertFalse(results.get(0).isCompleted());
        verify(habitRepository).save(any(Habit.class));
    }

    @Test
    void getHabits_ResetsWeeklyHabits()
    {
        // Arrange
        Habit weeklyHabit = new Habit();
        weeklyHabit.setId("habit1");
        weeklyHabit.setUserId(userId);
        weeklyHabit.setFrequency("WEEKLY");
        weeklyHabit.setCompleted(true);
        weeklyHabit.setLastCompletedDate(LocalDate.now().minusWeeks(1).toString());

        when(habitRepository.findByUserId(userId)).thenReturn(Arrays.asList(weeklyHabit));
        when(habitRepository.save(any(Habit.class))).thenReturn(weeklyHabit);

        // Act
        List<Habit> results = habitService.getHabits(userId);

        // Assert
        assertFalse(results.get(0).isCompleted());
        verify(habitRepository).save(any(Habit.class));
    }

    @Test
    void completeHabit_BreaksStreak()
    {
        // Arrange
        testHabit.setLastCompletedDate(LocalDate.now().minusDays(2).toString());
        testHabit.setStreak(5);

        Habit updatedHabit = new Habit();
        updatedHabit.setId("testHabitId");
        updatedHabit.setUserId(userId);
        updatedHabit.setCompleted(true);
        updatedHabit.setLastCompletedDate(LocalDate.now().toString());
        updatedHabit.setStreak(1); // Streak reset to 1

        when(habitRepository.findById("testHabitId")).thenReturn(Optional.of(testHabit));
        when(habitRepository.save(any(Habit.class))).thenReturn(updatedHabit);

        // Act
        Habit result = habitService.completeHabit(userId, "testHabitId");

        // Assert
        assertTrue(result.isCompleted());
        assertEquals(1, result.getStreak()); // Streak should be reset to 1
        assertEquals(LocalDate.now().toString(), result.getLastCompletedDate());
        verify(habitRepository).save(any(Habit.class));
    }

}