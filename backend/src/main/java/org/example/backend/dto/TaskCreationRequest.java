// TaskCreationRequest.java
package org.example.backend.dto;

public class TaskCreationRequest
{
    private String title; // Task title
    private String dueDate; // Task due date (YYYY-MM-DD)

    // Getters and Setters
    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getDueDate()
    {
        return dueDate;
    }

    public void setDueDate(String dueDate)
    {
        this.dueDate = dueDate;
    }
}
