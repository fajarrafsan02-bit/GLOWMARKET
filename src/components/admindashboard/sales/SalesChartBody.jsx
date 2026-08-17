import { TrendingUp } from "lucide-react";

export default function SalesChartBody({ canvasRef, canRender }) {
    return (
        <div className="p-4 sm:p-5">
            {!canRender ? (
                <div className="h-72 flex items-center justify-center text-center">
                    <div>
                        <TrendingUp className="w-7 h-7 mx-auto text-gray-300 dark:text-gray-700" />

                        <p className="mt-2 text-xs text-gray-400">Memuat data penjualan...</p>
                    </div>
                </div>
            ) : (
                <div className="h-64 sm:h-72">
                    <canvas ref={canvasRef} />
                </div>
            )}
        </div>
    );
}
