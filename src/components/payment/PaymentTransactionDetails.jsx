export default function PaymentTransactionDetails({ paymentData, statusInfo, formatPrice }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {/* Transaction ID */}
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800">
                <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    ID Transaksi
                </p>

                <p className="mt-1.5 text-sm font-medium font-mono text-gray-900 dark:text-white break-all">
                    {paymentData?.externalId}
                </p>
            </div>

            {/* Amount */}
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800">
                <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">
                    Total Pembayaran
                </p>

                <p className="mt-1.5 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(paymentData?.amount)}
                </p>

                {Number(paymentData?.ongkir) > 0 && (
                    <p className="mt-1 text-[10px] text-gray-400">
                        Termasuk ongkir {formatPrice(paymentData.ongkir)}
                    </p>
                )}
            </div>

            {/* Status */}
            <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400">Status</p>

                <span
                    className={`inline-flex items-center mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusInfo.bg} ${statusInfo.color}`}
                >
                    {statusInfo.label}
                </span>
            </div>
        </div>
    );
}
