// HabitCreationRequest.java
package org.example.backend.dto;

public class HabitCreationRequest
{
    private String title;
    private String frequency;
    private String difficulty;

    public HabitCreationRequest(String title, String frequency, String difficulty)
    {
        this.title = title;
        this.frequency = frequency;
        this.difficulty = difficulty;
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
}
