import { motion as Motion } from "framer-motion";

import { Check, Home, Pencil, Phone, Trash2, User } from "lucide-react";

export default function AddressCard({
    address,
    isPrimary,
    onSetPrimary,
    onEdit,
    onDelete,
}) {
    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-2xl border p-3 sm:p-5 transition ${isPrimary ? "border-amber-400 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-900/10" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}
        >
            {/* Primary Badge */}
            {isPrimary && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] sm:text-[11px] font-bold">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Utama
                    </span>
                </div>
            )}

            {/* Recipient */}
            <div className="flex items-start gap-2.5 sm:gap-3 pr-16 sm:pr-24">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        {address.namaLengkap || address.name || address.receiverName || "Penerima"}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {address.noHp || address.phone || address.receiverPhone || "-"}
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="mt-3 sm:mt-4 flex items-start gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                </div>

                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{address.alamat || address.address || address.addrLine || "-"}</p>

                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {[
                            address.kelurahan || address.village,
                            address.kecamatan || address.district,
                            address.kota || address.city,
                            address.provinsi || address.province,
                            address.kodePos || address.postalCode,
                        ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-5 pt-2.5 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                {!isPrimary && (
                    <button
                        type="button"
                        onClick={onSetPrimary}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-[11px] sm:text-xs font-semibold transition"
                    >
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Jadikan Utama
                    </button>
                )}

                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-[11px] sm:text-xs font-semibold transition"
                >
                    <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Edit
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] sm:text-xs font-semibold transition"
                >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Hapus
                </button>
            </div>
        </Motion.div>
    );
}
