import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {getUsernameFromToken} from "../utils/UserAPI.tsx";

interface UserStatsUpdate
{
    userId: string;
    gold: number;
    level: number;
}

class WebSocketService
{
    private client: Client;
    private subscribers: Map<string, (data: UserStatsUpdate) => void>;

    constructor()
    {
        this.subscribers = new Map();
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws', undefined, {
                transports: ['websocket', 'xhr-streaming', 'xhr-polling']
            }),
            onConnect: () =>
            {
                console.log('WebSocket Connected!');
                const username = getUsernameFromToken();
                if (username)
                {
                    this.subscribeToUserStats(username, (update) =>
                    {
                        // Handle the update here
                        console.log('Received user stats update:', update);
                    });
                }

            },
            onStompError: (frame) =>
            {
                console.error('WebSocket Error:', frame);
            }
        });
    }

    public connect()
    {
        this.client.activate();
    }

    public disconnect()
    {
        this.client.deactivate();
    }

    public subscribeToUserStats(userId: string, callback: (data: UserStatsUpdate) => void)
    {
        this.subscribers.set(userId, callback);

        if (this.client.connected)
        {
            this.client.subscribe(`/topic/user-stats/${userId}`, (message) =>
            {
                const data: UserStatsUpdate = JSON.parse(message.body);
                callback(data);
            });
        }
    }
}

export const webSocketService = new WebSocketService();