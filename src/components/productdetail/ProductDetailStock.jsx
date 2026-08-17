import { CheckCircle2 } from "lucide-react";

export default function ProductDetailStock({ displayStock }) {
    return (
        <div className="mt-5 flex items-center gap-2">
            <CheckCircle2
                className={` w-4 h-4 ${displayStock > 0 ? "text-emerald-500" : "text-gray-400"} `}
            />

            <span
                className={` text-xs font-medium ${displayStock > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500"} `}
            >
                {displayStock > 0
                    ? `In stock · ${displayStock} available`
                    : "Out of stock"}
            </span>
        </div>
    );
}
