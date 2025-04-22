package org.example.backend.service;

import org.example.backend.util.JwtUtil;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationService
{

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public TokenValidationService(JwtUtil jwtUtil, @Lazy UserDetailsService userDetailsService)
    {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public UsernamePasswordAuthenticationToken validateToken(String token)
    {
        try
        {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(token, userDetails.getUsername()))
            {
                return new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
            }
        }
        catch (io.jsonwebtoken.JwtException | UsernameNotFoundException e)
        {
            // Any JWT exception or user not found exception should result in null
            return null;
        }
        return null;
    }

}
