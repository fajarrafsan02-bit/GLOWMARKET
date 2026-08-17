export default function NoticeBanner({ type = "error", children }) {
    const styles = {
        error: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400",
        success:
            "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    };

    return (
        <div
            className={` mb-4 px-3.5 py-2.5 rounded-lg border text-sm ${styles[type] || styles.error} `}
        >
            {children}
        </div>
    );
}
