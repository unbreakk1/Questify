package org.example.backend.service;

import org.example.backend.entity.User;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import java.util.Set;
import java.time.LocalDateTime;

@Service
public class UserService implements UserDetailsService
{
    private static final Logger log = LoggerFactory.getLogger(UserService.class);



    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new user
    public User registerUser(String username, String email, String rawPassword)
    {
        // Check if username or email already exists
        if (userRepository.existsByUsername(username))
        {
            throw new UserAlreadyExistsException("Username is already taken.");
        }
        if (userRepository.existsByEmail(email))
        {
            throw new UserAlreadyExistsException("Email is already taken.");
        }

        // Hash the password before saving
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Create and save the new user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encodedPassword); // Store hashed password
        user.setLevel(0);
        user.setExperience(0);
        user.setStreak(0);
        user.setGold(0);
        user.addBadge("Newbie");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }


    // Load user details required by Spring Security during authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Attempting to fetch user details for username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        log.info("User found: {}", user.getUsername());
        log.info("Hashed password from DB: {}", user.getPassword());

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword()) // Hashed password from DB
                .roles("USER") // Example role
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

    public void updateGoldAndBadges(String userId, int gold, Set<String> badges)
    {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setGold(gold);
        user.getBadges().addAll(badges);
        userRepository.save(user);
    }


}