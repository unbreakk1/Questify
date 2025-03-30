package org.example.backend.controller;

import org.example.backend.dto.BossResponse;
import org.example.backend.dto.DamageRequest;
import org.example.backend.entity.Boss;
import org.example.backend.service.BossService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boss")
public class BossController
{

    private final BossService bossService;

    public BossController(BossService bossService)
    {
        this.bossService = bossService;
    }

    @GetMapping
    public ResponseEntity<BossResponse> getActiveBoss(Authentication authentication)
    {
        String userId = authentication.getName();
        BossResponse bossResponse = bossService.getActiveBoss(userId);
        return ResponseEntity.ok(bossResponse);
    }

    @PutMapping("/attack")
    public ResponseEntity<BossResponse> attackBoss(Authentication authentication,
                                                   @RequestBody DamageRequest damageRequest)
    {
        String userId = authentication.getName();
        BossResponse updatedBoss = bossService.dealDamage(userId, damageRequest.getDamage());
        return ResponseEntity.ok(updatedBoss);
    }

    @PostMapping("/create")
    public ResponseEntity<BossResponse> createBoss(@RequestBody Boss boss, Authentication authentication) {
        String userId = authentication.getName(); // Extract user ID from authentication
        BossResponse bossResponse = bossService.createBoss(userId, boss);
        return ResponseEntity.ok(bossResponse);
    }

}