package org.example.backend.repository;

import org.example.backend.entity.Boss;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BossRepository extends MongoRepository<Boss, String> {
    // Find the active boss for a specific user
    Optional<Boss> findByUserIdAndDefeatedFalse(String userId);

    @Aggregation(pipeline = {
            "{ $match: { 'userId': ?0, 'defeated': false } }",
            "{ $sample: { size: 4 } }"
    })
    Optional<Boss> findFirstByUserIdAndDefeatedFalseOrderByMaxHealthDesc(String userId);


}