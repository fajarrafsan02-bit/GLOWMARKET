import { motion as Motion } from "framer-motion";

import { ChevronRight } from "lucide-react";

export default function SidebarMenuItem({ item, active, onSelect }) {
    const Icon = item.icon;

    return (
        <Motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={` relative w-full h-10 px-3 rounded-lg flex items-center gap-3 text-left transition-colors ${active ? ` bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ` : ` text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 `} `}
        >
            {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-500" />}

            {item.plainIcon ? (
                <Icon className="w-4 h-4 shrink-0" />
            ) : (
                <Icon
                    className={` w-4 h-4 shrink-0 ${active ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"} `}
                />
            )}

            <span className="flex-1 text-xs font-medium text-left">{item.label}</span>

            {item.badge && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                </span>
            )}

            {active && <ChevronRight className="w-3.5 h-3.5 text-amber-500" />}
        </Motion.button>
    );
}
