package org.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("habits")
public class Habit
{

    @Id
    private String id;
    private String userId;         // Link to the user who owns this habit
    private String title;          // Title of the habit
    private String frequency;      // DAILY, WEEKLY (Dynamic but simple string)
    private String difficulty;     // EASY, MEDIUM, HARD
    private int streak = 0;        // Track streak count
    private boolean completed;     // Whether the habit is completed today
    private String lastCompletedDate; // Date the habit was last completed (ISO format)

    // Getters & Setters
    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getFrequency()
    {
        return frequency;
    }

    public void setFrequency(String frequency)
    {
        this.frequency = frequency;
    }

    public String getDifficulty()
    {
        return difficulty;
    }

    public void setDifficulty(String difficulty)
    {
        this.difficulty = difficulty;
    }

    public int getStreak()
    {
        return streak;
    }

    public void setStreak(int streak)
    {
        this.streak = streak;
    }

    public boolean isCompleted()
    {
        return completed;
    }

    public void setCompleted(boolean completed)
    {
        this.completed = completed;
    }

    public String getLastCompletedDate()
    {
        return lastCompletedDate;
    }

    public void setLastCompletedDate(String lastCompletedDate)
    {
        this.lastCompletedDate = lastCompletedDate;
    }
}