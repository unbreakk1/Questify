package org.example.backend.integration;

import org.example.backend.dto.UserStatsUpdate;
import org.example.backend.service.WebSocketService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.mockito.Mockito.mock;

@SpringBootTest
@ActiveProfiles("test")
class WebSocketServiceIntegrationTest
{
    @TestConfiguration
    static class TestConfig
    {
        @Bean
        SimpMessagingTemplate messagingTemplate()
        {
            return mock(SimpMessagingTemplate.class);
        }
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private WebSocketService webSocketService;

    @Test
    void sendUserStatsUpdate_Success()
    {
        // Arrange
        String username = "testUser";
        int gold = 100;
        int level = 2;

        // Act
        webSocketService.sendUserStatsUpdate(username, gold, level);

        // Assert
        Mockito.verify(messagingTemplate).convertAndSend(
                ArgumentMatchers.eq("/topic/user-stats/" + username),
                ArgumentMatchers.any(UserStatsUpdate.class)
        );

    }
}