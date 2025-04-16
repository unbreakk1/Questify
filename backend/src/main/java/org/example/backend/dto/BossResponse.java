package org.example.backend.dto;

import org.example.backend.entity.Boss.Rewards;

public class BossResponse
{
    private String id;
    private String name;
    private int maxHealth;
    private int currentHealth;
    private boolean defeated;
    private Rewards rewards;
    private boolean rare;

    public BossResponse(String id, String name, int maxHealth, int currentHealth, boolean defeated, Rewards rewards, boolean rare)
    {
        this.id = id;
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
        this.defeated = defeated;
        this.rewards = rewards;
        this.rare = rare;
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

    public Rewards getRewards()
    {
        return rewards;
    }

    public boolean isRare()
    {
        return rare;
    }
}

