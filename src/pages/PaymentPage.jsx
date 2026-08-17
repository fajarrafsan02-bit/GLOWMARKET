import { motion as Motion } from "framer-motion";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import PaymentLoading from "../components/payment/PaymentLoading.jsx";
import PaymentBreadcrumb from "../components/payment/PaymentBreadcrumb.jsx";
import PaymentStatusHeader from "../components/payment/PaymentStatusHeader.jsx";
import PaymentTransactionDetails from "../components/payment/PaymentTransactionDetails.jsx";
import PaymentPendingActions from "../components/payment/PaymentPendingActions.jsx";
import PaymentPaidActions from "../components/payment/PaymentPaidActions.jsx";
import PaymentExpiredActions from "../components/payment/PaymentExpiredActions.jsx";
import PaymentSecureNote from "../components/payment/PaymentSecureNote.jsx";

import usePaymentPage from "../hooks/usePaymentPage.js";

export default function Payment({ setShowAuth }) {
    const {
        navigate,
        isLoggedIn,
        paymentData,
        loading,
        syncing,
        errorMsg,
        isPaid,
        isExpired,
        isPending,
        formatPrice,
        statusInfo,
        checkPaymentStatus,
    } = usePaymentPage();

    if (!isLoggedIn) {
        return null;
    }

    if (loading) {
        return <PaymentLoading setShowAuth={setShowAuth} />;
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950 flex flex-col">
            <Header setShowAuth={setShowAuth} />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <PaymentBreadcrumb navigate={navigate} />

                {/* =================================================
                    STATUS CARD
                ================================================== */}

                <Motion.section
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
                >
                    <PaymentStatusHeader statusInfo={statusInfo} isPending={isPending} />

                    {/* Transaction details */}
                    <div className="p-4 sm:p-5 md:p-8">
                        <PaymentTransactionDetails
                            paymentData={paymentData}
                            statusInfo={statusInfo}
                            formatPrice={formatPrice}
                        />

                        {/* =================================================
                            PENDING
                        ================================================== */}

                        {isPending && (
                            <PaymentPendingActions
                                paymentData={paymentData}
                                syncing={syncing}
                                errorMsg={errorMsg}
                                onCheck={checkPaymentStatus}
                            />
                        )}

                        {/* =================================================
                            PAID
                        ================================================== */}

                        {isPaid && <PaymentPaidActions navigate={navigate} />}

                        {/* =================================================
                            EXPIRED
                        ================================================== */}

                        {isExpired && <PaymentExpiredActions navigate={navigate} />}

                        {/* Secure note */}
                        <PaymentSecureNote paymentData={paymentData} />
                    </div>
                </Motion.section>
            </main>

            <Footer />
        </div>
    );
}
