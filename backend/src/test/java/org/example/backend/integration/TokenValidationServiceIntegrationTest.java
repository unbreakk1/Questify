package org.example.backend.integration;

import org.example.backend.repository.UserRepository;
import org.example.backend.service.TokenValidationService;
import org.example.backend.service.UserService;
import org.example.backend.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class TokenValidationServiceIntegrationTest
{

    @Autowired
    private TokenValidationService tokenValidationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private String username;
    private String token;

    @BeforeEach
    void setUp()
    {
        userRepository.deleteAll();

        // Create a test user
        username = "testUser";
        userService.registerUser(username, "test@example.com", "password123");

        // Generate a valid token
        token = jwtUtil.generateToken(username);
    }

    @Test
    void validateToken_Success()
    {
        // Act
        UsernamePasswordAuthenticationToken result = tokenValidationService.validateToken(token);

        // Assert
        assertNotNull(result);
        assertEquals(username, ((org.springframework.security.core.userdetails.User) result.getPrincipal()).getUsername());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void validateToken_InvalidToken()
    {
        // Act & Assert
        assertNull(tokenValidationService.validateToken("invalid.token.here"));
    }

}