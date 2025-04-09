package org.example.backend.service;

import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.repository.BossRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BossService
{

    private final BossRepository bossRepository;
    private final UserService userService;

    public BossService(BossRepository bossRepository, UserService userService)
    {
        this.bossRepository = bossRepository;
        this.userService = userService;
    }

    /**
     * Fetches the active boss by its ID and maps it to a DTO.
     */
    public BossResponse getActiveBoss(String bossId)
    {
        Boss boss = bossRepository.findById(bossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss with the given ID not found."));

        return new BossResponse(
                boss.getId(),
                boss.getName(),
                boss.getMaxHealth(),
                boss.getCurrentHealth(),
                boss.isDefeated()
        );
    }

    /**
     * Simulates dealing damage to a boss.
     * This method reduces the boss's health, and if its health drops to 0, marks it as defeated.
     */
    public BossResponse dealDamage(String bossId, int damage)
    {
        Boss boss = bossRepository.findById(bossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss with the given ID not found."));

        // Apply damage
        int updatedHealth = boss.getCurrentHealth() - damage;
        boss.setCurrentHealth(Math.max(0, updatedHealth)); // Ensure health doesn't drop below 0

        // Check if the boss is now defeated
        if (boss.getCurrentHealth() <= 0)
        {
            boss.setDefeated(true);

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

    /**
     * Fetch a selection of bosses eligible for the user based on their level.
     * Revives defeated bosses if necessary to ensure there are always 3-4 options.
     */
    public List<Boss> getBossSelection(int userLevel)
    {
        // Fetch all bosses suitable for the user's level
        List<Boss> suitableBosses = bossRepository.findByLevelRequirementLessThanEqual(userLevel);

        // Separate available and defeated bosses
        List<Boss> availableBosses = new ArrayList<>();
        List<Boss> defeatedBosses = new ArrayList<>();
        for (Boss boss : suitableBosses)
        {
            if (!boss.isDefeated())
            {
                availableBosses.add(boss);
            } else
            {
                defeatedBosses.add(boss);
            }
        }

        // Revive defeated bosses when fewer than 3-4 bosses are available
        while (availableBosses.size() < 4 && !defeatedBosses.isEmpty())
        {
            Boss bossToRevive = defeatedBosses.remove(0);
            reviveBoss(bossToRevive);
            availableBosses.add(bossToRevive);
        }

        // Return only 3-4 bosses as a selection
        return availableBosses.subList(0, Math.min(availableBosses.size(), 4));
    }

    /**
     * Revives a defeated boss by resetting its health and state.
     */
    private void reviveBoss(Boss boss)
    {
        boss.setDefeated(false);
        boss.setCurrentHealth(boss.getMaxHealth());
        bossRepository.save(boss); // Persist changes
    }

    /**
     * Helper method to revive all defeated bosses (if needed for special cases).
     * This may not be called directly but could be useful for utilities or debugging.
     */
    public void reviveAllBosses()
    {
        List<Boss> defeatedBosses = bossRepository.findByDefeatedTrue();
        for (Boss boss : defeatedBosses)
        {
            reviveBoss(boss);
        }
    }

    /**
     * Initiates a boss fight by validating the state of a boss.
     * Ensures the boss is not already defeated and is ready for battle.
     *
     * @param bossId The ID of the boss to initiate the fight.
     * @return True if the fight can be started, otherwise false.
     */
    public boolean initiateBossFight(String bossId)
    {
        // Find the boss by ID
        Boss boss = bossRepository.findById(bossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss with the given ID not found."));

        // Check if the boss is already defeated
        if (boss.isDefeated())
        {
            return false; // Cannot initiate a fight with a defeated boss
        }
        return true;
    }

    private void handleBossDefeat(Boss boss, String userId) {
        // Mark the boss as defeated
        boss.setDefeated(true);
        bossRepository.save(boss); // Save the updated boss

        // Fetch the user
        User user = userService.getUserBasicDetails(userId);

        // Extract rewards from the boss
        Boss.Rewards rewards = boss.getRewards();

        // Update XP and level
        int updatedXp = user.getExperience();
        int updatedLevel = user.getLevel();
        if (rewards != null) {
            updatedXp += rewards.getXp();

            // Level-up logic
            while (updatedXp >= calculateXpThresholdForLevel(updatedLevel)) {
                updatedXp -= calculateXpThresholdForLevel(updatedLevel);
                updatedLevel++;
            }

            // Call `updateUserDetails` for XP and level updates
            userService.updateUserDetails(userId, updatedXp, updatedLevel, null);
        }

        // Update Gold (Virtual Currency)
        int goldReward = calculateGoldRewardForBoss(boss);
        user.setGold(user.getGold() + goldReward); // Update user instance with new Gold

        // Award Badge for First Time Completion
        if (rewards != null && rewards.getBadge() != null) {
            String badge = rewards.getBadge();
            if (!user.hasBadge(badge)) { // Award badge only if the user doesn't already have it
                user.addBadge(badge);
            }
        }

        // Trigger additional events (notifications, etc.)
        triggerDefeatEvents(userId, boss, goldReward);
    }


    /**
     * Calculates the XP threshold for leveling up.
     * Here we use a simple placeholder example, but you can replace this logic with more advanced mechanics.
     */
    private int calculateXpThresholdForLevel(int level)
    {
        return 100 + (level * 50); // Example: 100 base + 50 XP per level
    }

    /**
     * Calculates the gold reward for defeating a boss.
     * You can fine-tune this based on the boss's level, difficulty, etc.
     */
    private int calculateGoldRewardForBoss(Boss boss)
    {
        return boss.getLevelRequirement() * 10; // Example: 10 Gold per level requirement of the defeated boss
    }

    /**
     * Trigger any additional events upon boss defeat — such as notifications, messages, or observer updates.
     */
    private void triggerDefeatEvents(String userId, Boss boss, int goldReward)
    {
        // Example: Send a notification to the user
        String message = "Congratulations! " + userId + " You've defeated " + boss.getName() +
                ", earned " + boss.getRewards().getXp() + " XP and " +
                goldReward + " Gold!";
        System.out.println(message); // Replace with an actual notification mechanism (e.g., in-app or email)
    }
}