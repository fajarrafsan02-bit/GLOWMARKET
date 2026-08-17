export default function DetailSection({ title, children }) {
    return (
        <section className="mt-4 sm:mt-5">
            <h3 className="mb-2 sm:mb-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.12em] font-semibold text-gray-400">
                {title}
            </h3>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {children}
            </div>
        </section>
    );
}
