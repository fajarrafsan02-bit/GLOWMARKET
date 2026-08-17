import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";

import api from "../../api/Axios.jsx";

import SettingsCard from "./SettingsCard.jsx";
import SettingsField from "./SettingsField.jsx";

/**
 * Profil admin: ubah nama & nomor HP, serta ganti password.
 * Password hanya dikirim bila diisi (backend wajib password lama).
 */
export default function ProfileSettingsForm({ onNotify }) {
    const [profile, setProfile] = useState({
        namaLengkap: "",
        email: "",
        noHp: "",
    });

    const [passwordLama, setPasswordLama] = useState("");

    const [passwordBaru, setPasswordBaru] = useState("");

    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await api.get("/api/user/profile/admin");

                const data = response?.data?.data ?? response?.data ?? {};

                setProfile({
                    namaLengkap: data.namaLengkap || "",
                    email: data.email || "",
                    noHp: data.noHp || "",
                });
            } catch (error) {
                console.error("[Settings] Profile error:", error);

                onNotify?.("error", error.message || "Gagal memuat profil admin");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [onNotify]);

    const handleSubmit = async () => {
        if (!profile.namaLengkap.trim()) {
            onNotify?.("error", "Nama lengkap harus diisi");
            return;
        }

        if (passwordBaru || konfirmasiPassword) {
            if (!passwordLama) {
                onNotify?.("error", "Password lama harus diisi");
                return;
            }

            if (passwordBaru.length < 6) {
                onNotify?.("error", "Password baru minimal 6 karakter");
                return;
            }

            if (passwordBaru !== konfirmasiPassword) {
                onNotify?.("error", "Konfirmasi password tidak sama");
                return;
            }
        }

        try {
            setSaving(true);

            const payload = {
                namaLengkap: profile.namaLengkap.trim(),
                noHp: profile.noHp.trim(),
            };

            if (passwordBaru) {
                payload.passwordLama = passwordLama;
                payload.passwordBaru = passwordBaru;
            }

            await api.put("/api/user/update-profile", payload);

            setPasswordLama("");
            setPasswordBaru("");
            setKonfirmasiPassword("");

            onNotify?.(
                "success",
                passwordBaru
                    ? "Profil & password berhasil diperbarui"
                    : "Profil berhasil diperbarui",
            );
        } catch (error) {
            console.error("[Settings] Update profile error:", error);

            onNotify?.("error", error.message || "Gagal memperbarui profil");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SettingsCard
            icon={UserCog}
            title="Profil Admin"
            description="Data akun admin yang sedang login."
            onSubmit={handleSubmit}
            saving={saving || loading}
            footer="Kosongkan bagian password bila tidak ingin menggantinya."
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <SettingsField
                    label="Nama Lengkap"
                    value={profile.namaLengkap}
                    onChange={(value) =>
                        setProfile((prev) => ({
                            ...prev,
                            namaLengkap: value,
                        }))
                    }
                    placeholder="Nama admin"
                    disabled={loading}
                />

                <SettingsField
                    label="Email"
                    value={profile.email}
                    onChange={() => {}}
                    disabled
                    hint="Email tidak dapat diubah."
                />

                <SettingsField
                    label="Nomor HP"
                    value={profile.noHp}
                    onChange={(value) =>
                        setProfile((prev) => ({
                            ...prev,
                            noHp: value,
                        }))
                    }
                    placeholder="08xxxxxxxxxx"
                    disabled={loading}
                />
            </div>

            <div className="mt-4 sm:mt-5 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                <p className="mb-2 sm:mb-3 text-[10px] sm:text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    Ganti Password
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <SettingsField
                        label="Password Lama"
                        type="password"
                        value={passwordLama}
                        onChange={setPasswordLama}
                        placeholder="••••••"
                        autoComplete="current-password"
                        disabled={loading}
                    />

                    <SettingsField
                        label="Password Baru"
                        type="password"
                        value={passwordBaru}
                        onChange={setPasswordBaru}
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password"
                        disabled={loading}
                    />

                    <SettingsField
                        label="Konfirmasi Password"
                        type="password"
                        value={konfirmasiPassword}
                        onChange={setKonfirmasiPassword}
                        placeholder="Ulangi password baru"
                        autoComplete="new-password"
                        disabled={loading}
                    />
                </div>
            </div>
        </SettingsCard>
    );
}
