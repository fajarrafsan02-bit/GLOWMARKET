import { AlertCircle } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import PoinHeader from "../components/poin/PoinHeader.jsx";
import LoginPrompt from "../components/poin/LoginPrompt.jsx";
import PoinSummaryCards from "../components/poin/PoinSummaryCards.jsx";
import RedeemCard from "../components/poin/RedeemCard.jsx";
import VoucherList from "../components/poin/VoucherList.jsx";
import PublicVoucherList from "../components/poin/PublicVoucherList.jsx";
import PoinHistory from "../components/poin/PoinHistory.jsx";

import usePoinPage from "../hooks/usePoinPage.js";

import { useAuth } from "../context/AuthContext.jsx";

export default function PoinPage() {
    const { isAuthenticated } = useAuth();

    const {
        showAuth,
        setShowAuth,
        saldo,
        totalDiperoleh,
        totalDipakai,
        riwayat,
        vouchers,
        voucherPublik,
        loading,
        error,
        jumlahPoin,
        setJumlahPoin,
        submitting,
        submitError,
        success,
        copiedKode,
        tukar,
        salinKode,
    } = usePoinPage({ isAuthenticated });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Header />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <PoinHeader />

                {!isAuthenticated ? (
                    <LoginPrompt onLogin={() => setShowAuth(true)} />
                ) : (
                    <>
                        {error && (
                            <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <PoinSummaryCards
                            loading={loading}
                            saldo={saldo}
                            totalDiperoleh={totalDiperoleh}
                            totalDipakai={totalDipakai}
                        />

                        <PublicVoucherList
                            vouchers={voucherPublik}
                            copiedKode={copiedKode}
                            onCopy={salinKode}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <RedeemCard
                                jumlahPoin={jumlahPoin}
                                onJumlahPoinChange={setJumlahPoin}
                                submitting={submitting}
                                loading={loading}
                                onTukar={tukar}
                                submitError={submitError}
                                success={success}
                            />

                            <VoucherList
                                vouchers={vouchers}
                                copiedKode={copiedKode}
                                onCopy={salinKode}
                            />
                        </div>

                        <PoinHistory loading={loading} riwayat={riwayat} />
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
