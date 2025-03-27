package org.example.backend.service;

import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService
{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String rawPassword)
    {
        // Check if the user already exists
        if (userRepository.findByUsername(username).isPresent())
        {
            throw new RuntimeException("User already exists!");
        }

        // Create and encrypt the user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword)); // Password encryption
        user.setRoles(Set.of("USER")); // Default role

        return userRepository.save(user); // Save the user to MongoDB
    }

    public Optional<User> findByUsername(String username)
    {
        return userRepository.findByUsername(username);
    }
}
