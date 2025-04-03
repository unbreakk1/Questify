package org.example.backend.dto;

import org.example.backend.entity.Habit;

public class HabitResponse
{
    private String id;
    private String title;
    private String frequency;
    private String difficulty;
    private int streak;
    private boolean completed;
    private String lastCompletedDate; // ADD THIS


    // Constructors and Getters
    public HabitResponse(String id, String title, String frequency, String difficulty, int streak)
    {

        this.id = id;
        this.title = title;
        this.frequency = frequency;
        this.difficulty = difficulty;
        this.streak = streak;
    }

    public HabitResponse(Habit habit) {
        this.id = habit.getId();
        this.title = habit.getTitle();
        this.frequency = habit.getFrequency();
        this.difficulty = habit.getDifficulty();
        this.streak = habit.getStreak();
        this.completed = habit.isCompleted();
        this.lastCompletedDate = habit.getLastCompletedDate(); // MAKE SURE THIS IS MAPPED
    }



    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
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

    public boolean getCompleted()
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