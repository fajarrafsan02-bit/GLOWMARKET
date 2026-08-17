import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

import { STATUS_META } from "../../utils/pengembalianStatus.js";
import { formatPrice } from "../../utils/format.js";
import { buildOrderChatState } from "../../utils/orderChat.js";
import ReturnTimeline from "./ReturnTimeline.jsx";

export default function ReturnList({ returns }) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {returns.map((p) => {
                const meta = STATUS_META[p.status] || STATUS_META.DIAJUKAN;
                const Icon = meta.icon;

                return (
                    <div
                        key={p.id}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-5"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                                </div>

                                <div>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                        {p.nomorPengembalian}
                                    </p>

                                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                        Pesanan #{p.nomorPesanan} • Refund {formatPrice(p.jumlahRefund)}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${meta.cls}`}
                            >
                                {meta.label}
                            </span>
                        </div>

                        <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 italic">
                            "{p.alasan}"
                        </p>

                        {p.catatanAdmin && (
                            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-gray-400">
                                Catatan admin: {p.catatanAdmin}
                            </p>
                        )}

                        <ReturnTimeline pengembalian={p} />

                        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <Link
                                to="/chat"
                                state={buildOrderChatState({
                                    source: "pengembalian",
                                    pengembalian: p,
                                })}
                                className="inline-flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-md border border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 transition"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Hubungi Penjual
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
