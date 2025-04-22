package org.example.backend.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.example.backend.dto.BossResponse;
import org.example.backend.dto.DamageRequest;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.service.BossService;
import org.example.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/boss")
@Validated
public class BossController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(BossController.class);
    private final BossService bossService;
    private final UserService userService;

    public BossController(BossService bossService, UserService userService)
    {
        this.bossService = Objects.requireNonNull(bossService, "BossService must not be null");
        this.userService = Objects.requireNonNull(userService, "UserService must not be null");
    }

    @GetMapping("/active")
    @ResponseStatus(HttpStatus.OK)
    public BossResponse getActiveBoss(Authentication authentication)
    {
        LOGGER.debug("Getting active boss for user: {}", authentication.getName());
        User user = getUserFromAuthentication(authentication);
        validateActiveBoss(user);
        return bossService.getActiveBoss(user.getId());
    }

    @PutMapping("/attack")
    @ResponseStatus(HttpStatus.OK)
    public BossResponse attackBoss(
            Authentication authentication,
            @Valid @RequestBody DamageRequest damageRequest)
    {
        LOGGER.debug("Processing attack from user: {}", authentication.getName());
        User user = getUserFromAuthentication(authentication);
        return bossService.dealDamage(user.getId(), damageRequest.getDamage());
    }

    @GetMapping("/selection")
    @ResponseStatus(HttpStatus.OK)
    public List<Boss> getBossSelection(Authentication authentication)
    {
        LOGGER.debug("Getting boss selection for user: {}", authentication.getName());
        getUserFromAuthentication(authentication); // Validate user exists
        return bossService.getBossSelection();
    }

    @PostMapping("/select/{bossId}")
    @ResponseStatus(HttpStatus.OK)
    public String selectBoss(
            Authentication authentication,
            @PathVariable @NotBlank(message = "Boss ID cannot be empty") String bossId)
    {
        LOGGER.debug("User {} selecting boss: {}", authentication.getName(), bossId);
        User user = getUserFromAuthentication(authentication);
        Boss boss = validateAndGetBoss(bossId);

        initializeBossForUser(user, boss);

        return String.format("Boss '%s' successfully selected for user %s",
                boss.getName(), user.getUsername());
    }

    @PostMapping("/fight/{bossId}")
    @ResponseStatus(HttpStatus.OK)
    public String startBossFight(
            @PathVariable @NotBlank(message = "Boss ID cannot be empty") String bossId)
    {
        LOGGER.debug("Starting boss fight with boss ID: {}", bossId);
        if (bossService.initiateBossFight(bossId))
        {
            return "Boss fight started!";
        }
        throw new IllegalStateException("Could not start fight. Please try again.");
    }

    private User getUserFromAuthentication(Authentication authentication)
    {
        if (authentication == null)
        {
            throw new IllegalArgumentException("Authentication cannot be null");
        }
        return userService.getUserBasicDetails(authentication.getName());
    }

    private void validateActiveBoss(User user)
    {
        if (user.getCurrentBossId() == null)
        {
            LOGGER.warn("No active boss found for user: {}", user.getUsername());
            throw new IllegalStateException("NO_ACTIVE_BOSS");
        }
    }

    private Boss validateAndGetBoss(String bossId)
    {
        Boss boss = bossService.getBossById(bossId);
        if (boss == null)
        {
            LOGGER.warn("Invalid boss ID attempted: {}", bossId);
            throw new IllegalArgumentException("Invalid boss ID: " + bossId);
        }
        return boss;
    }

    private void initializeBossForUser(User user, Boss boss)
    {
        bossService.initializeUserBossProgress(user.getId(), boss.getId(), boss.getMaxHealth());
        user.setCurrentBossId(boss.getId());
        userService.saveUser(user);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgumentException(IllegalArgumentException ex)
    {
        LOGGER.warn("Bad request: {}", ex.getMessage());
        return ex.getMessage();
    }

    @ExceptionHandler({IllegalStateException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleIllegalStateException(IllegalStateException ex)
    {
        LOGGER.warn("Conflict: {}", ex.getMessage());
        return ex.getMessage();
    }
}