import { motion as Motion } from "framer-motion";

export default function PaymentErrorBanner({ error }) {
    if (!error) return null;

    return (
        <Motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400"
        >
            {error}
        </Motion.div>
    );
}
