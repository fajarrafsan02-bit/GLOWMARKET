import { useState } from "react";
import { Store } from "lucide-react";

import SettingsCard from "./SettingsCard.jsx";
import SettingsField from "./SettingsField.jsx";

const STORE_KEYS = [
    "store.name",
    "store.tagline",
    "store.description",
    "store.phone",
    "store.email",
    "store.whatsapp",
    "store.instagram",
    "store.address",
    "store.logo",
];

/**
 * Identitas toko yang juga dipakai di halaman publik
 * (header, footer, tentang, dan kontak).
 *
 * Komponen di-mount ulang lewat `key` saat data pengaturan
 * dimuat/diperbarui, jadi state awal cukup dibaca sekali.
 */
export default function StoreSettingsForm({ settings, onSave, saving }) {
    const [form, setForm] = useState(() => {
        const initial = {};

        STORE_KEYS.forEach((key) => {
            initial[key] = settings?.[key] ?? "";
        });

        return initial;
    });

    const setField = (key) => (value) =>
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

    return (
        <SettingsCard
            icon={Store}
            title="Informasi Toko"
            description="Dipakai di header, footer, halaman Tentang, dan Kontak."
            onSubmit={() => onSave(form)}
            saving={saving}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <SettingsField
                    label="Nama Toko"
                    value={form["store.name"]}
                    onChange={setField("store.name")}
                    placeholder="Nama toko"
                />

                <SettingsField
                    label="Tagline"
                    value={form["store.tagline"]}
                    onChange={setField("store.tagline")}
                    placeholder="Slogan singkat toko"
                />

                <SettingsField
                    label="Email"
                    type="email"
                    value={form["store.email"]}
                    onChange={setField("store.email")}
                    placeholder="email@toko.com"
                />

                <SettingsField
                    label="Nomor Telepon"
                    value={form["store.phone"]}
                    onChange={setField("store.phone")}
                    placeholder="08xxxxxxxxxx"
                />

                <SettingsField
                    label="Nomor WhatsApp"
                    value={form["store.whatsapp"]}
                    onChange={setField("store.whatsapp")}
                    placeholder="628xxxxxxxxxx"
                    hint="Format internasional tanpa tanda +, contoh 6281234567890."
                />

                <SettingsField
                    label="Instagram"
                    value={form["store.instagram"]}
                    onChange={setField("store.instagram")}
                    placeholder="username tanpa @"
                />

                <SettingsField
                    label="URL Logo"
                    value={form["store.logo"]}
                    onChange={setField("store.logo")}
                    placeholder="https://..."
                    hint="Kosongkan untuk memakai logo bawaan."
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
                <SettingsField
                    label="Alamat Toko"
                    textarea
                    value={form["store.address"]}
                    onChange={setField("store.address")}
                    placeholder="Alamat lengkap toko"
                />

                <SettingsField
                    label="Deskripsi Toko"
                    textarea
                    value={form["store.description"]}
                    onChange={setField("store.description")}
                    placeholder="Deskripsi singkat yang tampil di halaman publik"
                />
            </div>
        </SettingsCard>
    );
}
