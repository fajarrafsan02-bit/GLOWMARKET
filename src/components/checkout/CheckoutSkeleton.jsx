import Header from "../Header.jsx";
import Footer from "../Footer.jsx";

export default function CheckoutSkeleton({ setShowAuth }) {
    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950 flex flex-col">
            <Header setShowAuth={setShowAuth} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-800" />

                    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-5 mt-6">
                        <div className="space-y-4">
                            <div className="h-48 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
                            <div className="h-72 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
                        </div>

                        <div className="h-80 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
