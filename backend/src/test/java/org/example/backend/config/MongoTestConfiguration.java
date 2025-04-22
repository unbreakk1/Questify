package org.example.backend.config;

import com.mongodb.client.MongoClient;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.MongoClients;

@TestConfiguration
public class MongoTestConfiguration
{
    @Bean
    public MongoClient mongoClient()
    {
        return MongoClients.create("mongodb://localhost:27017");
    }

    @Bean
    public MongoTemplate mongoTemplate()
    {
        return new MongoTemplate(mongoClient(), "testdb");
    }

}

