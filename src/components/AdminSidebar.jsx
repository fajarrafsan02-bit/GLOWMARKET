import { motion as Motion, AnimatePresence } from "framer-motion";

import useStoreSettings from "../hooks/useStoreSettings.js";

import useAdminSidebar from "../hooks/useAdminSidebar.js";

import SidebarContent from "./adminlayout/SidebarContent.jsx";

export default function AdminSidebar({ activeMenu, onLogout, mobileOpen, setMobileOpen }) {
    const store = useStoreSettings();

    const { menuGroups, handleMenuClick } = useAdminSidebar({ setMobileOpen });

    return (
        <>
            {/* DESKTOP */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                <SidebarContent
                    menuGroups={menuGroups}
                    activeMenu={activeMenu}
                    onMenuClick={handleMenuClick}
                    mobile={false}
                    setMobileOpen={setMobileOpen}
                    storeName={store.name}
                    onLogout={onLogout}
                />
            </aside>

            {/* MOBILE */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        />

                        <Motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl"
                        >
                            <SidebarContent
                                menuGroups={menuGroups}
                                activeMenu={activeMenu}
                                onMenuClick={handleMenuClick}
                                mobile
                                setMobileOpen={setMobileOpen}
                                storeName={store.name}
                                onLogout={onLogout}
                            />
                        </Motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
