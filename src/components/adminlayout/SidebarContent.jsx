import { useNavigate } from "react-router-dom";

import SidebarBrand from "./SidebarBrand.jsx";
import SidebarNav from "./SidebarNav.jsx";
import SidebarBottom from "./SidebarBottom.jsx";

export default function SidebarContent({
    menuGroups,
    activeMenu,
    onMenuClick,
    mobile,
    setMobileOpen,
    storeName,
    onLogout,
}) {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col">
            <SidebarBrand
                storeName={storeName}
                mobile={mobile}
                onNavigate={() => navigate("/admin/dashboard")}
                onClose={() => setMobileOpen(false)}
            />

            <SidebarNav
                menuGroups={menuGroups}
                activeMenu={activeMenu}
                onMenuClick={onMenuClick}
                mobile={mobile}
            />

            <SidebarBottom onLogout={onLogout} />
        </div>
    );
}
