import { Search, X } from "lucide-react";

export default function CustomerSearchBar({ searchTerm, setSearchTerm }) {
    return (
        <section className="mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 sm:px-5 py-2 sm:py-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari nama, email, atau HP..."
                    className="w-full h-9 sm:h-10 pl-9 pr-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] sm:text-xs text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />

                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {searchTerm && (
                <p className="mt-2 text-[10px] text-gray-400">
                    Hasil pencarian untuk{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        "{searchTerm}"
                    </span>
                </p>
            )}
        </section>
    );
}
