package org.example.backend.service;

import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.repository.BossRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BossService
{

    private final BossRepository bossRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public BossService(BossRepository bossRepository, UserService userService, UserRepository userRepository)
    {
        this.bossRepository = bossRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * Fetches the active boss by its ID and maps it to a DTO.
     */
    public BossResponse getActiveBoss(String identifier)
    {
        User user = userService.getUserBasicDetails(identifier); // Resolve user
        String currentBossId = user.getCurrentBossId();
        if (currentBossId == null)
        {
            throw new IllegalArgumentException("User is not currently fighting any boss.");
        }

        Boss boss = bossRepository.findById(currentBossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss with ID '" + currentBossId + "' not found."));

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
    public BossResponse dealDamage(String identifier, int damage)
    {
        User user = userService.getUserBasicDetails(identifier); // Resolve user
        String currentBossId = user.getCurrentBossId();
        if (currentBossId == null)
        {
            throw new IllegalArgumentException("User is not currently fighting any boss.");
        }

        Boss boss = bossRepository.findById(currentBossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss with ID '" + currentBossId + "' not found."));

        // Deal damage logic
        int newHealth = boss.getCurrentHealth() - damage;
        if (newHealth <= 0)
        {
            boss.setDefeated(true);
            boss.setCurrentHealth(0); // Mark boss as defeated
            bossRepository.save(boss);
            handleBossDefeat(boss, user.getId()); // Logic for handling boss defeat
        } else
        {
            boss.setCurrentHealth(newHealth);
            bossRepository.save(boss);
        }

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
            Boss bossToRevive = defeatedBosses.removeFirst();
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
        return !boss.isDefeated(); // Cannot initiate a fight with a defeated boss
    }

    private void handleBossDefeat(Boss boss, String identifier) {
        User user = userService.getUserBasicDetails(identifier); // Resolve user

        int goldReward = calculateGoldRewardForBoss(boss); // Calculate reward
        user.setGold(user.getGold() + goldReward); // Update user gold
        user.setCurrentBossId(null); // Clear current boss
        user.addBadge(boss.getRewards().getBadge()); // Grant reward badge
        userRepository.save(user); // Save updated user

        triggerDefeatEvents(user.getId(), boss, goldReward); // Additional events
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