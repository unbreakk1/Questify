package org.example.backend.service;

import org.example.backend.dto.UserStatsUpdate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService
{
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate)
    {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendUserStatsUpdate(String username, int gold, int level)
    {
        UserStatsUpdate update = new UserStatsUpdate(username, gold, level);
        messagingTemplate.convertAndSend("/topic/user-stats/" + username, update);
    }
}
