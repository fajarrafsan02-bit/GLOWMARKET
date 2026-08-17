import { MessageCircle } from "lucide-react";

export default function ChatLoginPrompt({ onLogin }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <MessageCircle className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Login untuk Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Silakan login terlebih dahulu untuk menghubungi admin kami.
            </p>
            <button
                onClick={onLogin}
                className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition"
            >
                Login Sekarang
            </button>
        </div>
    );
}
