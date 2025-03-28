package org.example.backend.config;

import org.example.backend.service.TokenValidationService;
import org.example.backend.util.JwtUtil;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilterFactory
{

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilterFactory(JwtUtil jwtUtil, UserDetailsService userDetailsService)
    {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public JwtAuthenticationFilter create()
    {
        TokenValidationService tokenValidationService = new TokenValidationService(jwtUtil, userDetailsService);
        return new JwtAuthenticationFilter(tokenValidationService);
    }
}
