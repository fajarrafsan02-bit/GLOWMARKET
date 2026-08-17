import { CreditCard, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format.js";
import { buildOrderChatState } from "../../utils/orderChat.js";
import PilihanKurir from "../ongkir/PilihanKurir.jsx";

export default function OrderSummaryCard({
    totalPrice,
    ongkirCost,
    ongkirEstimasiLoading,
    ongkirEstimasi,
    hariEstimasi,
    pilihanKurir,
    ubahKurir,
    onToggleUbahKurir,
    onKurirChange,
    selectedAddressObj,
    voucherInfo,
    diskonVoucher,
    removeVoucher,
    voucherKode,
    setVoucherKode,
    applyVoucher,
    voucherLoading,
    vouchersSaya,
    totalQuantity,
    grandTotal,
    processing,
    paymentMethod,
    onCheckout,
}) {
    const canCheckout = processing || !selectedAddressObj || !paymentMethod;

    return (
        <>
            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-[13px] sm:text-base font-semibold text-gray-900 dark:text-white">
                        Ringkasan Pembayaran
                    </h2>
                </div>

                <div className="p-4 sm:p-5">
                    <div className="space-y-3">
                        <div className="flex justify-between gap-4 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>

                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>

                        {pilihanKurir && !ubahKurir ? (
                            <div className="mt-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-3">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        Kurir Terpilih
                                    </span>

                                    <button
                                        type="button"
                                        onClick={onToggleUbahKurir}
                                        className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                                    >
                                        Ubah Kurir
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs pt-1">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {pilihanKurir.kurirName || pilihanKurir.kurirCode}{" "}
                                            {pilihanKurir.layanan}
                                        </p>

                                        {hariEstimasi && (
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                                Estimasi {hariEstimasi} hari
                                            </p>
                                        )}
                                    </div>

                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {ongkirCost === 0 ? "Gratis" : formatPrice(ongkirCost)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3">
                                <PilihanKurir
                                    opsi={ongkirEstimasi?.opsi}
                                    value={pilihanKurir}
                                    onChange={(val) => onKurirChange(val)}
                                    name="pilihan-kurir-checkout"
                                    gratis={ongkirEstimasi?.sumber === "GRATIS_MINIMAL_BELANJA"}
                                />

                                {pilihanKurir && ubahKurir && (
                                    <button
                                        type="button"
                                        onClick={onToggleUbahKurir}
                                        className="mt-2 text-[10px] font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        ✕ Selesai Ubah
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between gap-4 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Pengiriman</span>

                            <span
                                className={`font-medium ${ongkirCost > 0 ? "text-gray-900 dark:text-white" : "text-emerald-600 dark:text-emerald-400"}`}
                            >
                                {ongkirEstimasiLoading
                                    ? "Menghitung..."
                                    : ongkirCost > 0
                                        ? formatPrice(ongkirCost)
                                        : "Gratis"}
                            </span>
                        </div>

                        {selectedAddressObj && !ongkirEstimasiLoading && (
                            <p className="text-[11px] text-gray-400">
                                {ongkirEstimasi
                                    ? `Tujuan ${selectedAddressObj.provinsi}${hariEstimasi ? ` • estimasi ${hariEstimasi} hari` : ""}`
                                    : `Tarif untuk ${selectedAddressObj.provinsi || "provinsi ini"} belum diatur — ongkir gratis.`}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        {voucherInfo ? (
                            <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                        Voucher {voucherInfo.kode} dipakai
                                    </p>

                                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60">
                                        Diskon {formatPrice(diskonVoucher)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={removeVoucher}
                                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
                                >
                                    Hapus
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={voucherKode}
                                    onChange={(e) => setVoucherKode(e.target.value)}
                                    placeholder="Kode voucher (opsional)"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            applyVoucher();
                                        }
                                    }}
                                    className="flex-1 min-w-0 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all uppercase"
                                />

                                <button
                                    type="button"
                                    onClick={applyVoucher}
                                    disabled={voucherLoading}
                                    className="h-9 px-3.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 shrink-0"
                                >
                                    {voucherLoading ? "..." : "Pakai"}
                                </button>
                            </div>
                        )}

                        {vouchersSaya.length > 0 && (
                            <div className="mt-2.5">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                                    Voucher dari poin Anda
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                    {vouchersSaya.map((v) => (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                setVoucherKode(v.kode);
                                                applyVoucher(v.kode);
                                            }}
                                            disabled={voucherLoading}
                                            className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition disabled:opacity-50"
                                        >
                                            {formatPrice(v.nilai)} • {v.kode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="my-5 h-px bg-gray-200 dark:bg-gray-800" />

                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                Total
                            </p>

                            <p className="mt-0.5 text-[11px] text-gray-400">{totalQuantity} item</p>
                        </div>

                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(grandTotal)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCheckout}
                        disabled={canCheckout}
                        className="w-full h-11 mt-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4" />
                                Bayar Sekarang
                            </>
                        )}
                    </button>

                    {!paymentMethod && selectedAddressObj && !processing && (
                        <p className="mt-2 text-center text-[11px] text-amber-600 dark:text-amber-400">
                            Pilih metode pembayaran terlebih dahulu.
                        </p>
                    )}

                    <div className="mt-4 flex flex-col items-center gap-2">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Pembayaran diproses secara aman
                        </div>

                        <Link
                            to="/chat"
                            state={buildOrderChatState({ source: "checkout" })}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Butuh bantuan?
                        </Link>
                    </div>
                </div>
            </section>

            <div className="mt-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-gray-400" />

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Pengiriman aman ke alamat yang Anda pilih
                    </span>
                </div>
            </div>
        </>
    );
}
