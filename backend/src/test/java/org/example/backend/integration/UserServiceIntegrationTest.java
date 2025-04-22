package org.example.backend.integration;

import org.example.backend.entity.User;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")

class UserServiceIntegrationTest
{

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    @BeforeEach
    void setUp()
    {
        userRepository.deleteAll();
    }

    @Test
    void registerUser_Success()
    {
        // Act
        User result = userService.registerUser(
                "testuser",
                "test@example.com",
                "password123"
        );

        // Assert
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals(1, result.getLevel());
        assertEquals(0, result.getExperience());
        assertTrue(result.getBadges().contains("Newbie"));

        // Verify in database
        User savedUser = userRepository.findById(result.getId()).orElseThrow();
        assertEquals(result.getUsername(), savedUser.getUsername());
    }

    @Test
    void registerUser_DuplicateUsername()
    {
        // Arrange
        userService.registerUser("testuser", "test@example.com", "password123");

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
                userService.registerUser("testuser", "other@example.com", "password123")
        );
    }

    @Test
    void loadUserByUsername_Success()
    {
        // Arrange
        User user = userService.registerUser("testuser", "test@example.com", "password123");

        // Act
        UserDetails result = userService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals(user.getUsername(), result.getUsername());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_NotFound()
    {
        assertThrows(UsernameNotFoundException.class, () ->
                userService.loadUserByUsername("nonexistent")
        );
    }

    @Test
    void updateUserDetails_LevelUp()
    {
        // Arrange
        User user = userService.registerUser("testuser", "test@example.com", "password123");

        // Act
        User result = userService.updateUserDetails(user.getUsername(), 150, null, null);

        // Assert
        assertEquals(2, result.getLevel());
        assertEquals(50, result.getExperience());

        // Verify in database
        User savedUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(2, savedUser.getLevel());
        assertEquals(50, savedUser.getExperience());
    }
}