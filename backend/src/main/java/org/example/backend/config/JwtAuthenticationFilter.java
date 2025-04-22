package org.example.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.service.TokenValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter for JWT token authentication.
 * Intercepts each request to validate JWT tokens and set up the security context.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    private static final Logger LOG = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final TokenValidator tokenValidator;

    public JwtAuthenticationFilter(TokenValidator tokenValidator)
    {
        this.tokenValidator = tokenValidator;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException
    {
        try {
            String token = extractToken(request);

            if (token != null)
            {
                var authentication = tokenValidator.validateToken(token);

                if (authentication != null)
                {
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    LOG.debug("Authentication set for user: {}", authentication.getName());
                }
            }
        } catch (Exception ex) {
            LOG.error("Authentication failed: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request)
    {
        String authorizationHeader = request.getHeader("Authorization");
        return (authorizationHeader != null && authorizationHeader.startsWith("Bearer "))
                ? authorizationHeader.substring(7)
                : null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request)
    {
        // Skip authentication for /auth/** paths
        String path = request.getRequestURI();
        return path.startsWith("/auth/");
    }
}