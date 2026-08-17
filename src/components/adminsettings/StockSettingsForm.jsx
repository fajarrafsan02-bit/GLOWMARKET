import { useState } from "react";
import { PackageSearch } from "lucide-react";

import SettingsCard from "./SettingsCard.jsx";
import SettingsField from "./SettingsField.jsx";

/**
 * Ambang stok rendah — dipakai backend untuk memicu
 * notifikasi stok menipis pada produk.
 */
export default function StockSettingsForm({ settings, onSave, onNotify, saving }) {
    const [threshold, setThreshold] = useState(() => settings?.["lowStock.threshold"] ?? "5");

    const handleSubmit = () => {
        const value = Number(threshold);

        if (!Number.isInteger(value) || value < 1) {
            onNotify?.("error", "Ambang stok harus berupa angka minimal 1");
            return;
        }

        onSave({
            "lowStock.threshold": String(value),
        });
    };

    return (
        <SettingsCard
            icon={PackageSearch}
            title="Notifikasi Stok"
            description="Batas stok yang dianggap menipis."
            onSubmit={handleSubmit}
            saving={saving}
            footer="Notifikasi dikirim saat stok produk berada di bawah nilai ini."
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <SettingsField
                    label="Ambang Stok Rendah"
                    type="number"
                    min={1}
                    value={threshold}
                    onChange={setThreshold}
                    placeholder="5"
                    hint="Contoh: 5 berarti stok 4 ke bawah dianggap menipis."
                />
            </div>
        </SettingsCard>
    );
}
