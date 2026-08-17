import { statusMenurutStok } from "../../utils/productStatus.js";

export default function ProductStatusBadge({ status, stock }) {
    /* Stok jadi acuan supaya baris lama yang terlanjur tersimpan sebagai
       TERSEDIA dengan stok 0 tetap tampil apa adanya bagi admin. */
    const normalizedStatus =
        stock === undefined
            ? String(status || "").toUpperCase()
            : statusMenurutStok(stock, String(status || "").toUpperCase());

    const config =
        normalizedStatus === "TERSEDIA"
            ? {
                  label: "Tersedia",
                  dot: "bg-emerald-500",
                  wrapper: "bg-emerald-50 dark:bg-emerald-900/20",
                  text: "text-emerald-700 dark:text-emerald-400",
              }
            : normalizedStatus === "TIDAK_TERSEDIA"
              ? {
                    label: "Tidak tersedia",
                    dot: "bg-amber-500",
                    wrapper: "bg-amber-50 dark:bg-amber-900/20",
                    text: "text-amber-700 dark:text-amber-400",
                }
              : {
                    label: "Habis",
                    dot: "bg-red-500",
                    wrapper: "bg-red-50 dark:bg-red-900/20",
                    text: "text-red-700 dark:text-red-400",
                };

    return (
        <span
            className={` inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${config.wrapper} ${config.text} `}
        >
            <span className={` w-1.5 h-1.5 rounded-full shrink-0 ${config.dot} `} />

            {config.label}
        </span>
    );
}
