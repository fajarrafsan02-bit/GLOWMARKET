import { formatPrice } from "../../utils/format.js";

function StatBox({ label, children, accent = false }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-xs text-gray-400">{label}</p>

            <p
                className={`mt-1 ${
                    accent
                        ? "text-lg md:text-xl font-semibold text-amber-600 dark:text-amber-400"
                        : "text-2xl font-semibold text-gray-900 dark:text-white"
                }`}
            >
                {children}
            </p>
        </div>
    );
}

export default function OrderStats({ totalOrders, totalShown, totalValue }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <StatBox label="Total Pesanan">{totalOrders}</StatBox>

            <StatBox label="Pesanan Ditampilkan">{totalShown}</StatBox>

            <StatBox label="Nilai Pesanan" accent>
                {formatPrice(totalValue)}
            </StatBox>
        </div>
    );
}
