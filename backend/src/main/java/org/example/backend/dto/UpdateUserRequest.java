package org.example.backend.dto;

public class UpdateUserRequest
{
    private Integer experience;
    private Integer level;
    private Integer streak;

    // Getters and Setters
    public Integer getExperience()
    {
        return experience;
    }

    public void setExperience(Integer experience)
    {
        this.experience = experience;
    }

    public Integer getLevel()
    {
        return level;
    }

    public void setLevel(Integer level)
    {
        this.level = level;
    }

    public Integer getStreak()
    {
        return streak;
    }

    public void setStreak(Integer streak)
    {
        this.streak = streak;
    }
}