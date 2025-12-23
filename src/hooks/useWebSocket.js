import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (url, topic, onMessage) => {
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        // Create STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS(url),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('[STOMP Debug]', str);
            },
            onConnect: () => {
                console.log('[WebSocket] Connected successfully');
                setIsConnected(true);

                // Subscribe to topic
                if (topic && onMessage) {
                    client.subscribe(topic, (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            console.log('[WebSocket] Message received:', data);
                            onMessage(data);
                        } catch (error) {
                            console.error('[WebSocket] Error parsing message:', error);
                        }
                    });
                }
            },
            onDisconnect: () => {
                console.log('[WebSocket] Disconnected');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('[WebSocket] STOMP error:', frame);
                setIsConnected(false);
            },
            onWebSocketError: (error) => {
                console.error('[WebSocket] WebSocket error:', error);
                setIsConnected(false);
            },
        });

        clientRef.current = client;

        // Activate the client
        client.activate();

        // Cleanup on unmount
        return () => {
            if (client.active) {
                console.log('[WebSocket] Deactivating client');
                client.deactivate();
            }
        };
    }, [url, topic]);

    const sendMessage = (destination, body) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn('[WebSocket] Cannot send message - not connected');
        }
    };

    return { isConnected, sendMessage };
};
