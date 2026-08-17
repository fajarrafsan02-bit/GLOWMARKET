export default function AuthDivider({ text = "atau" }) {
    return (
        <div className="px-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {text}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        </div>
    );
}
