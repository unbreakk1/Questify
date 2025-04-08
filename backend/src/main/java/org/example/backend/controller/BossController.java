package org.example.backend.controller;

import org.example.backend.dto.BossResponse;
import org.example.backend.dto.DamageRequest;
import org.example.backend.entity.Boss;
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

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public BossResponse getActiveBoss(Authentication authentication)
    {
        String userId = authentication.getName();
        return bossService.getActiveBoss(userId);
    }

    @PutMapping("/attack")
    @ResponseStatus(HttpStatus.OK)
    public BossResponse attackBoss(Authentication authentication, @RequestBody DamageRequest damageRequest)
    {
        String userId = authentication.getName();
        return bossService.dealDamage(userId, damageRequest.getDamage());
    }

    @GetMapping("/selection")
    @ResponseStatus(HttpStatus.OK)
    public List<Boss> getBossSelection(Authentication authentication)
    {
        String userId = authentication.getName();
        int userLevel = userService.getUserBasicDetails(userId).getLevel();
        return bossService.getBossSelection(userLevel);
    }

    @PostMapping("/select/{bossId}")
    @ResponseStatus(HttpStatus.OK)
    public String selectBoss(Authentication authentication, @PathVariable String bossId)
    {
        String userId = authentication.getName();
        return "Boss successfully selected for user " + userId;
    }

    @PostMapping("/fight/{bossId}")
    @ResponseStatus(HttpStatus.OK)
    public String startBossFight(@PathVariable String bossId)
    {
        if (bossService.initiateBossFight(bossId))
        {
            return "Boss fight started!";
        }
        throw new IllegalStateException("Could not start fight. Please try again."); // Will map to 409 Conflict in a handler
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