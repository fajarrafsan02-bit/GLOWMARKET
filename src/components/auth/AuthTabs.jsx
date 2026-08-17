export default function AuthTabs({ mode, onSwitchMode }) {
    return (
        <div className="px-4 xs:px-6">
            <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <button
                    type="button"
                    onClick={() => onSwitchMode("login")}
                    className={`h-8 rounded-md text-xs font-semibold transition-all ${
                        mode === "login"
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    Masuk
                </button>

                <button
                    type="button"
                    onClick={() => onSwitchMode("register")}
                    className={`h-8 rounded-md text-xs font-semibold transition-all ${
                        mode === "register"
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    Daftar
                </button>
            </div>
        </div>
    );
}
