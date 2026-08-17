import { CreditCard, Lock, ShieldCheck } from "lucide-react";

const trustItems = [
    { icon: Lock, label: "Pembayaran Aman" },
    { icon: CreditCard, label: "Pembayaran Online" },
    { icon: ShieldCheck, label: "Belanja Aman" },
];

export default function TrustBar({ store }) {
    return (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                    {/* Copyright */}
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()}{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {store.name}
                        </span>
                        . Hak cipta dilindungi.
                    </p>

                    {/* Trust */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {trustItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[9px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400"
                                >
                                    {Icon && <Icon className="w-3 h-3" />}
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
