import { CheckCircle } from "lucide-react";

export default function ReviewCommentBox({ value, onChange, disabled }) {
    const count = value.length;

    const ready = count >= 10;

    const handleChange = (event) => {
        if (event.target.value.length <= 500) {
            onChange(event.target.value);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Tulis ulasan
                </label>

                <span className={` text-[11px] ${ready ? "text-emerald-500" : "text-gray-400"} `}>
                    {count}/500
                </span>
            </div>

            <textarea
                value={value}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                rows={5}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all disabled:opacity-60"
            />

            <div className="flex justify-between mt-1.5">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Minimal 10 karakter</p>

                {ready && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
                        <CheckCircle className="w-3 h-3" />
                        Siap dikirim
                    </span>
                )}
            </div>
        </div>
    );
}
