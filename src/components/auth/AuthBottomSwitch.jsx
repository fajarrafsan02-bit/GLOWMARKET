export default function AuthBottomSwitch({ mode, onSwitchMode }) {
    return (
        <div className="px-3.5 xs:px-5 py-2.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                    type="button"
                    onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
                    className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                >
                    {mode === "login" ? "Daftar sekarang" : "Masuk"}
                </button>
            </p>
        </div>
    );
}
