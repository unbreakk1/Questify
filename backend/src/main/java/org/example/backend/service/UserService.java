package org.example.backend.service;

import org.example.backend.entity.User;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.time.LocalDateTime;

@Service
public class UserService implements UserDetailsService
{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new user
    public User registerUser(String username, String rawPassword)
    {
        // Check if the user already exists
        if (userRepository.findByUsername(username).isPresent())
        {
            throw new UserAlreadyExistsException("User with username '" + username + "' already exists.");
        }

        // Create and save the new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword)); // Secure password
        user.setRoles(Set.of("USER")); // Assign default role
        return userRepository.save(user);
    }

    // Load user details required by Spring Security during authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Convert User entity to Spring Security UserDetails
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRoles().toArray(new String[0])) // Convert roles to array
                .build();
    }

    // Retrieve a user for app-specific use-cases (like API user info)
    public Optional<User> findByUsername(String username)
    {
        return userRepository.findByUsername(username);
    }

    /**
     * Fetches basic details of a user, including XP, level, and username.
     *
     * @param userId The ID of the user whose details to fetch.
     * @return An optional User object with the details.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User getUserBasicDetails(String userId)
    {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with user ID '" + userId + "' not found."));
    }

    /**
     * Updates the XP, level, streak, or any other details of a user.
     *
     * @param userId     The ID of the user to update.
     * @param experience The new XP value (optional).
     * @param level      The new level value (optional).
     * @param streak     The new streak value (optional).
     * @return The updated User object.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User updateUserDetails(String userId, Integer experience, Integer level, Integer streak)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with user ID '" + userId + "' not found."));

        if (experience != null)
        {
            user.setExperience(experience);
        }
        if (level != null)
        {
            user.setLevel(level);
        }
        if (streak != null)
        {
            user.setStreak(streak);
        }

        user.setUpdatedAt(LocalDateTime.now()); // Update last activity timestamp
        return userRepository.save(user);
    }

    /**
     * Fetches detailed information for a user, used for a more detailed popup display.
     *
     * @param userId The ID of the user.
     * @return An instance of `User` containing all the user's details.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User getUserDetailedInfo(String userId)
    {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with user ID '" + userId + "' not found."));
    }

    /**
     * Gets details about the boss the user is currently fighting.
     *
     * @param userId The ID of the user.
     * @return The current boss ID of the user.
     * @throws IllegalArgumentException if the user is not found or if the user is not fighting any boss.
     */
    public String getUserCurrentBossId(String userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with user ID '" + userId + "' not found."));

        if (user.getCurrentBossId() == null || user.getCurrentBossId().isEmpty())
        {
            throw new IllegalArgumentException("User is currently not fighting any boss.");
        }

        return user.getCurrentBossId();
    }

}