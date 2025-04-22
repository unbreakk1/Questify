package org.example.backend.service;

import org.example.backend.dto.UserStatsUpdate;
import org.example.backend.entity.User;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest
{

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp()
    {
        testUser = new User();
        testUser.setId("testId");
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setLevel(1);
        testUser.setExperience(0);
        testUser.setStreak(0);
        testUser.setGold(0);
    }

    @Test
    void registerUser_Success()
    {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.registerUser("testuser", "test@example.com", "password");

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("hashedPassword", result.getPassword());
        verify(userRepository).save(any(User.class));
        verify(messagingTemplate).convertAndSend(
                eq("/topic/user-stats/testuser"),
                any(UserStatsUpdate.class)
        );
    }

    @Test
    void registerUser_UsernameExists_ThrowsException()
    {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
                userService.registerUser("testuser", "test@example.com", "password")
        );
    }

    @Test
    void registerUser_EmailExists_ThrowsException()
    {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
                userService.registerUser("testuser", "test@example.com", "password")
        );
    }

    @Test
    void loadUserByUsername_Success()
    {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        UserDetails result = userService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("hashedPassword", result.getPassword());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_UserNotFound()
    {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () ->
                userService.loadUserByUsername("nonexistent")
        );
    }

    @Test
    void getUserBasicDetails_ByUsername_Success()
    {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserBasicDetails("testuser");

        // Assert
        assertNotNull(result);
        assertEquals("testId", result.getId());
    }

    @Test
    void updateUserDetails_LevelUp()
    {
        // Arrange
        testUser.setExperience(50);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        User result = userService.updateUserDetails("testuser", 100, null, null);

        // Assert
        assertEquals(2, result.getLevel());
        assertEquals(50, result.getExperience()); // (50 + 100) - 100 = 50 after level up
        verify(messagingTemplate).convertAndSend(
                eq("/topic/user-stats/testuser"),
                any(UserStatsUpdate.class)
        );
    }

    @Test
    void updateUserDetails_MultiLevelUp()
    {
        // Arrange
        testUser.setExperience(90);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        User result = userService.updateUserDetails("testuser", 210, null, null);

        // Assert
        assertEquals(3, result.getLevel()); // Should level up twice
        assertEquals(0, result.getExperience()); // (90 + 210) - 100 - 200 = 0
    }

    @Test
    void getUserCurrentBossId_Success()
    {
        // Arrange
        testUser.setCurrentBossId("boss1");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        String result = userService.getUserCurrentBossId("testuser");

        // Assert
        assertEquals("boss1", result);
    }

    @Test
    void getUserCurrentBossId_NoBoss()
    {
        // Arrange
        testUser.setCurrentBossId(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                userService.getUserCurrentBossId("testuser")
        );
    }

    @Test
    void saveUser_Success()
    {
        // Arrange
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.saveUser(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).save(testUser);
    }
}