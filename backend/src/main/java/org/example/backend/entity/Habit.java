package org.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("habits")
public class Habit
{

    @Id
    private String id;
    private String userId; // Link to the user
    private String title;
    private String frequency; // DAILY, WEEKLY, etc.
    private String difficulty; // EASY, MEDIUM, HARD
    private int streak; // Current streak
    private List<Progress> progress; // Track progress over time

    // Inner Progress Class
    public static class Progress
    {
        private String date;
        private boolean completed;

        // Getters and Setters
        public String getDate()
        {
            return date;
        }

        public void setDate(String date)
        {
            this.date = date;
        }

        public boolean isCompleted()
        {
            return completed;
        }

        public void setCompleted(boolean completed)
        {
            this.completed = completed;
        }
    }

    // Getters and Setters for main fields
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

    public List<Progress> getProgress()
    {
        return progress;
    }

    public void setProgress(List<Progress> progress)
    {
        this.progress = progress;
    }
}

