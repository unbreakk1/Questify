package org.example.backend.service;

import io.jsonwebtoken.JwtException;
import org.example.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service responsible for JWT token validation and processing.
 * Uses JwtUtil to parse tokens and UserDetailsService to load user information.
 */
@Service
public class TokenValidationService implements TokenValidator
{
    private static final Logger logger = LoggerFactory.getLogger(TokenValidationService.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public TokenValidationService(JwtUtil jwtUtil, @Lazy UserDetailsService userDetailsService)
    {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Validates the JWT token and creates an Authentication object if valid.
     *
     * @param token JWT token to validate
     * @return Authentication object or null if token is invalid
     */
    public UsernamePasswordAuthenticationToken validateToken(String token)
    {
        try
        {
            String username = jwtUtil.extractUsername(token);
            if (username == null)
            {
                logger.warn("Invalid JWT token - no username extracted");
                return null;
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(token, userDetails.getUsername()))
            {
                logger.debug("Token validated for user: {}", username);
                return new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
            } else
            {
                logger.warn("Token validation failed for user: {}", username);
            }
        } catch (JwtException e)
        {
            logger.warn("JWT token validation error: {}", e.getMessage());
        } catch (UsernameNotFoundException e)
        {
            logger.warn("User not found for token: {}", e.getMessage());
        } catch (Exception e)
        {
            logger.error("Unexpected error during token validation: {}", e.getMessage());
        }

        return null;
    }
}