package org.example.backend.controller;

import org.example.backend.dto.BossResponse;
import org.example.backend.dto.DamageRequest;
import org.example.backend.entity.Boss;
import org.example.backend.service.BossService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        try
        {
            BossResponse bossResponse = bossService.getActiveBoss(userId);
            return ResponseEntity.ok(bossResponse);
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
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
    public ResponseEntity<BossResponse> createBoss(@RequestBody Boss boss, Authentication authentication)
    {
        String userId = authentication.getName(); // Extract user ID from authentication
        BossResponse bossResponse = bossService.createBoss(userId, boss);
        return ResponseEntity.ok(bossResponse);
    }

    // Get a selection of 4 random active bosses
 //  @GetMapping("/selection")
 //  public ResponseEntity<List<Boss>> getBossSelection(@RequestParam("userId") String userId)
 //  {
 //      List<Boss> bosses = bossService.getBossSelection(userId);

 //      // Return empty array if no bosses
 //      return bosses.isEmpty()
 //              ? ResponseEntity.ok(List.of())
 //              : ResponseEntity.ok(bosses);
 //  }


    // Select a boss to start the fight
    @PostMapping("/fight/{bossId}")
    public ResponseEntity<String> startBossFight(@PathVariable String bossId)
    {
        boolean success = bossService.initiateBossFight(bossId);
        if (success)
        {
            return ResponseEntity.ok("Boss fight started!");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Could not start fight. Please try again.");
    }


}