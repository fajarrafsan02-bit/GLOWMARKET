import { formatPrice } from "../../../utils/format.js";

export default function ResultRow({ label, value, accent = "amber" }) {
    const styles = {
        blue: {
            wrapper: "bg-blue-50/70 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30",
            text: "text-blue-700 dark:text-blue-400",
        },
        amber: {
            wrapper:
                "bg-amber-50/70 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30",
            text: "text-amber-700 dark:text-amber-400",
        },
    };

    const style = styles[accent] || styles.amber;

    return (
        <div
            className={` mx-2 sm:mx-3 my-2 sm:my-3 px-2.5 sm:px-3.5 py-2.5 sm:py-3 rounded-lg border flex items-center justify-between gap-2 sm:gap-4 ${style.wrapper} `}
        >
            <span className={` text-[10px] sm:text-[11px] font-bold ${style.text} `}>{label}</span>

            <span className={` text-sm font-bold tabular-nums whitespace-nowrap ${style.text} `}>
                {formatPrice(value)}
            </span>
        </div>
    );
}
