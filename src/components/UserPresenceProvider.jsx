import { useEffect, useState, useRef } from "react";
import useWebSocketPresence from "../hooks/useWebSocketPresence.js";

/**
 * Component wrapper untuk auto-connect WebSocket presence saat user login
 * Harus dibungkus di level routing agar bisa detect user login/logout
 */
export default function UserPresenceProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const prevLoginStateRef = useRef(false);

    // Check login status dan extract user info
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("user_token");
            
            if (token) {
                setIsLoggedIn(true);
                
                // Get email from localStorage
                const email = localStorage.getItem("user_email");
                setUserEmail(email);
                
                // Extract userId from JWT token
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const id = payload.userId || payload.id || payload.sub;
                    setUserId(id);
                    console.log("[UserPresenceProvider] User detected - ID:", id, "Email:", email);
                } catch (e) {
                    console.error("[UserPresenceProvider] Failed to extract userId from token:", e);
                }
            } else {
                // User logged out - important for cleanup
                const wasLoggedIn = prevLoginStateRef.current;
                if (wasLoggedIn) {
                    console.log("[UserPresenceProvider] User logged out - triggering cleanup");
                }
                
                setIsLoggedIn(false);
                setUserId(null);
                setUserEmail(null);
                console.log("[UserPresenceProvider] User not logged in");
            }
            
            // Update previous state
            prevLoginStateRef.current = !!token;
        };

        // Check on mount
        checkLoginStatus();

        // Listen for storage changes (login/logout events)
        const handleStorageChange = (e) => {
            if (e.key === "user_token" || e.key === "user_email") {
                console.log("[UserPresenceProvider] Storage changed, rechecking login status");
                checkLoginStatus();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Also listen for custom login event
        const handleLoginEvent = () => {
            console.log("[UserPresenceProvider] Login event detected");
            checkLoginStatus();
        };

        window.addEventListener("user:login", handleLoginEvent);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("user:login", handleLoginEvent);
        };
    }, []);

    // Auto-connect WebSocket when user is logged in
    useWebSocketPresence(userId, userEmail, isLoggedIn);

    return <>{children}</>;
}
