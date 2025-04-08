package org.example.backend.controller;

import org.example.backend.dto.UpdateUserRequest;
import org.example.backend.entity.User;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController
{

    private final UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    // Fetch basic user details (for small display containers)
    @GetMapping("/details/{userId}")
    @ResponseStatus(HttpStatus.OK) // 200 OK, user details fetched successfully
    public User getUserBasicDetails(@PathVariable String userId)
    {
        return userService.getUserBasicDetails(userId);
    }

    // Fetch detailed user information (for popup display)
    @GetMapping("/info/{userId}")
    @ResponseStatus(HttpStatus.OK) // 200 OK, detailed info fetched successfully
    public User getUserDetailedInfo(@PathVariable String userId)
    {
        return userService.getUserDetailedInfo(userId);
    }

    // Update user details (e.g., experience, level, streak)
    @PutMapping("/update/{userId}")
    @ResponseStatus(HttpStatus.OK) // 200 OK, user details updated successfully
    public User updateUserDetails(
            @PathVariable String userId,
            @RequestBody UpdateUserRequest updateRequest)
    {
        return userService.updateUserDetails(
                userId,
                updateRequest.getExperience(),
                updateRequest.getLevel(),
                updateRequest.getStreak()
        );
    }

    // Get the current boss the user is fighting (if any)
    @GetMapping("/{userId}/current-boss")
    @ResponseStatus(HttpStatus.OK) // 200 OK, current boss fetched successfully
    public String getUserCurrentBossId(@PathVariable String userId)
    {
        return userService.getUserCurrentBossId(userId);
    }

    // Handle exceptions for invalid user IDs
    @ExceptionHandler({IllegalArgumentException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND) // 404 NOT FOUND if user ID is invalid
    public String handleIllegalArgumentException(IllegalArgumentException ex)
    {
        return ex.getMessage();
    }
}