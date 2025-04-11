package org.example.backend.controller;

import org.example.backend.dto.AuthenticationRequest;
import org.example.backend.dto.AuthenticationResponse;
import org.example.backend.dto.RegisterRequest;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.service.UserService;
import org.example.backend.util.JwtUtil;
import org.springframework.http.HttpStatus;
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
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);
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
        logger.info("Login request received for username: {}", request.getUsername());
        logger.info("Password received for username: {}", request.getPassword());

        try
        {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            String token = jwtUtil.generateToken(auth.getName());
            logger.info("Authentication successful. JWT token generated: {}", token);
            return new AuthenticationResponse(token);
        } catch (Exception ex)
        {
            logger.error("Authentication failed for username: {}", request.getUsername(), ex);
            throw ex;
        }
    }

        @ResponseStatus(HttpStatus.OK) // 200 OK, user registered successfully
        @PostMapping("/register")
        public ResponseEntity<?> register (@RequestBody RegisterRequest request)
        {
            try
            {
                // Pass the correct arguments to the service
                userService.registerUser(
                        request.getUsername(),
                        request.getEmail(),
                        request.getPassword()
                );
                return ResponseEntity.ok("Registration successful!");
            } catch (Exception e)
            {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }


        @ExceptionHandler({AuthenticationException.class})
        @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401 Unauthorized for invalid credentials
        public AuthenticationResponse handleAuthenticationException (AuthenticationException ex)
        {
            return new AuthenticationResponse("Invalid credentials");
        }

        @ExceptionHandler({UserAlreadyExistsException.class})
        @ResponseStatus(HttpStatus.BAD_REQUEST) // 400 Bad Request for duplicate user registration
        public String handleUserAlreadyExistsException (UserAlreadyExistsException ex)
        {
            return ex.getMessage();
        }
    }