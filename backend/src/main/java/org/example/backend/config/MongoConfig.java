package org.example.backend.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.example.backend.entity.UserBossProgress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.core.index.Index;

@Configuration
public class MongoConfig
{
    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient()
    {
        return MongoClients.create(mongoUri);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient)
    {
        return new SimpleMongoClientDatabaseFactory(mongoClient, "Questify");
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initIndicesAfterStartup(ApplicationReadyEvent event)
    {
        MongoTemplate mongoTemplate = event.getApplicationContext().getBean(MongoTemplate.class);

        // Create compound index for UserBossProgress
        mongoTemplate.indexOps(UserBossProgress.class)
                .ensureIndex(new Index()
                        .on("userId", Sort.Direction.ASC)
                        .on("bossId", Sort.Direction.ASC)
                        .unique());
    }
}
