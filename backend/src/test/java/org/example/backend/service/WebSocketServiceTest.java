package org.example.backend.service;

import org.example.backend.dto.UserStatsUpdate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class WebSocketServiceTest
{

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private WebSocketService webSocketService;

    private String username;
    private int gold;
    private int level;

    @BeforeEach
    void setUp()
    {
        username = "testUser";
        gold = 100;
        level = 2;
    }

    @Test
    void sendUserStatsUpdate_Success()
    {
        // Act
        webSocketService.sendUserStatsUpdate(username, gold, level);

        // Assert
        verify(messagingTemplate).convertAndSend(
                eq("/topic/user-stats/" + username),
                any(UserStatsUpdate.class)
        );
    }
}