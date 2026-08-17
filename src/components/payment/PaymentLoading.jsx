import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

export default function PaymentLoading({ setShowAuth }) {
    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950 flex flex-col">
            <Header setShowAuth={setShowAuth} />

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full border-2 border-gray-200 dark:border-gray-800 border-t-amber-500 animate-spin" />

                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Memuat status pembayaran...
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
