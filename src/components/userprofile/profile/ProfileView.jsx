import { Mail, MapPin, Pencil, Phone, ShieldCheck, User } from "lucide-react";

import ProfileRow from "./ProfileRow.jsx";
import PrimaryAddressSelector from "./PrimaryAddressSelector.jsx";

export default function ProfileView({
    userName,
    userEmail,
    userPhone,
    addresses,
    selectedDefaultId,
    onSetPrimaryAddress,
    getDisplayAddress,
}) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        Informasi Profil
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kelola informasi dasar akun Anda.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        // Parent sudah menangani state editing.
                        // Tombol ini sengaja dibiarkan sebagai action visual
                        // dan dapat dihubungkan melalui parent bila diperlukan.
                    }}
                    className="hidden sm:inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit tersedia dari menu akun
                </button>
            </div>

            {/* Profile Information */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <ProfileRow
                    icon={User}
                    label="Nama Lengkap"
                    value={userName || "Belum diisi"}
                />

                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                <ProfileRow
                    icon={Mail}
                    label="Email"
                    badge={
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 dark:text-gray-400">
                            <ShieldCheck className="w-3 h-3" />
                            Tidak dapat diubah
                        </span>
                    }
                    value={userEmail || "-"}
                    valueClassName="break-all"
                />

                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                <ProfileRow
                    icon={Phone}
                    label="Nomor Telepon"
                    value={userPhone || "Belum diisi"}
                />

                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                <ProfileRow
                    icon={MapPin}
                    label="Alamat Utama"
                    badge={
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
                            Pengiriman
                        </span>
                    }
                    value={getDisplayAddress?.() || "Belum ada alamat utama"}
                    valueClassName="text-gray-700 dark:text-gray-300 leading-6"
                />
            </div>

            {/* Primary address selector */}
            {Array.isArray(addresses) && addresses.length > 1 && (
                <PrimaryAddressSelector
                    addresses={addresses}
                    selectedDefaultId={selectedDefaultId}
                    onSetPrimaryAddress={onSetPrimaryAddress}
                />
            )}
        </>
    );
}
