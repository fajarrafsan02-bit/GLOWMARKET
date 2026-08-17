import { ShieldCheck } from "lucide-react";

export default function ProductModalAuthenticity() {
    return (
        <div className="mt-3 p-2.5 sm:p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-lg">
            <div className="flex gap-2.5 items-start">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />

                <div>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-gray-100">
                        Authenticity Guarantee
                    </p>

                    <p className="mt-0.5 text-[10px] sm:text-[11px] leading-4 sm:leading-5 text-gray-500 dark:text-gray-400">
                        Produk disertai dokumentasi keaslian resmi dan garansi.
                    </p>
                </div>
            </div>
        </div>
    );
}
