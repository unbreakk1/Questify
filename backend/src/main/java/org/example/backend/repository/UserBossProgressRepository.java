package org.example.backend.repository;

import org.example.backend.entity.UserBossProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBossProgressRepository extends MongoRepository<UserBossProgress, String>
{
    Optional<UserBossProgress> findByUserIdAndBossId(String userId, String bossId);
    List<UserBossProgress> findByUserId(String userId);
}
