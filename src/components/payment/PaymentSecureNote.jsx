import { ShieldCheck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { buildOrderChatState } from "../../utils/orderChat.js";

export default function PaymentSecureNote({ paymentData, order }) {
    const chatState = buildOrderChatState({
        source: "pembayaran",
        payment: paymentData,
        order,
    });

    return (
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Transaksi diproses secara aman
            </div>

            <Link
                to="/chat"
                state={chatState}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
            >
                <MessageCircle className="w-3.5 h-3.5" />
                Butuh bantuan?
            </Link>
        </div>
    );
}
