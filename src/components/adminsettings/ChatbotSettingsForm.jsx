import { useState } from "react";
import { Bot } from "lucide-react";

import SettingsCard from "./SettingsCard.jsx";
import SettingsField from "./SettingsField.jsx";

/**
 * Balasan otomatis chat saat admin sedang offline.
 *
 * Komponen di-mount ulang lewat `key` saat pengaturan dimuat/disimpan,
 * jadi state awal cukup dibaca sekali.
 */
export default function ChatbotSettingsForm({ settings, onSave, saving }) {
    const [aktif, setAktif] = useState(() => settings?.["chatbot.enabled"] === "true");

    const [pesanFallback, setPesanFallback] = useState(
        () => settings?.["chatbot.pesan_fallback"] ?? "",
    );

    return (
        <SettingsCard
            icon={Bot}
            title="Balasan Otomatis Chat"
            description="Menjawab pelanggan ketika admin sedang tidak online."
            onSubmit={() =>
                onSave({
                    "chatbot.enabled": aktif ? "true" : "false",
                    "chatbot.pesan_fallback": pesanFallback,
                })
            }
            saving={saving}
            footer="Saat Anda online, chat berjalan normal tanpa campur tangan bot."
        >
            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer">
                <input
                    type="checkbox"
                    checked={aktif}
                    onChange={(event) => setAktif(event.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-amber-500"
                />

                <span className="min-w-0">
                    <span className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                        Aktifkan balasan otomatis
                    </span>

                    <span className="block mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                        Bot menjawab status pesanan &amp; resi, tarif ongkir, harga &amp; stok
                        produk, serta info toko — semuanya dibaca dari data Anda sendiri. Setiap
                        balasannya diberi label &quot;Balasan otomatis&quot;.
                    </span>
                </span>
            </label>

            <div className="mt-4">
                <SettingsField
                    label="Pesan bila bot tidak tahu jawabannya"
                    textarea
                    value={pesanFallback}
                    onChange={setPesanFallback}
                    placeholder="Terima kasih atas pesan Anda..."
                    hint="Dikirim maksimal sekali per 5 menit, dan Anda tetap menerima notifikasi bahwa ada pertanyaan menunggu."
                />
            </div>
        </SettingsCard>
    );
}
