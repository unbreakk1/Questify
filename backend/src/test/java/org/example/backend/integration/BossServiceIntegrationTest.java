package org.example.backend.integration;


import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.entity.UserBossProgress;
import org.example.backend.repository.BossRepository;
import org.example.backend.repository.UserBossProgressRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.BossService;
import org.example.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BossServiceIntegrationTest
{

    @Autowired
    private BossService bossService;

    @Autowired
    private UserService userService;

    @Autowired
    private BossRepository bossRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBossProgressRepository userBossProgressRepository;

    private Boss testBoss;
    private User testUser;

    @BeforeEach
    void setUp()
    {
        bossRepository.deleteAll();
        userRepository.deleteAll();
        userBossProgressRepository.deleteAll();

        // Create and save test boss
        testBoss = new Boss();
        testBoss.setName("Integration Test Boss");
        testBoss.setMaxHealth(100);
        Boss.Rewards rewards = new Boss.Rewards();
        rewards.setXp(50);
        rewards.setGold(100);
        rewards.setBadge("Test Badge");
        testBoss.setRewards(rewards);
        testBoss = bossRepository.save(testBoss);

        // Create and save test user
        testUser = userService.registerUser(
                "integrationTestUser",
                "test@integration.com",
                "password123"
        );
        testUser.setCurrentBossId(testBoss.getId());
        testUser = userRepository.save(testUser);

        // Create boss progress
        UserBossProgress progress = new UserBossProgress(
                testUser.getId(),
                testBoss.getId(),
                testBoss.getMaxHealth()
        );
        userBossProgressRepository.save(progress);
    }

    @Test
    void getActiveBoss_Success()
    {
        // Act
        BossResponse result = bossService.getActiveBoss(testUser.getId());

        // Assert
        assertNotNull(result);
        assertEquals(testBoss.getName(), result.getName());
        assertEquals(testBoss.getMaxHealth(), result.getCurrentHealth());
        assertFalse(result.isDefeated());
    }

    @Test
    void dealDamage_Success()
    {
        // Act
        BossResponse result = bossService.dealDamage(testUser.getId(), 30);

        // Assert
        assertNotNull(result);
        assertEquals(70, result.getCurrentHealth());
        assertFalse(result.isDefeated());

        // Verify database state
        UserBossProgress progress = userBossProgressRepository
                .findByUserIdAndBossId(testUser.getId(), testBoss.getId())
                .orElseThrow();
        assertEquals(70, progress.getCurrentHealth());
    }

    @Test
    void dealDamage_DefeatBoss()
    {
        // Act
        BossResponse result = bossService.dealDamage(testUser.getId(), 150);

        // Assert
        assertTrue(result.isDefeated());
        assertEquals(0, result.getCurrentHealth());

        // Verify user received rewards
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertEquals(testBoss.getRewards().getGold(), updatedUser.getGold());
        assertTrue(updatedUser.getBadges().contains(testBoss.getRewards().getBadge()));
    }

    @Test
    void getBossSelection_Success()
    {
        // Act
        List<Boss> result = bossService.getBossSelection();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void initiateBossFight_Success()
    {
        // Act
        boolean result = bossService.initiateBossFight(testBoss.getId());

        // Assert
        assertTrue(result);

        // Verify progress was created
        UserBossProgress progress = userBossProgressRepository
                .findByUserIdAndBossId(testUser.getId(), testBoss.getId())
                .orElseThrow();
        assertEquals(testBoss.getMaxHealth(), progress.getCurrentHealth());
    }

    @Test
    void dealDamage_ConcurrentDamage() throws InterruptedException
    {
        final int numberOfThreads = 5;
        final int damagePerThread = 25; // Total damage: 5 * 25 = 125, more than boss health (100)
        final CountDownLatch latch = new CountDownLatch(numberOfThreads);
        final AtomicBoolean bossDefeatedOnce = new AtomicBoolean(false);
        final AtomicInteger rewardCount = new AtomicInteger(0);

        // Create and start threads
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++)
        {
            Thread t = new Thread(() ->
            {
                try
                {
                    latch.countDown();
                    latch.await(); // Wait for all threads to be ready
                    BossResponse response = bossService.dealDamage(testUser.getId(), damagePerThread);

                    if (response.isDefeated())
                    {
                        if (!bossDefeatedOnce.compareAndSet(false, true))
                        {
                            fail("Boss was defeated more than once!");
                        }
                        rewardCount.incrementAndGet();
                    }
                }
                catch (InterruptedException e)
                {
                    Thread.currentThread().interrupt();
                    fail("Thread interrupted");
                }
            });
            threads.add(t);
            t.start();
        }

        // Wait for all threads to complete
        for (Thread t : threads)
        {
            t.join();
        }

        // Verify final state
        UserBossProgress finalProgress = userBossProgressRepository
                .findByUserIdAndBossId(testUser.getId(), testBoss.getId())
                .orElseThrow();

        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();

        // Assert
        assertEquals(0, finalProgress.getCurrentHealth());
        assertTrue(finalProgress.isDefeated());
        assertEquals(1, rewardCount.get()); // Rewards should be given exactly once
        assertEquals(testBoss.getRewards().getGold(), updatedUser.getGold()); // Rewards should be given exactly once
        assertTrue(updatedUser.getBadges().contains(testBoss.getRewards().getBadge()));
    }

}