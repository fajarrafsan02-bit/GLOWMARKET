import { ShieldCheck, Award } from "lucide-react";

export default function ProductDetailTrust() {
    return (
        <div className="mt-6 border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20">
            <div className="p-5">
                <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Authenticity Guarantee
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            Produk disertai dokumentasi keaslian sesuai jenis produk dan ketentuan
                            yang berlaku.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 border-t border-amber-200 dark:border-amber-900/60">
                <div className="p-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Quality Assured
                </div>

                <div className="p-3 flex items-center justify-center gap-2 border-l border-amber-200 dark:border-amber-900/60 text-[10px] uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Trusted Seller
                </div>
            </div>
        </div>
    );
}
