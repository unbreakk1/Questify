package org.example.backend.controller;

import org.example.backend.dto.AuthenticationRequest;
import org.example.backend.dto.AuthenticationResponse;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.service.UserService;
import org.example.backend.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController
{

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService)
    {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request)
    {
        try
        {
            // Authenticate user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(auth.getName());
            return ResponseEntity.ok(new AuthenticationResponse(token));

        }
        catch (AuthenticationException e)
        {
            return ResponseEntity.status(401).body(new AuthenticationResponse("Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthenticationRequest request)
    {
        try
        {
            userService.registerUser(request.getUsername(), request.getPassword());
            return ResponseEntity.ok("User registered successfully");
        }
        catch (UserAlreadyExistsException e)
        {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
