import { Check } from "lucide-react";

export default function OrderTimeline({ currentStep }) {
    const timeline = [
        { label: "Pembayaran", done: currentStep >= 1 },
        { label: "Pesanan Diproses", done: currentStep >= 2 },
        { label: "Pesanan Dikirim", done: currentStep >= 3 },
        { label: "Pesanan Selesai", done: currentStep >= 4 },
    ];

    return (
        <div className="px-4 sm:px-8 py-6">
            <div className="relative">
                <div className="absolute left-0 right-0 top-3.5 h-px bg-gray-200 dark:bg-gray-700" />

                <div className="relative grid grid-cols-4">
                    {timeline.map((step) => (
                        <div
                            key={step.label}
                            className="flex flex-col items-center text-center"
                        >
                            <div
                                className={` relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 ${step.done ? "bg-amber-500 border-amber-500 text-white" : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400"} `}
                            >
                                {step.done ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                )}
                            </div>

                            <span
                                className={` mt-2 text-[9px] sm:text-[10px] leading-tight ${step.done ? "text-gray-700 dark:text-gray-300 font-medium" : "text-gray-400"} `}
                            >
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
