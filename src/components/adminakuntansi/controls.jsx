export function Field({ label, children }) {
    return (
        <div>
            <label className="block mb-1.5 text-[10px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
                {label}
            </label>

            {children}
        </div>
    );
}

export const inputClass = `
    w-full
    h-9
    px-3
    rounded-lg
    border
    border-gray-200
    dark:border-gray-700
    bg-white
    dark:bg-gray-900
    text-xs
    text-gray-900
    dark:text-white
    placeholder:text-gray-400
    focus:outline-none
    focus:border-amber-500
    focus:ring-2
    focus:ring-amber-500/10
    transition
`;
