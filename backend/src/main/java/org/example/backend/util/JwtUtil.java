package org.example.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtUtil
{
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtUtil.class);
    private static final long TOKEN_VALIDITY = 1000L * 60 * 60 * 10; // 10 hours
    private static final int MIN_SECRET_LENGTH = 32;

    private Key secretKey;

    @Value("${JWT_SECRET:#{environment.JWT_SECRET}}")
    private String secretKeyString;

    @PostConstruct
    public void init()
    {
        validateSecretKey();
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    private void validateSecretKey()
    {
        if (secretKeyString == null || secretKeyString.trim().isEmpty())
        {
            throw new IllegalStateException("JWT secret key is not configured");
        }
        if (secretKeyString.length() < MIN_SECRET_LENGTH)
        {
            throw new IllegalStateException(
                    String.format("JWT secret key must be at least %d characters long", MIN_SECRET_LENGTH)
            );
        }
    }

    public String generateToken(String username)
    {
        if (username == null || username.trim().isEmpty())
        {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        return createToken(new HashMap<>(), username);
    }

    private String createToken(Map<String, Object> claims, String subject)
    {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(currentTimeMillis))
                .expiration(new Date(currentTimeMillis + TOKEN_VALIDITY))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token)
    {
        validateToken(token);
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, String username)
    {
        if (token == null || username == null)
        {
            return false;
        }
        try
        {
            final String extractedUsername = extractUsername(token);
            return extractedUsername.equals(username) && !isTokenExpired(token);
        } catch (JwtException e)
        {
            LOGGER.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    private void validateToken(String token)
    {
        if (token == null || token.trim().isEmpty())
        {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
    }

    private boolean isTokenExpired(String token)
    {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token)
    {
        validateToken(token);
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver)
    {
        validateToken(token);
        final Claims claims = extractAllClaims(token);
        return claimsResolver.resolve(claims);
    }

    private Claims extractAllClaims(String token)
    {
        try
        {
            return Jwts.parser()
                    .keyLocator(request -> secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e)
        {
            LOGGER.error("Failed to parse JWT token: {}", e.getMessage());
            throw new JwtException("Invalid token");
        }
    }

    @FunctionalInterface
    public interface ClaimsResolver<T>
    {
        T resolve(Claims claims);
    }
}