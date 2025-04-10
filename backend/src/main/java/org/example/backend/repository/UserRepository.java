package org.example.backend.repository;

import org.example.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String>
{

    Optional<User> findByUsername(String username); // Query to check if the user exists based on username

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
