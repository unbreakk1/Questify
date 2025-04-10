package org.example.backend.controller;

import org.example.backend.dto.AuthenticationRequest;
import org.example.backend.dto.AuthenticationResponse;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.service.UserService;
import org.example.backend.util.JwtUtil;
import org.springframework.http.HttpStatus;
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
    @ResponseStatus(HttpStatus.OK) // 200 OK, authentication successful
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request)
    {
        // Authenticate user
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // Generate JWT token
        String token = jwtUtil.generateToken(auth.getName());
        return new AuthenticationResponse(token);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.OK) // 200 OK, user registered successfully
    public String register(@RequestBody AuthenticationRequest request)
    {
        userService.registerUser(request.getUsername(), request.getPassword(), "USER");
        return "User registered successfully";
    }

    @ExceptionHandler({AuthenticationException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401 Unauthorized for invalid credentials
    public AuthenticationResponse handleAuthenticationException(AuthenticationException ex)
    {
        return new AuthenticationResponse("Invalid credentials");
    }

    @ExceptionHandler({UserAlreadyExistsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400 Bad Request for duplicate user registration
    public String handleUserAlreadyExistsException(UserAlreadyExistsException ex)
    {
        return ex.getMessage();
    }
}