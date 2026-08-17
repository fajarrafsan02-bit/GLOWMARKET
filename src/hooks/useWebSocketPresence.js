import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

/**
 * Custom hook for WebSocket user presence tracking
 * Backend automatically detects ONLINE/OFFLINE from WebSocket CONNECT/DISCONNECT events
 * No need to manually publish presence status
 */
export const useWebSocketPresence = (userId, userEmail, isLoggedIn) => {
    const stompClientRef = useRef(null);

    useEffect(() => {
        // Only connect if user is logged in and has userId
        if (!isLoggedIn || !userId) {
            return;
        }

        // Cookie httpOnly ikut terkirim otomatis pada handshake SockJS.
        const socketUrl = "/ws";

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            onConnect: () => {
                console.log("[WebSocket Presence] Connected - User is now ONLINE");
                console.log("[WebSocket Presence] Backend auto-detected via SessionConnectEvent");
                // Backend otomatis tandai ONLINE dari CONNECT event (WebSocketEventListener)
                // TIDAK PERLU client.publish("/app/user.presence", ...)
            },
            onDisconnect: () => {
                console.log("[WebSocket Presence] Disconnected - User is now OFFLINE");
                console.log(
                    "[WebSocket Presence] Backend auto-detected via SessionDisconnectEvent",
                );
                // Backend otomatis tandai OFFLINE dari DISCONNECT event (WebSocketEventListener)
            },
            onStompError: (frame) => {
                console.error("[WebSocket Presence] Error:", frame.headers["message"]);
                console.error("[WebSocket Presence] Details:", frame.body);
            },
            // Auto reconnect
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
        });

        client.activate();
        stompClientRef.current = client;

        // Cleanup on unmount or logout
        return () => {
            console.log("[WebSocket Presence] Cleaning up...");

            // Deactivate client - backend will detect DISCONNECT and mark user OFFLINE
            if (client) {
                client.deactivate();
            }
            stompClientRef.current = null;
        };
    }, [userId, userEmail, isLoggedIn]);

    return stompClientRef;
};

export default useWebSocketPresence;
