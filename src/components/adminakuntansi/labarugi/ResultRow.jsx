import { formatPrice } from "../../../utils/format.js";

export default function ResultRow({ label, value, accent = "amber", large = false }) {
    const styles = {
        amber: {
            wrapper:
                "bg-amber-50/70 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30",
            label: "text-amber-800 dark:text-amber-300",
            value: "text-amber-700 dark:text-amber-400",
        },
        emerald: {
            wrapper:
                "bg-emerald-50/70 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30",
            label: "text-emerald-800 dark:text-emerald-300",
            value: "text-emerald-700 dark:text-emerald-400",
        },
    };

    const style = styles[accent] || styles.amber;

    return (
        <div
            className={` mb-3 sm:mb-4 rounded-xl border ${style.wrapper} px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4 `}
        >
            <span
                className={` font-bold ${large ? "text-xs sm:text-base" : "text-[11px] sm:text-sm"} ${style.label} `}
            >
                {label}
            </span>

            <span
                className={` font-bold tabular-nums whitespace-nowrap ${large ? "text-sm sm:text-lg" : "text-[11px] sm:text-sm"} ${style.value} `}
            >
                {formatPrice(value)}
            </span>
        </div>
    );
}
