export function CategoryPicker({ categories, selected, onSelect, variant = "pill" }) {
    const isPill = variant === "pill";

    const baseClass = isPill
        ? "h-8 px-3 rounded-md text-xs font-medium border transition"
        : "h-9 px-3.5 rounded-lg border text-xs font-medium";

    const buttonClass = (category) => {
        const isAll = category === "Semua";
        const active = selected === category;

        if (active && isAll) {
            return isPill
                ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white"
                : "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900";
        }

        if (active) {
            return "bg-amber-500 text-white border-amber-500";
        }

        return isPill
            ? "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:text-amber-600"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    };

    return (
        <>
            {["Semua", ...categories].map((category) => (
                <button
                    key={category}
                    type="button"
                    onClick={() => onSelect(category)}
                    className={` ${baseClass} ${buttonClass(category)} `}
                >
                    {category}
                </button>
            ))}
        </>
    );
}

export function KaratPicker({ karatOptions, selected, onSelect, variant = "pill" }) {
    const isPill = variant === "pill";

    const baseClass = isPill
        ? "h-8 px-3 rounded-md text-xs font-medium border transition"
        : "h-9 rounded-lg border text-xs font-medium";

    const buttonClass = (option) => {
        const active = selected === option.value;

        if (active) {
            return isPill
                ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white"
                : "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900";
        }

        return isPill
            ? "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    };

    return karatOptions.map((option) => (
        <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={` ${baseClass} ${buttonClass(option)} `}
        >
            {option.label}
        </button>
    ));
}
