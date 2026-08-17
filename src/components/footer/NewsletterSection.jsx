import { Send } from "lucide-react";

export default function NewsletterSection({ store }) {
    const handleNewsletterSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const email = form.email.value.trim();

        if (!email) return;

        // Hubungkan ke API newsletter ketika backend sudah tersedia.
        console.log("Newsletter:", email);

        form.reset();
    };

    return (
        <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                    <div className="max-w-lg">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-600 dark:text-amber-400">
                            {store.name}
                        </p>

                        <h2 className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            Dapatkan update terbaru
                        </h2>

                        <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-500 dark:text-gray-400">
                            Dapatkan informasi koleksi baru, promo, dan penawaran khusus melalui
                            email Anda.
                        </p>
                    </div>

                    <form onSubmit={handleNewsletterSubmit} className="flex w-full md:max-w-md gap-2">
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email Anda"
                            className="flex-1 h-10 sm:h-11 px-3 sm:px-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                        />

                        <button
                            type="submit"
                            className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                        >
                            Daftar
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
