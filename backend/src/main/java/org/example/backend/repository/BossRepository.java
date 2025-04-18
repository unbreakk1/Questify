package org.example.backend.repository;

import org.example.backend.entity.Boss;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BossRepository extends MongoRepository<Boss, String>
{

    /**
     * Finds all bosses where the level requirement is less than or equal to the user's level.
     * This retrieves bosses that the user is eligible to fight.
     *
     * @param levelRequirement The maximum level of the boss.
     * @return A list of bosses suitable for the user's level.
     */
    List<Boss> findByLevelRequirementLessThanEqual(int levelRequirement);

    /**
     * Finds a random sample of 3 or 4 bosses.
     * This uses the MongoDB `$sample` aggregation internally to return random bosses.
     *
     * @param levelRequirement The maximum level of the boss.
     * @param size             The size of the final boss selection.
     * @return A list of bosses, up to the given size.
     */
    @Query(value = "{ 'levelRequirement': { $lte: ?0 } }", fields = "{ }")
    @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
            "{ $match: { 'levelRequirement': { $lte: ?0 } } }",
            "{ $sample: { size: ?1 } }"
    })
    List<Boss> findRandomBosses(int levelRequirement, int size);

    /**
     * Finds a random "Rare" boss that the user is eligible to fight.
     * Rare bosses are selected when their `rare` field is true.
     *
     * @param levelRequirement The maximum level of the boss.
     * @return An optional rare boss.
     */
    @Query(value = "{ 'levelRequirement': { $lte: ?0 }, 'rare': true }")
    Optional<Boss> findFirstByLevelRequirementLessThanEqualAndRareTrue(int levelRequirement);

    List<Boss> findByDefeatedTrue();

    long countByDefeatedFalse();

    @Aggregation(pipeline = {
            "{ $match: { defeated: false } }",
            "{ $sample: { size: ?0 } }"
    })
    List<Boss> findRandomBosses(int size);
}

