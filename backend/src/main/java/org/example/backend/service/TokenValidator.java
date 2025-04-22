package org.example.backend.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

/**
 * Interface for token validation services
 */
public interface TokenValidator
{
    /**
     * Validates the JWT token and creates an Authentication object if valid.
     *
     * @param token JWT token to validate
     * @return Authentication object or null if token is invalid
     */
    UsernamePasswordAuthenticationToken validateToken(String token);
}
