package org.example.backend.service;

import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.repository.BossRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

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
        // Fetch the single active boss
        Boss boss = bossRepository.findByUserIdAndDefeatedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("No active boss found for the user."));

        // Map the boss entity to a response DTO
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
            //  Add logic for rewarding the user here
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

    public BossResponse createBoss(String userId, Boss boss) {
        // Prevent the creation of multiple active bosses
        Optional<Boss> existingBoss = bossRepository.findByUserIdAndDefeatedFalse(userId);

        if (existingBoss.isPresent()) {
            throw new IllegalArgumentException("User already has an active boss.");
        }

        // Set boss details and save
        boss.setUserId(userId);
        boss.setCurrentHealth(boss.getMaxHealth());
        boss.setDefeated(false); // This ensures the new boss is active
        bossRepository.save(boss);

        // Return response
        return new BossResponse(
                boss.getId(),
                boss.getName(),
                boss.getMaxHealth(),
                boss.getCurrentHealth(),
                boss.isDefeated()
        );
    }



    public BossResponse getBossSelection(String userId)
    {
        Boss boss = bossRepository.findFirstByUserIdAndDefeatedFalseOrderByMaxHealthDesc(userId)
                .orElseThrow(() -> new IllegalArgumentException("No active boss found for the user."));

        return new BossResponse(
                boss.getId(),
                boss.getName(),
                boss.getMaxHealth(),
                boss.getCurrentHealth(),
                boss.isDefeated()
        );
    }

    public boolean initiateBossFight(String bossId)
    {
        // Find the specific boss by ID, mark it as "in progress", and start fight
        Optional<Boss> bossOptional = bossRepository.findById(bossId);
        if (bossOptional.isEmpty() || bossOptional.get().isInProgress())
        {
            return false; // No such boss or already in fight
        }
        Boss boss = bossOptional.get();
        boss.setInProgress(true); // Optional: Add `inProgress` field to `Boss` class
        bossRepository.save(boss);
        return true;
    }
}