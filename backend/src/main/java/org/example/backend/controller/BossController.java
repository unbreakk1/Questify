package org.example.backend.controller;

import org.example.backend.dto.BossResponse;
import org.example.backend.dto.DamageRequest;
import org.example.backend.entity.Boss;
import org.example.backend.entity.User;
import org.example.backend.service.BossService;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boss")
public class BossController
{

    private final BossService bossService;
    private final UserService userService;

    public BossController(BossService bossService, UserService userService)
    {
        this.bossService = bossService;
        this.userService = userService;
    }

    @GetMapping("/active")
    @ResponseStatus(HttpStatus.OK)
    public BossResponse getActiveBoss(Authentication authentication)
    {
        // Get identifier (could be username or _id)
        String identifier = authentication.getName();
        User user = userService.getUserBasicDetails(identifier); // Resolve user safely
        return bossService.getActiveBoss(user.getId()); // Use the MongoDB _id
    }


    @PutMapping("/attack")
    @ResponseStatus(HttpStatus.OK)
    public BossResponse attackBoss(Authentication authentication, @RequestBody DamageRequest damageRequest)
    {
        // Get identifier (username or _id)
        String identifier = authentication.getName();
        User user = userService.getUserBasicDetails(identifier); // Resolve user safely
        return bossService.dealDamage(user.getId(), damageRequest.getDamage()); // Use the _id for damage logic
    }


    @GetMapping("/selection")
    @ResponseStatus(HttpStatus.OK)
    public List<Boss> getBossSelection(Authentication authentication)
    {
        // Get identifier (username or _id)
        String identifier = authentication.getName();
        User user = userService.getUserBasicDetails(identifier); // Safely resolve user
        return bossService.getBossSelection(user.getLevel()); // Pass user level
    }


    @PostMapping("/select/{bossId}")
    @ResponseStatus(HttpStatus.OK)
    public String selectBoss(Authentication authentication, @PathVariable String bossId) {
        // Get the currently authenticated user identifier (username or ID)
        String identifier = authentication.getName();

        // Fetch the user information
        User user = userService.getUserBasicDetails(identifier);

        // Verify if the boss exists
        Boss boss = bossService.getBossById(bossId);
        if (boss == null) {
            throw new IllegalArgumentException("Invalid boss ID: " + bossId);
        }

        // Update the user's current boss selection
        user.setCurrentBossId(bossId);
        userService.saveUser(user); // Persist the update to the database

        return "Boss '" + boss.getName() + "' successfully selected for user " + user.getUsername();
    }



    @PostMapping("/fight/{bossId}")
    @ResponseStatus(HttpStatus.OK)
    public String startBossFight(@PathVariable String bossId)
    {
        if (bossService.initiateBossFight(bossId))
        {
            return "Boss fight started!";
        }
        throw new IllegalStateException("Could not start fight. Please try again."); // Will map to 409 Conflict
    }


    @ExceptionHandler({IllegalArgumentException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgumentException(IllegalArgumentException ex)
    {
        return ex.getMessage();
    }

    @ExceptionHandler({IllegalStateException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleIllegalStateException(IllegalStateException ex)
    {
        return ex.getMessage();
    }
}