package org.example.backend.dto;

import org.example.backend.entity.Boss;
import org.example.backend.entity.Boss.Rewards;
import org.example.backend.entity.UserBossProgress;

public class BossResponse
{
    private String id;
    private String name;
    private int maxHealth;
    private int currentHealth;
    private boolean defeated;
    private Rewards rewards;
    private boolean rare;
    private int levelRequirement;

    // Constructor with Boss and UserBossProgress
    public BossResponse(Boss boss, UserBossProgress progress) {
        this.id = boss.getId();
        this.name = boss.getName();
        this.maxHealth = boss.getMaxHealth();
        this.rewards = boss.getRewards();
        this.rare = boss.isRare();
        this.levelRequirement = boss.getLevelRequirement();

        // Get values from progress if available, otherwise use defaults
        if (progress != null) {
            this.currentHealth = progress.getCurrentHealth();
            this.defeated = progress.isDefeated();
        } else {
            this.currentHealth = boss.getMaxHealth();
            this.defeated = false;
        }
    }

    // Add all getters (no setters needed for DTO)
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getMaxHealth() {
        return maxHealth;
    }

    public int getCurrentHealth() {
        return currentHealth;
    }

    public boolean isDefeated() {
        return defeated;
    }

    public Rewards getRewards() {
        return rewards;
    }

    public boolean isRare() {
        return rare;
    }

    public int getLevelRequirement() {
        return levelRequirement;
    }
}



