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
        user.setLevel(1);
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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
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


    /**
     * Fetches basic details of a user, including XP, level, and username.
     *
     * @param identifier The ID or Username of the user whose details to fetch.
     * @return An optional User object with the details.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User getUserBasicDetails(String identifier)
    {
        return resolveUser(identifier); // Reuses the helper method
    }


    /**
     * Updates the XP, level, streak, or any other details of a user.
     *
     * @param identifier The ID or Username of the user to update.
     * @param experience The new XP value (optional).
     * @param level      The new level value (optional).
     * @param streak     The new streak value (optional).
     * @return The updated User object.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User updateUserDetails(String identifier, Integer experience, Integer level, Integer streak)
    {
        User user = resolveUser(identifier);

        System.out.printf("Recieved XP: %d, forName: %s%n", experience, identifier);
        // Update XP if provided
        if (experience != null)
        {
            System.out.printf("Updating XP for user %s with %d XP%n", identifier, experience);
            user.setExperience(user.getExperience() + experience);

            // Check for level-up
            int xpForNextLevel = 100 * user.getLevel(); // Example: Level 2 requires 200 XP
            while (user.getExperience() >= xpForNextLevel)
            {
                user.setExperience(user.getExperience() - xpForNextLevel); // Carry extra XP to next level
                user.setLevel(user.getLevel() + 1); // Increment the user's level

                // Recalculate XP for the next level
                xpForNextLevel = 100 * user.getLevel();
            }
        }

        // Update streak if provided
        if (streak != null)
        {
            user.setStreak(streak);
        }

        // Save user
        saveUser(user);
        System.out.printf("User saved with Final XP: %d | Final Level: %d%n",
                user.getExperience(), user.getLevel());


        return user;
    }


    /**
     * Fetches detailed information for a user, used for a more detailed popup display.
     *
     * @param identifier The ID or Username of the user.
     * @return An instance of `User` containing all the user's details.
     * @throws IllegalArgumentException if the user is not found.
     */
    public User getUserDetailedInfo(String identifier)
    {
        // Determine if the identifier is ObjectId
        if (org.bson.types.ObjectId.isValid(identifier))
        {
            return userRepository.findById(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("User with ID '" + identifier + "' not found."));
        }
        // Otherwise, treat it as username
        return userRepository.findByUsername(identifier)
                .orElseThrow(() -> new IllegalArgumentException("User with username '" + identifier + "' not found."));
    }


    /**
     * Gets details about the boss the user is currently fighting.
     *
     * @param identifier The ID or Username of the user.
     * @return The current boss ID of the user.
     * @throws IllegalArgumentException if the user is not found or if the user is not fighting any boss.
     */
    public String getUserCurrentBossId(String identifier)
    {
        User user = resolveUser(identifier); // Reuses the helper method

        String currentBossId = user.getCurrentBossId();
        if (currentBossId == null)
        {
            throw new IllegalArgumentException("User is not fighting any boss.");
        }

        return currentBossId;
    }

    private User resolveUser(String identifier)
    {
        // Check if the identifier is a valid MongoDB ObjectId
        if (org.bson.types.ObjectId.isValid(identifier))
        {
            // Lookup by ID
            return userRepository.findById(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("User with ID '" + identifier + "' not found."));
        }

        // Otherwise, lookup by username
        return userRepository.findByUsername(identifier)
                .orElseThrow(() -> new IllegalArgumentException("User with username '" + identifier + "' not found."));
    }

    public User saveUser(User user) {
        System.out.printf("Before save - Username: %s, XP: %d, Level: %d%n",
                user.getUsername(), user.getExperience(), user.getLevel());

        User savedUser = userRepository.save(user);

        // Verify the saved state
        System.out.printf("After save - Username: %s, XP: %d, Level: %d%n",
                savedUser.getUsername(), savedUser.getExperience(), savedUser.getLevel());

        // Immediately fetch from DB to verify persistence
        User verifiedUser = userRepository.findByUsername(user.getUsername()).orElse(null);
        if (verifiedUser != null) {
            System.out.printf("Verified in DB - Username: %s, XP: %d, Level: %d%n",
                    verifiedUser.getUsername(), verifiedUser.getExperience(), verifiedUser.getLevel());
        } else {
            System.out.println("Failed to verify user in DB after save!");
        }

        return savedUser;
    }


}