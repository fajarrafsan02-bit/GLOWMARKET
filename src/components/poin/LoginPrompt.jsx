export default function LoginPrompt({ onLogin }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                Silakan login untuk melihat poin loyalitas Anda.
            </p>

            <button
                onClick={onLogin}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
            >
                Login Sekarang
            </button>
        </div>
    );
}
