package org.example.backend.service;

import org.example.backend.dto.BossResponse;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.entity.UserBossProgress;
import org.example.backend.repository.BossRepository;
import org.example.backend.repository.UserBossProgressRepository;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BossServiceTest
{

    @Mock
    private WebSocketService webSocketService;

    @Mock
    private BossRepository bossRepository;

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserBossProgressRepository userBossProgressRepository;

    @InjectMocks
    private BossService bossService;

    private Boss testBoss;
    private User testUser;
    private UserBossProgress testProgress;

    @BeforeEach
    void setUp()
    {
        // Setup test boss
        testBoss = new Boss();
        testBoss.setId("boss1");
        testBoss.setName("Test Boss");
        testBoss.setMaxHealth(100);

        Boss.Rewards rewards = new Boss.Rewards();
        rewards.setXp(50);
        rewards.setGold(100);
        rewards.setBadge("Boss Slayer");
        testBoss.setRewards(rewards);

        // Setup test user
        testUser = new User();
        testUser.setId("user1");
        testUser.setUsername("testuser");
        testUser.setCurrentBossId("boss1");
        testUser.setLevel(1);
        testUser.setExperience(0);
        testUser.setGold(0);

        // Setup test progress
        testProgress = new UserBossProgress("user1", "boss1", 100);
        testProgress.setId("progress1");
        testProgress.setCurrentHealth(100);
        testProgress.setDefeated(false);
        testProgress.setLastUpdated(LocalDateTime.now());
    }

    @Test
    void getActiveBoss_Success()
    {
        // Arrange
        when(userService.getUserBasicDetails("user1")).thenReturn(testUser);
        when(bossRepository.findById("boss1")).thenReturn(Optional.of(testBoss));
        when(userBossProgressRepository.findByUserIdAndBossId("user1", "boss1"))
                .thenReturn(Optional.of(testProgress));

        // Act
        BossResponse result = bossService.getActiveBoss("user1");

        // Assert
        assertNotNull(result);
        assertEquals(testBoss.getName(), result.getName());
        assertEquals(testProgress.getCurrentHealth(), result.getCurrentHealth());
        assertFalse(result.isDefeated());
    }

    @Test
    void getActiveBoss_NoActiveBoss()
    {
        // Arrange
        testUser.setCurrentBossId(null);
        when(userService.getUserBasicDetails("user1")).thenReturn(testUser);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                bossService.getActiveBoss("user1")
        );
    }

    @Test
    void dealDamage_Success()
    {
        // Arrange
        when(userService.getUserBasicDetails("user1")).thenReturn(testUser);
        when(bossRepository.findById("boss1")).thenReturn(Optional.of(testBoss));
        when(userBossProgressRepository.findByUserIdAndBossId("user1", "boss1"))
                .thenReturn(Optional.of(testProgress));
        when(userBossProgressRepository.save(any(UserBossProgress.class))).thenReturn(testProgress);

        // Act
        BossResponse result = bossService.dealDamage("user1", 30);

        // Assert
        assertNotNull(result);
        assertEquals(70, result.getCurrentHealth()); // 100 - 30
        assertFalse(result.isDefeated());
    }

    @Test
    void dealDamage_BossDefeated()
    {
        // Arrange
        when(userService.getUserBasicDetails("user1")).thenReturn(testUser);
        when(bossRepository.findById("boss1")).thenReturn(Optional.of(testBoss));
        when(userBossProgressRepository.findByUserIdAndBossId("user1", "boss1"))
                .thenReturn(Optional.of(testProgress));
        when(userBossProgressRepository.save(any(UserBossProgress.class))).thenReturn(testProgress);
        when(userService.updateUserDetails(anyString(), anyInt(), any(), any())).thenReturn(testUser);
        when(userService.saveUser(any(User.class))).thenReturn(testUser);

        // Act
        BossResponse result = bossService.dealDamage("user1", 150); // Damage exceeds boss health

        // Assert
        assertTrue(result.isDefeated());
        assertEquals(0, result.getCurrentHealth());
        verify(userService).updateUserDetails(eq(testUser.getUsername()), eq(50), any(), any());
        verify(webSocketService).sendUserStatsUpdate(eq(testUser.getUsername()), anyInt(), anyInt());
    }

    @Test
    void getBossSelection_Success()
    {
        // Arrange
        List<Boss> bossList = Arrays.asList(testBoss);
        when(bossRepository.findRandomBosses(4)).thenReturn(bossList);

        // Act
        List<Boss> result = bossService.getBossSelection();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testBoss.getName(), result.get(0).getName());
    }

    @Test
    void initiateBossFight_Success()
    {
        // Arrange
        when(bossRepository.findById("boss1")).thenReturn(Optional.of(testBoss));

        // Act
        boolean result = bossService.initiateBossFight("boss1");

        // Assert
        assertTrue(result);
    }

    @Test
    void initiateBossFight_BossNotFound()
    {
        // Arrange
        when(bossRepository.findById("nonexistent")).thenReturn(Optional.empty());

        // Act
        boolean result = bossService.initiateBossFight("nonexistent");

        // Assert
        assertFalse(result);
    }

    @Test
    void getBossById_Success()
    {
        // Arrange
        when(bossRepository.findById("boss1")).thenReturn(Optional.of(testBoss));

        // Act
        Boss result = bossService.getBossById("boss1");

        // Assert
        assertNotNull(result);
        assertEquals(testBoss.getName(), result.getName());
    }

    @Test
    void getBossById_NotFound()
    {
        // Arrange
        when(bossRepository.findById("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                bossService.getBossById("nonexistent")
        );
    }
}