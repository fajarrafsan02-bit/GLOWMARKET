export const inputClass = `
    w-full
    h-10
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

export const textareaClass = `
    w-full
    min-h-[88px]
    px-3
    py-2
    rounded-lg
    border
    border-gray-200
    dark:border-gray-700
    bg-white
    dark:bg-gray-900
    text-xs
    leading-5
    text-gray-900
    dark:text-white
    placeholder:text-gray-400
    resize-y
    focus:outline-none
    focus:border-amber-500
    focus:ring-2
    focus:ring-amber-500/10
    transition
`;

export function SectionLabel({ children }) {
    return (
        <h3 className="text-[10px] uppercase tracking-[0.12em] font-semibold text-gray-400">
            {children}
        </h3>
    );
}

export function FieldLabel({ children }) {
    return (
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
            {children}
        </label>
    );
}
