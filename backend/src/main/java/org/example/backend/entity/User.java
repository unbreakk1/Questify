package org.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("users") // MongoDB collection: `users`
public class User
{

    @Id
    private String id;            // Unique ID for the user
    private String username;      // Display name for the user
    private String email;         // Email for authentication
    private String password;      // Hashed password
    private int level;            // Current level of the user
    private int experience;       // Total XP earned
    private int streak;           // Current streak (e.g., consecutive days completing habits)
    private String currentBossId; // Reference to the boss the user is currently fighting
    private LocalDateTime createdAt; // Account creation timestamp
    private LocalDateTime updatedAt; // Last activity timestamp

    // Default constructor
    public User()
    {
    }

    // Full constructor
    public User(String username, String email, String password, int level, int experience, int streak, String currentBossId)
    {
        this.username = username;
        this.email = email;
        this.password = password;
        this.level = level;
        this.experience = experience;
        this.streak = streak;
        this.currentBossId = currentBossId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public int getLevel()
    {
        return level;
    }

    public void setLevel(int level)
    {
        this.level = level;
    }

    public int getExperience()
    {
        return experience;
    }

    public void setExperience(int experience)
    {
        this.experience = experience;
    }

    public int getStreak()
    {
        return streak;
    }

    public void setStreak(int streak)
    {
        this.streak = streak;
    }

    public String getCurrentBossId()
    {
        return currentBossId;
    }

    public void setCurrentBossId(String currentBossId)
    {
        this.currentBossId = currentBossId;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt()
    {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt)
    {
        this.updatedAt = updatedAt;
    }
}