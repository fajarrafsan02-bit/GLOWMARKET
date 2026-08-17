import { Settings } from "lucide-react";

export default function ProfileSettingsPlaceholder() {
    return (
        <div className="py-12 text-center">
            <Settings className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />

            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                Pengaturan
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Fitur pengaturan akun akan tersedia di sini.
            </p>
        </div>
    );
}
