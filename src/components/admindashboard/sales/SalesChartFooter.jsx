import { TrendingUp } from "lucide-react";

export default function SalesChartFooter() {
    return (
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-[10px] text-gray-400">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Data berasal dari statistik internal toko
        </div>
    );
}
