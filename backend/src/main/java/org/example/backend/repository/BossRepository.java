package org.example.backend.repository;

import org.example.backend.entity.Boss;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BossRepository extends MongoRepository<Boss, String> {
    // Find the active boss for a specific user
    Optional<Boss> findByUserIdAndDefeatedFalse(String userId);
}