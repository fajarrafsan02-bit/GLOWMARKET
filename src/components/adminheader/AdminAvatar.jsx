export default function AdminAvatar({ name }) {
    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "A";

    return (
        <div
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 font-semibold text-[11px] sm:text-sm"
            aria-label={`Admin ${name || "Admin"}`}
        >
            {initial}
        </div>
    );
}
