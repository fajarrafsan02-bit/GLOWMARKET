import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import EmailVerificationPanel from "../components/EmailVerificationPanel.jsx";

import CheckoutNotice from "../components/checkout/CheckoutNotice.jsx";
import CheckoutErrorBanner from "../components/checkout/CheckoutErrorBanner.jsx";
import CheckoutSkeleton from "../components/checkout/CheckoutSkeleton.jsx";
import ShippingAddressCard from "../components/checkout/ShippingAddressCard.jsx";
import CheckoutProductsCard from "../components/checkout/CheckoutProductsCard.jsx";
import PaymentMethodCard from "../components/checkout/PaymentMethodCard.jsx";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard.jsx";
import CheckoutRedirecting from "../components/checkout/CheckoutRedirecting.jsx";

import useCheckout from "../hooks/useCheckout.js";
import { paymentMethodLabel } from "../utils/paymentMethods.js";

export default function Checkout({ setShowAuth }) {
    const navigate = useNavigate();

    const {
        authLoading,
        user,
        items,
        loading,
        processing,
        error,
        setError,
        notice,
        noticeType,
        showNotice,
        addresses,
        selectedAddress,
        setSelectedAddress,
        selectedAddressObj,
        ongkirEstimasi,
        ongkirEstimasiLoading,
        pilihanKurir,
        setPilihanKurir,
        ubahKurir,
        setUbahKurir,
        perluVerifikasiEmail,
        setPerluVerifikasiEmail,
        voucherKode,
        setVoucherKode,
        voucherInfo,
        voucherLoading,
        vouchersSaya,
        applyVoucher,
        removeVoucher,
        totalQuantity,
        totalPrice,
        ongkirCost,
        hariEstimasi,
        diskonVoucher,
        grandTotal,
        paymentMethods,
        paymentMethodsLoading,
        paymentMethod,
        setPaymentMethod,
        redirecting,
        handleCheckout,
    } = useCheckout();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-gray-950">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent" />
            </div>
        );
    }

    if (loading) {
        return <CheckoutSkeleton setShowAuth={setShowAuth} />;
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950 text-gray-900 dark:text-white">
            <Header setShowAuth={setShowAuth} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* =================================================
                    BREADCRUMB / PROGRESS
                ================================================== */}

                <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <button
                            type="button"
                            onClick={() => navigate("/keranjang")}
                            className="hover:text-amber-600 transition"
                        >
                            Keranjang
                        </button>

                        <ChevronRight className="w-3 h-3" />

                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            Checkout
                        </span>

                        <ChevronRight className="w-3 h-3" />

                        <span>Pembayaran</span>
                    </div>

                    <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
                        Checkout
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Periksa kembali pesanan dan alamat pengiriman Anda.
                    </p>
                </div>

                {/* =================================================
                    NOTICE / ERROR / VERIFIKASI
                ================================================== */}

                <CheckoutNotice notice={notice} noticeType={noticeType} />

                {perluVerifikasiEmail && (
                    <div className="mb-5">
                        <EmailVerificationPanel
                            email={user?.email || ""}
                            judul="Verifikasi email sebelum membayar"
                            onVerified={() => {
                                setPerluVerifikasiEmail(false);
                                setError("");
                                showNotice(
                                    "Email terverifikasi. Silakan lanjutkan pembayaran.",
                                    "success",
                                );
                            }}
                        />
                    </div>
                )}

                <CheckoutErrorBanner error={error} />

                {/* =================================================
                    MAIN CHECKOUT
                ================================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 sm:gap-5 items-start">
                    {/* =============================================
                        LEFT
                    ============================================== */}

                    <div className="space-y-4">
                        <ShippingAddressCard
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            onSelect={setSelectedAddress}
                            onManage={() => navigate("/profile")}
                        />

                        <CheckoutProductsCard
                            items={items}
                            totalQuantity={totalQuantity}
                            onUbahKeranjang={() => navigate("/keranjang")}
                        />

                        <PaymentMethodCard
                            paymentMethods={paymentMethods}
                            paymentMethodsLoading={paymentMethodsLoading}
                            paymentMethod={paymentMethod}
                            onSelectPaymentMethod={setPaymentMethod}
                        />
                    </div>

                    {/* =================================================
                        RIGHT SUMMARY
                    ================================================== */}

                    <aside className="lg:sticky lg:top-24">
                        <OrderSummaryCard
                            totalPrice={totalPrice}
                            ongkirCost={ongkirCost}
                            ongkirEstimasiLoading={ongkirEstimasiLoading}
                            ongkirEstimasi={ongkirEstimasi}
                            hariEstimasi={hariEstimasi}
                            pilihanKurir={pilihanKurir}
                            ubahKurir={ubahKurir}
                            onToggleUbahKurir={() => setUbahKurir((prev) => !prev)}
                            onKurirChange={(val) => {
                                setPilihanKurir(val);
                                setUbahKurir(false);
                            }}
                            selectedAddressObj={selectedAddressObj}
                            voucherInfo={voucherInfo}
                            diskonVoucher={diskonVoucher}
                            removeVoucher={removeVoucher}
                            voucherKode={voucherKode}
                            setVoucherKode={setVoucherKode}
                            applyVoucher={applyVoucher}
                            voucherLoading={voucherLoading}
                            vouchersSaya={vouchersSaya}
                            totalQuantity={totalQuantity}
                            grandTotal={grandTotal}
                            processing={processing}
                            paymentMethod={paymentMethod}
                            onCheckout={handleCheckout}
                        />
                    </aside>
                </div>
            </main>

            <Footer />

            <CheckoutRedirecting
                show={redirecting}
                methodLabel={paymentMethod ? paymentMethodLabel(paymentMethod) : ""}
            />
        </div>
    );
}
