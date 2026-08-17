import { ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

export default function LinkColumn({ title, links, className = "", withChevron = false }) {
    return (
        <div className={className}>
            <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 dark:text-white">
                {title}
            </h3>

            <ul className="mt-2.5 space-y-2 sm:mt-4 sm:space-y-3">
                {links.map((item) => (
                    <li key={item.label}>
                        <Link
                            to={item.to}
                            className={` ${withChevron ? "inline-flex items-center gap-1 " : ""}text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors `}
                        >
                            {item.label}

                            {withChevron && (
                                <ChevronRight className="w-3 h-3 opacity-0 -ml-1 transition-all group-hover:opacity-100" />
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
