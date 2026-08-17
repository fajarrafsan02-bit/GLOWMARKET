import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * `isLoggedIn()` dulu sinkron (Boolean(localStorage.getItem(...))) sehingga
 * keputusan render selalu langsung pada render pertama. Cookie httpOnly tidak
 * bisa dibaca JS, jadi statusnya baru diketahui setelah AuthProvider selesai
 * bertanya ke server — karena itu ada `loading` di sini, yang sebelumnya
 * tidak pernah dibutuhkan.
 */
export default function RequireAuth({ children }) {
    const location = useLocation();
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8] dark:bg-gray-950">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location, openAuthModal: true }} replace />;
    }

    return children;
}
