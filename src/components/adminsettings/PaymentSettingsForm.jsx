import { useState } from "react";
import { CreditCard } from "lucide-react";

import SettingsCard from "./SettingsCard.jsx";
import { PAYMENT_METHOD_GROUPS } from "../../utils/paymentMethods.js";

export default function PaymentSettingsForm({ settings, onSave, saving }) {
    const [selected, setSelected] = useState(() =>
        (settings?.["payment.methods"] ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    );

    const toggle = (code) => {
        setSelected((prev) =>
            prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code],
        );
    };

    return (
        <SettingsCard
            icon={CreditCard}
            title="Metode Pembayaran"
            description="Channel yang muncul di halaman pembayaran Xendit."
            onSubmit={() =>
                onSave({
                    "payment.methods": selected.join(","),
                })
            }
            saving={saving}
            footer="Tanpa pilihan, semua metode aktif di akun Xendit akan ditampilkan."
        >
            <div className="space-y-4">
                {PAYMENT_METHOD_GROUPS.map((group) => (
                    <div key={group.group}>
                        <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-400">
                            {group.group}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {group.items.map((item) => {
                                const checked = selected.includes(item.code);

                                return (
                                    <label
                                        key={item.code}
                                        className={` h-10 px-3 rounded-lg border cursor-pointer flex items-center gap-2 text-[11px] font-medium transition ${checked ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"} `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggle(item.code)}
                                            className="w-3.5 h-3.5 accent-amber-500"
                                        />

                                        {item.label}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-[10px] leading-4 text-gray-400">
                Pastikan metode yang dipilih sudah diaktifkan pada dashboard Xendit — metode yang
                belum aktif akan membuat pembuatan invoice gagal.
            </p>
        </SettingsCard>
    );
}
