package org.example.backend.service;

import org.example.backend.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TokenValidationServiceTest
{

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private TokenValidationService tokenValidationService;

    private String token;
    private String username;
    private UserDetails userDetails;

    @BeforeEach
    void setUp()
    {
        username = "testuser";
        token = "valid.jwt.token";
        userDetails = new User(username, "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void validateToken_Success()
    {
        // Arrange
        when(jwtUtil.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtil.validateToken(token, username)).thenReturn(true);

        // Act
        UsernamePasswordAuthenticationToken result = tokenValidationService.validateToken(token);

        // Assert
        assertNotNull(result);
        assertEquals(userDetails, result.getPrincipal());
        assertNull(result.getCredentials());
        assertTrue(result.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void validateToken_InvalidToken()
    {
        // Arrange
        when(jwtUtil.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtil.validateToken(token, username)).thenReturn(false);

        // Act
        UsernamePasswordAuthenticationToken result = tokenValidationService.validateToken(token);

        // Assert
        assertNull(result);
    }
}