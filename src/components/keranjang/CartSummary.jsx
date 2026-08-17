import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Truck, ArrowRight } from "lucide-react";

import { formatPrice } from "../../utils/format.js";
import PilihanKurir from "../ongkir/PilihanKurir.jsx";

export default function CartSummary({
    addresses,
    selectedAddressId,
    onSelectAddress,
    ongkirLoading,
    ongkirEstimasi,
    pilihanKurir,
    onPilihanKurir,
    subtotal,
    ongkirPreview,
    onCheckout,
}) {
    const tidakAdaOpsi =
        !Array.isArray(ongkirEstimasi?.opsi) || ongkirEstimasi.opsi.length === 0;

    return (
        <aside className="lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        Ringkasan Pesanan
                    </h2>
                </div>

                <div className="p-4 sm:p-5">
                    {/* Estimasi Ongkir */}
                    <div className="mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-100 dark:border-gray-800">
                        <p className="mb-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            Estimasi Ongkir
                        </p>

                        {addresses.length === 0 ? (
                            <Link
                                to="/profile"
                                className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 hover:underline"
                            >
                                Tambahkan alamat untuk melihat estimasi ongkir →
                            </Link>
                        ) : (
                            <>
                                <select
                                    value={selectedAddressId || ""}
                                    onChange={(e) => onSelectAddress(Number(e.target.value))}
                                    className="w-full h-9 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300"
                                >
                                    {addresses.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.namaLengkap} — {a.kota || a.provinsi}
                                        </option>
                                    ))}
                                </select>

                                {ongkirLoading ? (
                                    <p className="mt-2 text-[11px] sm:text-xs text-gray-400">Menghitung...</p>
                                ) : (
                                    <>
                                        <PilihanKurir
                                            opsi={ongkirEstimasi?.opsi}
                                            value={pilihanKurir}
                                            onChange={onPilihanKurir}
                                            name="pilihan-kurir-keranjang"
                                            gratis={
                                                ongkirEstimasi?.sumber ===
                                                "GRATIS_MINIMAL_BELANJA"
                                            }
                                        />

                                        {tidakAdaOpsi && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center justify-between text-[11px] sm:text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Perkiraan biaya
                                                    </span>

                                                    {ongkirEstimasi ? (
                                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                            {ongkirPreview > 0
                                                                ? formatPrice(ongkirPreview)
                                                                : "Gratis"}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] sm:text-xs text-gray-400">
                                                            —
                                                        </span>
                                                    )}
                                                </div>

                                                {ongkirEstimasi?.sumber ===
                                                    "GRATIS_MINIMAL_BELANJA" && (
                                                    <p className="text-[10px] sm:text-[11px] text-gray-400">
                                                        Ongkir gratis karena belanja mencapai
                                                        minimal.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>

                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Pengiriman</span>

                            <span
                                className={`font-medium ${ongkirPreview > 0 ? "text-gray-900 dark:text-white" : "text-emerald-600 dark:text-emerald-400"}`}
                            >
                                {ongkirEstimasi
                                    ? ongkirPreview > 0
                                        ? formatPrice(ongkirPreview)
                                        : "Gratis"
                                    : "Pilih alamat"}
                            </span>
                        </div>
                    </div>

                    <div className="my-4 sm:my-5 h-px bg-gray-200 dark:bg-gray-800" />

                    <div className="flex justify-between items-end gap-3 sm:gap-4">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                Total
                            </p>

                            <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5">
                                Dipastikan saat Checkout
                            </p>
                        </div>

                        <p className="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(subtotal + ongkirPreview)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCheckout}
                        className="w-full h-10 sm:h-11 mt-5 sm:mt-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2"
                    >
                        Checkout
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Trust */}
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />

                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                Pembayaran aman
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Truck className="w-4 h-4 text-gray-400" />

                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                Pengiriman aman
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
