import useWebSocketPresence from "../hooks/useWebSocketPresence.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Component wrapper untuk auto-connect WebSocket presence saat user login.
 * Status login sekarang datang langsung dari AuthContext dan sudah reaktif
 * dengan sendirinya — sebelumnya komponen ini polling localStorage sendiri
 * lewat event storage/user:login/user:logout karena belum ada context yang
 * menyimpan status login sebagai React state.
 */
export default function UserPresenceProvider({ children }) {
    const { user, isAuthenticated } = useAuth();

    useWebSocketPresence(user?.id ?? null, user?.email ?? null, isAuthenticated);

    return <>{children}</>;
}
