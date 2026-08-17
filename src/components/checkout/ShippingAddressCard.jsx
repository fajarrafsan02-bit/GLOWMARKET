import { MapPin, ChevronRight, Check, Pencil } from "lucide-react";

export default function ShippingAddressCard({ addresses, selectedAddress, onSelect, onManage }) {
    return (
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            Alamat Pengiriman
                        </h2>

                        <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400 truncate">
                            Pilih alamat tujuan pesanan
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onManage}
                    className="shrink-0 inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition"
                >
                    Kelola
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="p-4 sm:p-5">
                {addresses.length === 0 ? (
                    <div className="py-6 sm:py-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-300 dark:text-gray-600" />

                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            Belum ada alamat
                        </p>

                        <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 px-4">
                            Tambahkan alamat terlebih dahulu sebelum checkout.
                        </p>

                        <button
                            type="button"
                            onClick={onManage}
                            className="mt-4 h-8 sm:h-9 px-3 sm:px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold transition"
                        >
                            Tambah Alamat
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {addresses.map((address) => {
                            const active = String(selectedAddress) === String(address.id);

                            return (
                                <label
                                    key={address.id}
                                    className={`relative block p-3 sm:p-4 rounded-lg border cursor-pointer transition ${active ? "border-amber-400 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-900/10" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
                                >
                                    <input
                                        type="radio"
                                        name="shippingAddress"
                                        value={address.id}
                                        checked={active}
                                        onChange={() => onSelect(address.id)}
                                        className="absolute opacity-0 pointer-events-none"
                                    />

                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${active ? "border-amber-500" : "border-gray-300 dark:border-gray-600"}`}
                                        >
                                            {active && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {address.namaLengkap}
                                                </p>

                                                {address.isDefault && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium">
                                                        <Check className="w-3 h-3" />
                                                        Utama
                                                    </span>
                                                )}

                                                {active && (
                                                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                                        Dipilih
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {address.nomorTelepon}
                                            </p>

                                            <p className="mt-1.5 text-xs leading-5 text-gray-600 dark:text-gray-300">
                                                {address.alamatLengkap}
                                            </p>
                                        </div>

                                        <Pencil className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
