import { LogOut } from "lucide-react";

export default function SidebarBottom({ onLogout }) {
    return (
        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
            <button
                type="button"
                onClick={onLogout}
                className="w-full h-10 px-3 rounded-lg flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
                <LogOut className="w-4 h-4" />

                <span className="text-xs font-medium">Keluar</span>
            </button>
        </div>
    );
}
