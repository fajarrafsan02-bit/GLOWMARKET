import { ShieldCheck } from "lucide-react";

import PaymentMethodPicker from "./PaymentMethodPicker.jsx";

export default function PaymentMethodCard({
    paymentMethods,
    paymentMethodsLoading,
    paymentMethod,
    onSelectPaymentMethod,
}) {
    return (
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-start gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                        Metode Pembayaran
                    </h3>

                    <p className="mt-0.5 text-[10px] sm:text-xs leading-4 sm:leading-5 text-gray-500 dark:text-gray-400">
                        Pilih metode pembayaran, lalu tekan "Bayar Sekarang".
                    </p>
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <PaymentMethodPicker
                    activeCodes={paymentMethods}
                    value={paymentMethod}
                    onChange={onSelectPaymentMethod}
                    loading={paymentMethodsLoading}
                />
            </div>
        </section>
    );
}
