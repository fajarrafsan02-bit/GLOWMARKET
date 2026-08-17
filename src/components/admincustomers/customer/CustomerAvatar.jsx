const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-10 h-10 text-sm",
};

export default function CustomerAvatar({ name, size = "sm" }) {
    return (
        <div
            className={` ${sizes[size]} shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-semibold `}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
}
