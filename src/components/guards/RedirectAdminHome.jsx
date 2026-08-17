import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Membungkus seluruh rute area customer (publik maupun yang butuh login).
 * Akun berperan ADMIN tidak pernah dibiarkan berada di halaman customer —
 * begitu status admin diketahui (termasuk setelah sesi dipulihkan diam-diam
 * lewat refresh token, bukan hanya saat login manual), langsung dialihkan
 * ke dashboard admin.
 *
 * Sengaja TIDAK menahan render dengan spinner selama `loading` — halaman
 * publik seperti Beranda/Katalog harus tetap langsung tampil untuk
 * pengunjung anonim seperti sebelumnya. Admin yang baru saja diketahui
 * statusnya akan berpindah begitu pemeriksaan sesi selesai.
 */
export default function RedirectAdminHome() {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (!loading && isAuthenticated && isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}
