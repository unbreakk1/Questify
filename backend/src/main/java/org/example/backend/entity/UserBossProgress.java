package org.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("userBossProgress")
public class UserBossProgress
{
    @Id
    private String id;

    private String userId;    // Reference to User document
    private String bossId;    // Reference to Boss document

    private int currentHealth;
    private boolean defeated;
    private LocalDateTime lastUpdated;

    // Default constructor
    public UserBossProgress()
    {
    }

    // Regular constructor
    public UserBossProgress(String userId, String bossId, int maxHealth)
    {
        this.userId = userId;
        this.bossId = bossId;
        this.currentHealth = maxHealth;
        this.defeated = false;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters
    public String getId()
    {
        return id;
    }

    public String getUserId()
    {
        return userId;
    }

    public String getBossId()
    {
        return bossId;
    }

    public int getCurrentHealth()
    {
        return currentHealth;
    }

    public boolean isDefeated()
    {
        return defeated;
    }

    public LocalDateTime getLastUpdated()
    {
        return lastUpdated;
    }

    // Setters
    public void setId(String id)
    {
        this.id = id;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public void setBossId(String bossId)
    {
        this.bossId = bossId;
    }

    public void setCurrentHealth(int currentHealth)
    {
        this.currentHealth = currentHealth;
    }

    public void setDefeated(boolean defeated)
    {
        this.defeated = defeated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated)
    {
        this.lastUpdated = lastUpdated;
    }
}