package org.example.backend.dto;

public class BossResponse
{
    private String id;
    private String name;
    private int maxHealth;
    private int currentHealth;
    private boolean defeated;

    public BossResponse(String id, String name, int maxHealth, int currentHealth, boolean defeated)
    {
        this.id = id;
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
        this.defeated = defeated;
    }

    // Getters
    public String getId()
    {
        return id;
    }

    public String getName()
    {
        return name;
    }

    public int getMaxHealth()
    {
        return maxHealth;
    }

    public int getCurrentHealth()
    {
        return currentHealth;
    }

    public boolean isDefeated()
    {
        return defeated;
    }
}

