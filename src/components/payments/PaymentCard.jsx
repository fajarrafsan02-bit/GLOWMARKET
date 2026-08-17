import { Download, ExternalLink, RefreshCw } from "lucide-react";
import { motion as Motion } from "framer-motion";

import { formatPrice } from "../../utils/format.js";
import { getStatusConfig, isPaidStatus, downloadInvoice } from "../../utils/paymentInvoice.js";

export default function PaymentCard({ payment, customerName, customerEmail, onSyncPayment, notify }) {
    const status = getStatusConfig(payment.status);
    const isPaid = isPaidStatus(payment.status);
    const isPending = String(payment.status || "").toUpperCase() === "PENDING";

    const invoiceId = payment.externalId || payment.invoiceId || payment.id;

    const formatDateTime = (value) =>
        value
            ? new Date(value).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
              })
            : "-";

    return (
        <Motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors hover:border-gray-300 dark:hover:border-gray-700"
        >
            {/* Header */}
            <div className="px-3 sm:px-5 py-3 sm:py-3.5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.1em] text-gray-400">Invoice</p>

                    <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-all">
                        {invoiceId || "N/A"}
                    </p>
                </div>

                <span
                    className={`self-start sm:self-auto inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium ${status.className}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />

                    {status.label}
                </span>
            </div>

            {/* Main Info */}
            <div className="px-3 sm:px-5 py-3 sm:py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400 truncate">
                            Dibuat
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            {formatDateTime(payment.createdAt)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400 truncate">
                            Dibayar
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            {formatDateTime(payment.paidAt)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400 truncate">
                            Kurir
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            {payment.ongkirKurir ? (
                                <span className="uppercase">
                                    {payment.ongkirKurir}{" "}
                                    {payment.ongkirLayanan && `- ${payment.ongkirLayanan}`}
                                </span>
                            ) : (
                                "-"
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400 truncate">
                            Total
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            {formatPrice(payment.amount)}
                        </p>
                    </div>
                </div>

                {payment.expiredAt && (
                    <p className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] text-gray-400">
                        Kedaluwarsa: {new Date(payment.expiredAt).toLocaleString("id-ID")}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gray-50/70 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-end gap-2">
                {payment.invoiceUrl && (
                    <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={
                            isPending
                                ? "h-8 sm:h-9 px-3 sm:px-4 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold transition-colors rounded-lg shadow-sm"
                                : "h-8 sm:h-9 px-3 sm:px-3.5 inline-flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 transition-colors rounded-lg"
                        }
                    >
                        <ExternalLink className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        {isPending ? "Lanjutkan Pembayaran" : "Buka Invoice"}
                    </a>
                )}

                {isPaid && (
                    <button
                        type="button"
                        onClick={() =>
                            downloadInvoice(payment, customerName, customerEmail, notify)
                        }
                        className="h-8 sm:h-9 px-3 sm:px-3.5 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold transition-colors rounded-lg"
                    >
                        <Download className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        Download PDF
                    </button>
                )}

                {(payment.externalId || payment.invoiceId) && (
                    <button
                        type="button"
                        onClick={() => onSyncPayment(payment)}
                        className="h-8 sm:h-9 px-2.5 sm:px-3 inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg"
                    >
                        <RefreshCw className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        Sinkronkan
                    </button>
                )}
            </div>
        </Motion.article>
    );
}
