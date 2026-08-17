import { Truck, Clock3, Check, Sparkles } from "lucide-react";
import { toMoney, formatPrice } from "../../utils/format.js";
import { opsiTermurah, isSameCourier } from "../../utils/ongkir.js";

/**
 * Radio list kurir + layanan RajaOngkir.
 */
export default function PilihanKurir({
    opsi,
    value,
    onChange,
    name = "pilihan-kurir",
    gratis = false,
}) {
    if (!Array.isArray(opsi) || opsi.length === 0) {
        return null;
    }

    const termurah = opsiTermurah(opsi);

    return (
        <fieldset className="mt-5 min-w-0">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <legend className="text-sm font-bold text-gray-900 dark:text-white">
                        Pilih Pengiriman
                    </legend>
                    <p className="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
                        Pilih kurir dan layanan yang sesuai kebutuhan Anda
                        {gratis ? " • Ongkir ditanggung toko" : ""}
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {opsi.length} pilihan
                </span>
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                {opsi.map((o) => {
                    const selected = isSameCourier(value, o);

                    const isTermurah = isSameCourier(termurah, o);

                    const id = `${name}-${o.kurirCode}-${o.layanan}`;

                    const estimasi = o.estimasiHari ? `${o.estimasiHari} hari` : null;

                    const detail = [o.deskripsi, estimasi].filter(Boolean).join(" • ");

                    return (
                        <label
                            key={id}
                            htmlFor={id}
                            className={`block cursor-pointer rounded-xl border p-3 transition-all duration-200 ${selected ? "border-amber-500 bg-amber-50 shadow-sm shadow-amber-500/10 dark:border-amber-500 dark:bg-amber-950/20" : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-700 dark:hover:bg-amber-950/10"}`}
                        >
                            <input
                                id={id}
                                type="radio"
                                name={name}
                                checked={Boolean(selected)}
                                onChange={() => onChange?.(o)}
                                className="sr-only"
                            />

                            <div className="flex min-w-0 items-center gap-2.5">
                                <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selected ? "border-amber-500 bg-amber-500" : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"}`}
                                    aria-hidden="true"
                                >
                                    {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                                </span>

                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}
                                >
                                    <Truck className="h-4 w-4" />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex min-w-0 items-center gap-1.5">
                                        <span
                                            className="min-w-0 flex-1 truncate text-xs font-bold text-gray-900 dark:text-white"
                                            title={o.kurirName || o.kurirCode}
                                        >
                                            {o.kurirName || o.kurirCode}
                                        </span>

                                        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[8px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                            {o.layanan}
                                        </span>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p
                                        className={`whitespace-nowrap text-xs font-extrabold ${selected ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}
                                    >
                                        {gratis || toMoney(o.tarif) <= 0
                                            ? "Gratis"
                                            : formatPrice(o.tarif)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 flex min-w-0 items-center gap-1.5 pl-[67px]">
                                {isTermurah && opsi.length > 1 && !gratis && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Sparkles className="h-2.5 w-2.5" />
                                        Termurah
                                    </span>
                                )}

                                {selected && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Check className="h-2.5 w-2.5" />
                                        Dipilih
                                    </span>
                                )}

                                {gratis && (
                                    <span className="inline-flex shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        Gratis
                                    </span>
                                )}
                            </div>

                            {detail && (
                                <div className="mt-1.5 flex min-w-0 items-center gap-1 pl-[67px]">
                                    {o.estimasiHari && (
                                        <Clock3 className="h-3 w-3 shrink-0 text-gray-400 dark:text-gray-500" />
                                    )}

                                    <span
                                        className="min-w-0 truncate text-[9px] leading-4 text-gray-500 dark:text-gray-400"
                                        title={detail}
                                    >
                                        {detail}
                                    </span>
                                </div>
                            )}

                            {!gratis && toMoney(o.tarif) > 0 && (
                                <div className="mt-1 pl-[67px]">
                                    <span className="text-[8px] text-gray-400">
                                        Biaya pengiriman
                                    </span>
                                </div>
                            )}
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
