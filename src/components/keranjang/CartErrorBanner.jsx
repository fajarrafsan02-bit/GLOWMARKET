import { motion as Motion } from "framer-motion";

export default function CartErrorBanner({ error, onRetry }) {
    if (!error) return null;

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-5 px-4 py-3 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400"
        >
            {error}

            <button type="button" onClick={onRetry} className="ml-3 font-semibold underline">
                Coba Lagi
            </button>
        </Motion.div>
    );
}
