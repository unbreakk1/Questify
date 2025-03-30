package org.example.backend.dto;

public class TaskResponse
{
    private String id;
    private String title;
    private boolean completed;
    private String dueDate;

    public TaskResponse(String id, String title, boolean completed, String dueDate)
    {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.dueDate = dueDate;
    }

    // Getters
    public String getId()
    {
        return id;
    }

    public String getTitle()
    {
        return title;
    }

    public boolean isCompleted()
    {
        return completed;
    }

    public String getDueDate()
    {
        return dueDate;
    }
}
