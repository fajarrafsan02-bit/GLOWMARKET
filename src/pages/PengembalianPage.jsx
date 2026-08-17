import { Loader2 } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import ReturnHeader from "../components/pengembalian/ReturnHeader.jsx";
import NoticeBanner from "../components/pengembalian/NoticeBanner.jsx";
import ReturnForm from "../components/pengembalian/ReturnForm.jsx";
import ReturnList from "../components/pengembalian/ReturnList.jsx";
import ReturnEmpty from "../components/pengembalian/ReturnEmpty.jsx";

import usePengembalian from "../hooks/usePengembalian.js";

import { useAuth } from "../context/AuthContext.jsx";

export default function PengembalianPage() {
    const { isAuthenticated } = useAuth();

    const {
        showAuth,
        setShowAuth,
        returns,
        loading,
        error,
        ordersLoading,
        formOpen,
        pesananId,
        setPesananId,
        alasan,
        setAlasan,
        submitting,
        submitError,
        success,
        pesananSelesai,
        submit,
        toggleForm,
        closeForm,
    } = usePengembalian({ isAuthenticated });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Header />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <ReturnHeader onToggleForm={toggleForm} />

                {error && <NoticeBanner>{error}</NoticeBanner>}

                {success && <NoticeBanner type="success">{success}</NoticeBanner>}

                {formOpen && (
                    <ReturnForm
                        ordersLoading={ordersLoading}
                        pesananSelesai={pesananSelesai}
                        pesananId={pesananId}
                        onPesananIdChange={setPesananId}
                        alasan={alasan}
                        onAlasanChange={setAlasan}
                        submitting={submitting}
                        submitError={submitError}
                        onCancel={closeForm}
                        onSubmit={submit}
                    />
                )}

                {loading ? (
                    <div className="py-16 text-center">
                        <Loader2 className="w-6 h-6 mx-auto animate-spin text-amber-500" />
                    </div>
                ) : returns.length === 0 ? (
                    <ReturnEmpty />
                ) : (
                    <ReturnList returns={returns} />
                )}
            </main>

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
