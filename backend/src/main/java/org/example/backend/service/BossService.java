package org.example.backend.service;

import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.entity.UserBossProgress;
import org.example.backend.repository.BossRepository;
import org.example.backend.repository.UserBossProgressRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BossService
{
    private final WebSocketService webSocketService;
    private final BossRepository bossRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserBossProgressRepository userBossProgressRepository;

    public BossService(WebSocketService webSocketService, BossRepository bossRepository,
                       UserService userService,
                       UserRepository userRepository,
                       UserBossProgressRepository userBossProgressRepository)
    {
        this.webSocketService = webSocketService;
        this.bossRepository = bossRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.userBossProgressRepository = userBossProgressRepository;
    }


    public BossResponse getActiveBoss(String userId)
    {
        User user = userService.getUserBasicDetails(userId);
        String currentBossId = user.getCurrentBossId();

        if (currentBossId == null)
        {
            throw new IllegalArgumentException("User is not currently fighting any boss.");
        }

        Boss boss = bossRepository.findById(currentBossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss not found"));

        UserBossProgress progress = userBossProgressRepository
                .findByUserIdAndBossId(userId, currentBossId)
                .orElseGet(() -> initializeUserBossProgress(userId, currentBossId, boss.getMaxHealth()));

        return new BossResponse(boss, progress);

    }

    public UserBossProgress initializeUserBossProgress(String userId, String bossId, int maxHealth)
    {
        // Try to find existing progress
        Optional<UserBossProgress> existingProgress = userBossProgressRepository
                .findByUserIdAndBossId(userId, bossId);

        if (existingProgress.isPresent())
        {
            // If progress exists, reset it
            UserBossProgress progress = existingProgress.get();
            progress.setCurrentHealth(maxHealth);
            progress.setDefeated(false);
            progress.setLastUpdated(LocalDateTime.now());
            return userBossProgressRepository.save(progress);
        } else
        {
            // If no progress exists, create new
            UserBossProgress newProgress = new UserBossProgress(userId, bossId, maxHealth);
            return userBossProgressRepository.save(newProgress);
        }
    }


    public BossResponse dealDamage(String userId, int damage)
    {
        User user = userService.getUserBasicDetails(userId);
        String currentBossId = user.getCurrentBossId();

        if (currentBossId == null)
        {
            throw new IllegalArgumentException("User is not currently fighting any boss.");
        }

        Boss boss = bossRepository.findById(currentBossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss not found"));

        UserBossProgress progress = userBossProgressRepository
                .findByUserIdAndBossId(userId, currentBossId)
                .orElseGet(() -> initializeUserBossProgress(userId, currentBossId, boss.getMaxHealth()));

        // Deal damage logic
        int newHealth = progress.getCurrentHealth() - damage;
        if (newHealth <= 0)
        {
            progress.setCurrentHealth(0);
            progress.setDefeated(true);
            userBossProgressRepository.save(progress);
            handleBossDefeat(boss, userId);
        } else
        {
            progress.setCurrentHealth(newHealth);
            userBossProgressRepository.save(progress);
        }

        return new BossResponse(boss, progress);

    }

    public List<Boss> getBossSelection()
    {
        return bossRepository.findRandomBosses(4);
    }

    public boolean initiateBossFight(String bossId)
    {
        return bossRepository.findById(bossId).isPresent();
    }

    private void handleBossDefeat(Boss boss, String userId)
    {
        // Extract rewards from the boss
        int xpReward = boss.getRewards().getXp();
        int goldReward = boss.getRewards().getGold();
        String badgeReward = boss.getRewards().getBadge();

        // Fetch the user
        User user = userService.getUserBasicDetails(userId);
        String username = user.getUsername();

        // Update user XP and level
        User updatedUser = userService.updateUserDetails(username, xpReward, null, null);

        // Update gold
        updatedUser.setGold(updatedUser.getGold() + goldReward);

        // Add badge if not already owned
        if (!updatedUser.hasBadge(badgeReward))
        {
            updatedUser.addBadge(badgeReward);
        }

        // Save final state
        userService.saveUser(updatedUser);

        webSocketService.sendUserStatsUpdate(username, updatedUser.getGold(), updatedUser.getLevel());


        System.out.printf("User %s defeated boss %s and received: %d XP, %d gold, badge: %s%n",
                userId, boss.getName(), xpReward, goldReward, badgeReward);
    }

    public Boss getBossById(String bossId)
    {
        return bossRepository.findById(bossId)
                .orElseThrow(() -> new IllegalArgumentException("Boss not found with ID: " + bossId));
    }
}