import { Save } from "lucide-react";

/**
 * Kartu pembungkus untuk tiap section pengaturan.
 * Menyediakan judul, deskripsi, isi form, dan tombol simpan.
 */
export default function SettingsCard({
    icon: Icon,
    title,
    description,
    children,
    onSubmit,
    saving = false,
    submitLabel = "Simpan Perubahan",
    footer,
}) {
    const handleSubmit = (event) => {
        event.preventDefault();

        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
        >
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 sm:gap-2.5">
                {Icon && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                )}

                <div className="min-w-0">
                    <h2 className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>

                    {description && (
                        <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">{description}</p>
                    )}
                </div>
            </div>

            <div className="p-3 sm:p-5">{children}</div>

            {onSubmit && (
                <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
                    <div className="text-[10px] text-gray-400 text-center sm:text-left w-full sm:w-auto">{footer}</div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto justify-center h-8 sm:h-9 px-3 sm:px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 transition disabled:opacity-60 shrink-0"
                    >
                        {saving ? (
                            <>
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                {submitLabel}
                            </>
                        )}
                    </button>
                </div>
            )}
        </form>
    );
}
