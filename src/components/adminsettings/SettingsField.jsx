/**
 * Input generik untuk form pengaturan.
 * Gunakan `textarea` untuk field deskripsi/alamat.
 */
export default function SettingsField({
    label,
    value,
    onChange,
    type = "text",
    textarea = false,
    placeholder = "",
    hint,
    disabled = false,
    min,
    autoComplete,
}) {
    const inputClass = `
        w-full
        rounded-lg
        border
        border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-gray-950
        px-3
        py-2
        text-[11px]
        sm:text-xs
        text-gray-900
        dark:text-white
        placeholder:text-gray-400
        outline-none
        focus:border-amber-400
        focus:ring-2
        focus:ring-amber-100
        dark:focus:ring-amber-900/30
        disabled:opacity-60
        transition
    `;

    return (
        <label className="block">
            <span className="block mb-1 sm:mb-1.5 text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-gray-300">
                {label}
            </span>

            {textarea ? (
                <textarea
                    rows={3}
                    value={value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${inputClass} resize-y`}
                />
            ) : (
                <input
                    type={type}
                    value={value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    autoComplete={autoComplete}
                    className={inputClass}
                />
            )}

            {hint && <span className="block mt-1 text-[10px] text-gray-400">{hint}</span>}
        </label>
    );
}
