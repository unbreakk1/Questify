package org.example.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Component
public class JwtUtil
{
    private Key secretKey;
    private static final int tokenValidity = 1000 * 60 * 60 * 10; // 10 hours

    @Value("${JWT_SECRET:#{environment.JWT_SECRET}}")
    private String secretKeyString;

    @PostConstruct
    public void init()
    {
        if (secretKeyString == null || secretKeyString.trim().isEmpty())
        {
            throw new IllegalStateException("JWT secret key is not configured");
        }
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username)
    {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject)
    {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + tokenValidity))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token)
    {
        return extractClaim(token, Claims::getSubject);
    }

    public Boolean validateToken(String token, String username)
    {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token)
    {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token)
    {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver)
    {
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
        }
        catch (io.jsonwebtoken.JwtException e)
        {
            throw new io.jsonwebtoken.JwtException("Invalid token");
        }

    }

    @FunctionalInterface
    public interface ClaimsResolver<T>
    {
        T resolve(Claims claims);
    }
}