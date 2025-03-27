package org.example.backend.controller;

import org.example.backend.dto.AuthenticationRequest;
import org.example.backend.dto.AuthenticationResponse;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody AuthenticationRequest request) {
        userService.registerUser(request.getUsername(), request.getPassword());
        return "User registered successfully!";
    }

    // Placeholder for login endpoint
    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        // JWT implementation will come next
        return new AuthenticationResponse("placeholder-token");
    }
}
