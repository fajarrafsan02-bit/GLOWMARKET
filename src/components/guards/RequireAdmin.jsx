import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RequireAdmin({ children }) {
    const location = useLocation();
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}
