import { Building2, CreditCard, QrCode, Store, Wallet } from "lucide-react";

import { filterPaymentMethodGroups } from "../../utils/paymentMethods.js";

const GROUP_ICON = {
    "Transfer Bank (Virtual Account)": Building2,
    "E-Wallet & QRIS": Wallet,
    "Gerai Retail": Store,
    Kartu: CreditCard,
};

const ITEM_ICON_OVERRIDE = {
    QRIS: QrCode,
};

export default function PaymentMethodPicker({ activeCodes, value, onChange, loading }) {
    const groups = filterPaymentMethodGroups(activeCodes);

    if (loading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-11 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <p className="text-xs text-gray-400">
                Belum ada metode pembayaran yang tersedia. Hubungi admin toko.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {groups.map((group) => {
                const GroupIcon = GROUP_ICON[group.group] || CreditCard;

                return (
                    <div key={group.group}>
                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            <GroupIcon className="w-3.5 h-3.5" />
                            {group.group}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {group.items.map((item) => {
                                const selected = value === item.code;
                                const Icon = ITEM_ICON_OVERRIDE[item.code] || null;

                                return (
                                    <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => onChange(item.code)}
                                        className={`h-11 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                                            selected
                                                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                                                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-300 hover:bg-amber-50/40 dark:hover:bg-amber-900/10"
                                        }`}
                                    >
                                        {Icon && <Icon className="w-3.5 h-3.5" />}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
