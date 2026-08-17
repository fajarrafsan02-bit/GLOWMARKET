import { useState } from "react";
import { Navigation, Search } from "lucide-react";

import SettingsCard from "./SettingsCard.jsx";
import SettingsField from "./SettingsField.jsx";
import api from "../../api/Axios.jsx";

/**
 * Pengaturan RajaOngkir: lokasi asal toko (dicari & dipilih, bukan diketik
 * bebas, supaya tidak salah cocok), daftar kurir, dan ambang gratis ongkir.
 * Kunci API RajaOngkir sengaja tidak ada di sini — itu environment variable
 * di server (RAJAONGKIR_API_KEY), bukan pengaturan yang bisa diubah lewat form.
 */
export default function RajaOngkirSettingsForm({ settings, onSave, onNotify, saving }) {
    const [kataKunci, setKataKunci] = useState("");
    const [mencari, setMencari] = useState(false);
    const [hasilPencarian, setHasilPencarian] = useState([]);

    const [originId, setOriginId] = useState(
        () => settings?.["shipping.origin-rajaongkir-id"] ?? "",
    );
    const [originLabel, setOriginLabel] = useState(() => settings?.["shipping.origin-label"] ?? "");

    // Sengaja tidak diisi tebakan default — kurir yang benar-benar didukung
    // baru bisa dipastikan lewat dashboard RajaOngkir setelah admin punya akun.
    const [kurir, setKurir] = useState(() => settings?.["shipping.rajaongkir-kurir"] ?? "");

    const [minimalBelanja, setMinimalBelanja] = useState(
        () => settings?.["shipping.gratis-ongkir-minimal"] ?? "",
    );

    const cariLokasi = async () => {
        if (!kataKunci.trim()) return;

        try {
            setMencari(true);
            const res = await api.get("/api/admin/ongkir/cari-lokasi", {
                params: { q: kataKunci.trim() },
            });

            setHasilPencarian(res.data?.data || []);

            if (res.data?.success === false) {
                onNotify?.("error", res.data?.message || "Pencarian gagal");
            } else if ((res.data?.data || []).length === 0) {
                onNotify?.("error", "Tidak ada lokasi yang cocok");
            }
        } catch (error) {
            console.error("[Settings] Cari lokasi RajaOngkir error:", error);
            onNotify?.("error", error.message || "Gagal mencari lokasi");
        } finally {
            setMencari(false);
        }
    };

    /*
     * Bentuk field hasil pencarian belum terverifikasi penuh dari dokumentasi
     * publik RajaOngkir — dicoba beberapa nama field yang umum dipakai API
     * sejenis, dengan JSON mentah sebagai cadangan terakhir supaya admin
     * tetap bisa melihat sesuatu yang bisa dipilih walau nama field-nya
     * ternyata berbeda dari dugaan.
     */
    const labelDariHasil = (item) =>
        item.label ||
        [item.subdistrict_name, item.district_name, item.city_name, item.province_name]
            .filter(Boolean)
            .join(", ") ||
        JSON.stringify(item);

    const idDariHasil = (item) =>
        item.id ?? item.destination_id ?? item.subdistrict_id ?? item.location_id ?? item.ID;

    const pilihLokasi = (item) => {
        const id = idDariHasil(item);
        if (id == null || String(id).trim() === "") {
            onNotify?.("error", "Lokasi ini tidak punya ID yang bisa dipakai");
            return;
        }
        setOriginId(String(id));
        setOriginLabel(labelDariHasil(item));
        setHasilPencarian([]);
        setKataKunci("");
        onNotify?.(
            "success",
            "Lokasi asal dipilih. Klik Simpan supaya pilihan kurir muncul di Keranjang/Checkout.",
        );
    };

    const handleSubmit = () => {
        if (!originId.trim()) {
            onNotify?.(
                "error",
                "Lokasi asal toko wajib dipilih. Cari kecamatan/kota, lalu klik salah satu hasil — jangan cuma isi kode kurir.",
            );
            return;
        }

        const minimal = minimalBelanja === "" ? 0 : Number(minimalBelanja);
        if (Number.isNaN(minimal) || minimal < 0) {
            onNotify?.("error", "Minimal belanja harus berupa angka dan tidak boleh negatif");
            return;
        }

        onSave({
            "shipping.origin-rajaongkir-id": originId.trim(),
            "shipping.origin-label": originLabel,
            "shipping.rajaongkir-kurir": kurir,
            "shipping.gratis-ongkir-minimal": String(minimal),
        });
    };

    return (
        <SettingsCard
            icon={Navigation}
            title="RajaOngkir"
            description="Cek ongkir real-time. Kosong = sistem otomatis memakai tarif tetap di atas."
            onSubmit={handleSubmit}
            saving={saving}
            footer="Kunci API diatur lewat environment variable RAJAONGKIR_API_KEY di server, bukan di sini."
        >
            <div className="space-y-4">
                <div>
                    <span className="block mb-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                        Lokasi Asal Toko (wajib)
                    </span>

                    {!originId && (
                        <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                            Kode kurir saja tidak cukup. Cari lokasi toko, klik hasilnya, lalu
                            Simpan. Tanpa ini, Keranjang/Checkout tidak menampilkan pilihan
                            JNE/TIKI.
                        </p>
                    )}

                    {originLabel ? (
                        <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                            <span>{originLabel}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setOriginId("");
                                    setOriginLabel("");
                                }}
                                className="shrink-0 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline"
                            >
                                Ganti
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                value={kataKunci}
                                onChange={(e) => setKataKunci(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        cariLokasi();
                                    }
                                }}
                                placeholder="Cari kecamatan/kota toko..."
                                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-amber-400"
                            />
                            <button
                                type="button"
                                onClick={cariLokasi}
                                disabled={mencari}
                                className="h-9 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 disabled:opacity-60"
                            >
                                <Search className="w-3.5 h-3.5" />
                                {mencari ? "Mencari..." : "Cari"}
                            </button>
                        </div>
                    )}

                    {hasilPencarian.length > 0 && (
                        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800 max-h-48 overflow-y-auto">
                            {hasilPencarian.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => pilihLokasi(item)}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                                >
                                    {labelDariHasil(item)}
                                </button>
                            ))}
                        </div>
                    )}

                    <span className="block mt-1 text-[10px] text-gray-400">
                        Wajib klik salah satu hasil pencarian (bukan hanya mengetik). ID lokasi
                        itulah yang dipakai menghitung ongkir ke alamat pembeli.
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <SettingsField
                        label="Kode Kurir RajaOngkir"
                        value={kurir}
                        onChange={setKurir}
                        placeholder="mis. jne,tiki,pos"
                        hint="Dipisah koma. Cek dashboard RajaOngkir untuk daftar kurir yang benar-benar didukung akun Anda."
                    />

                    <SettingsField
                        label="Minimal Belanja Gratis Ongkir (Rp)"
                        type="number"
                        min={0}
                        value={minimalBelanja}
                        onChange={setMinimalBelanja}
                        placeholder="0 = nonaktif"
                        hint="Kosongkan atau isi 0 untuk menonaktifkan gratis ongkir."
                    />
                </div>
            </div>
        </SettingsCard>
    );
}
