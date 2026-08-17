import { motion as Motion } from "framer-motion";

export default function PaymentStatusHeader({ statusInfo, isPending }) {
    const IconComp = statusInfo.icon;

    return (
        <div
            className={`px-5 sm:px-8 py-8 sm:py-10 text-center border-b ${statusInfo.border} ${statusInfo.bg}`}
        >
            <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                <IconComp
                    className={`w-8 h-8 ${statusInfo.iconColor} ${isPending ? "animate-pulse" : ""}`}
                />
            </div>

            <h1 className={`mt-5 text-xl sm:text-2xl font-semibold ${statusInfo.color}`}>
                {statusInfo.title}
            </h1>

            <p className="max-w-lg mx-auto mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {statusInfo.description}
            </p>
        </div>
    );
}
