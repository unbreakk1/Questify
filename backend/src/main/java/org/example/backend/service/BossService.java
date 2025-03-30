package org.example.backend.service;

import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.repository.BossRepository;
import org.springframework.stereotype.Service;

@Service
public class BossService
{

    private final BossRepository bossRepository;

    public BossService(BossRepository bossRepository)
    {
        this.bossRepository = bossRepository;
    }

    // Get the active boss for the user
    public BossResponse getActiveBoss(String userId)
    {
        Boss boss = bossRepository.findByUserIdAndDefeatedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("No active boss found for the user."));

        return new BossResponse(
                boss.getId(),
                boss.getName(),
                boss.getMaxHealth(),
                boss.getCurrentHealth(),
                boss.isDefeated()
        );
    }

    // Deal damage to the boss
    public BossResponse dealDamage(String userId, int damage)
    {
        Boss boss = bossRepository.findByUserIdAndDefeatedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("No active boss found for the user."));

        // Apply damage
        int updatedHealth = boss.getCurrentHealth() - damage;
        boss.setCurrentHealth(Math.max(0, updatedHealth)); // Ensure health doesn't drop below 0

        // Check if the boss is defeated
        if (updatedHealth <= 0)
        {
            boss.setDefeated(true);
            // You might want to add logic for rewarding the user here
        }

        bossRepository.save(boss);

        return new BossResponse(
                boss.getId(),
                boss.getName(),
                boss.getMaxHealth(),
                boss.getCurrentHealth(),
                boss.isDefeated()
        );
    }

    public BossResponse createBoss(String userId, Boss boss)
    {
        boss.setUserId(userId);           // Link the boss to the authenticated user
        boss.setCurrentHealth(boss.getMaxHealth());  // Initialize current health to max health
        boss.setDefeated(false);          // Initialize as not defeated
        bossRepository.save(boss);       // Save the boss to the database

        // Return a BossResponse (DTO) for the frontend
        return new BossResponse(
                boss.getId(),
                boss.getName(),
                boss.getMaxHealth(),
                boss.getCurrentHealth(),
                boss.isDefeated()
        );
    }

}