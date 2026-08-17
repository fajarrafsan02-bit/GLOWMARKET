import { useCallback, useEffect, useRef, useState } from "react";
import {
    Settings,
    UserCog,
    Store,
    PackageSearch,
    Truck,
    CreditCard,
    Bot,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout.jsx";
import api from "../api/Axios.jsx";
import { invalidateStoreSettings } from "../hooks/useStoreSettings.js";

import SettingsTabs from "../components/adminsettings/SettingsTabs.jsx";
import ProfileSettingsForm from "../components/adminsettings/ProfileSettingsForm.jsx";
import StoreSettingsForm from "../components/adminsettings/StoreSettingsForm.jsx";
import StockSettingsForm from "../components/adminsettings/StockSettingsForm.jsx";
import OngkirSettings from "../components/adminsettings/OngkirSettings.jsx";
import RajaOngkirSettingsForm from "../components/adminsettings/RajaOngkirSettingsForm.jsx";
import PaymentSettingsForm from "../components/adminsettings/PaymentSettingsForm.jsx";
import ChatbotSettingsForm from "../components/adminsettings/ChatbotSettingsForm.jsx";

const TABS = [
    {
        key: "profile",
        label: "Profil Admin",
        icon: UserCog,
    },
    {
        key: "store",
        label: "Toko",
        icon: Store,
    },
    {
        key: "stock",
        label: "Stok",
        icon: PackageSearch,
    },
    {
        key: "shipping",
        label: "Pengiriman",
        icon: Truck,
    },
    {
        key: "payment",
        label: "Pembayaran",
        icon: CreditCard,
    },
    {
        key: "chatbot",
        label: "Chatbot",
        icon: Bot,
    },
];

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const [settings, setSettings] = useState({});

    /* Dipakai sebagai `key` form agar state lokalnya
       ikut ter-refresh setiap pengaturan dimuat/disimpan. */
    const [settingsVersion, setSettingsVersion] = useState(0);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [toast, setToast] = useState(null);

    const toastTimer = useRef(null);

    /* ============================================================
       TOAST
    ============================================================ */

    const notify = useCallback((type, message) => {
        setToast({ type, message });

        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }

        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimer.current) {
                clearTimeout(toastTimer.current);
            }
        };
    }, []);

    /* ============================================================
       LOAD SETTINGS
    ============================================================ */

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);

                const response = await api.get("/api/admin/settings");

                setSettings(response?.data?.data || {});

                setSettingsVersion((value) => value + 1);
            } catch (error) {
                console.error("[Settings] Load error:", error);

                notify("error", error.message || "Gagal memuat pengaturan");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [notify]);

    /* ============================================================
       SAVE SETTINGS
    ============================================================ */

    const handleSave = async (values) => {
        try {
            setSaving(true);

            const response = await api.put("/api/admin/settings", values);

            setSettings(
                response?.data?.data || {
                    ...settings,
                    ...values,
                },
            );

            setSettingsVersion((value) => value + 1);

            // Header/footer/halaman publik memakai cache pengaturan toko —
            // buang cache-nya agar perubahan langsung terlihat tanpa reload.
            invalidateStoreSettings();

            notify("success", "Pengaturan berhasil disimpan");
        } catch (error) {
            console.error("[Settings] Save error:", error);

            notify("error", error.message || "Gagal menyimpan pengaturan");
        } finally {
            setSaving(false);
        }
    };

    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <AdminLayout title="Pengaturan" activeMenu="settings">
            <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-5 lg:p-6">
                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                        </div>

                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            Pengaturan
                        </h1>
                    </div>

                    <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
                        Kelola akun admin, identitas toko, stok, pengiriman, dan pembayaran.
                    </p>
                </div>

                <SettingsTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="max-w-4xl">
                    {activeTab === "profile" && <ProfileSettingsForm onNotify={notify} />}

                    {activeTab === "store" && (
                        <StoreSettingsForm
                            key={settingsVersion}
                            settings={settings}
                            onSave={handleSave}
                            saving={saving || loading}
                        />
                    )}

                    {activeTab === "stock" && (
                        <StockSettingsForm
                            key={settingsVersion}
                            settings={settings}
                            onSave={handleSave}
                            onNotify={notify}
                            saving={saving || loading}
                        />
                    )}

                    {activeTab === "shipping" && (
                        <div className="space-y-5">
                            <RajaOngkirSettingsForm
                                key={settingsVersion}
                                settings={settings}
                                onSave={handleSave}
                                onNotify={notify}
                                saving={saving || loading}
                            />

                            <OngkirSettings onNotify={notify} />
                        </div>
                    )}

                    {activeTab === "chatbot" && (
                        <ChatbotSettingsForm
                            key={settingsVersion}
                            settings={settings}
                            onSave={handleSave}
                            saving={saving || loading}
                        />
                    )}

                    {activeTab === "payment" && (
                        <PaymentSettingsForm
                            key={settingsVersion}
                            settings={settings}
                            onSave={handleSave}
                            saving={saving || loading}
                        />
                    )}
                </div>
            </main>

            {/* =====================================================
                TOAST
            ====================================================== */}

            {toast && (
                <div className="fixed left-1/2 bottom-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm px-4 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl flex items-center gap-2.5">
                    {toast.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}

                    <p className="text-xs font-medium">{toast.message}</p>
                </div>
            )}
        </AdminLayout>
    );
}
