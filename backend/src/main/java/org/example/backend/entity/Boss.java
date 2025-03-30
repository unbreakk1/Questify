package org.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("bosses")
public class Boss
{
    @Id
    private String id;
    private String userId; // Link boss to a user
    private String name; // Boss name
    private int maxHealth; // Total health of the boss
    private int currentHealth; // Current remaining health
    private int levelRequirement; // Minimum level to fight this boss
    private boolean defeated; // If the boss has been defeated
    private Rewards rewards;// XP and in-game items received upon defeat
    private boolean inProgress;
    private boolean rare;


    // Embedded Rewards class
    public static class Rewards
    {

        private int xp; // Experience points
        private String badge; // Badge or reward name
        // Getters and Setters

        public int getXp()
        {
            return xp;
        }
        public void setXp(int xp)
        {
            this.xp = xp;
        }

        public String getBadge()
        {
            return badge;
        }

        public void setBadge(String badge)
        {
            this.badge = badge;
        }

    }
    // Getters and Setters for main Boss fields
    public boolean isRare()
    {
        return rare;
    }

    public void setRare(boolean rare)
    {
        this.rare = rare;
    }


    public boolean isInProgress()
    {
        return inProgress;
    }

    public void setInProgress(boolean inProgress)
    {
        this.inProgress = inProgress;
    }

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

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public int getMaxHealth()
    {
        return maxHealth;
    }

    public void setMaxHealth(int maxHealth)
    {
        this.maxHealth = maxHealth;
    }

    public int getCurrentHealth()
    {
        return currentHealth;
    }

    public void setCurrentHealth(int currentHealth)
    {
        this.currentHealth = currentHealth;
    }

    public int getLevelRequirement()
    {
        return levelRequirement;
    }

    public void setLevelRequirement(int levelRequirement)
    {
        this.levelRequirement = levelRequirement;
    }

    public boolean isDefeated()
    {
        return defeated;
    }

    public void setDefeated(boolean defeated)
    {
        this.defeated = defeated;
    }

    public Rewards getRewards()
    {
        return rewards;
    }

    public void setRewards(Rewards rewards)
    {
        this.rewards = rewards;
    }
}