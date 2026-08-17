import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import CartLoginPrompt from "../components/keranjang/CartLoginPrompt.jsx";
import CartHeader from "../components/keranjang/CartHeader.jsx";
import CartNotice from "../components/keranjang/CartNotice.jsx";
import CartErrorBanner from "../components/keranjang/CartErrorBanner.jsx";
import CartSkeleton from "../components/keranjang/CartSkeleton.jsx";
import CartEmpty from "../components/keranjang/CartEmpty.jsx";
import CartItemsSection from "../components/keranjang/CartItemsSection.jsx";
import CartSummary from "../components/keranjang/CartSummary.jsx";

import useKeranjang from "../hooks/useKeranjang.js";

export default function KeranjangPage({ setShowAuth }) {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        items,
        loading,
        error,
        notice,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        ongkirEstimasi,
        ongkirLoading,
        pilihanKurir,
        setPilihanKurir,
        subtotal,
        ongkirPreview,
        totalQuantity,
        loadCart,
        updateQuantity,
        removeItem,
        clearCart,
    } = useKeranjang();

    if (!isAuthenticated) {
        return <CartLoginPrompt setShowAuth={setShowAuth} />;
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950">
            <Header setShowAuth={setShowAuth} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <CartHeader
                    loading={loading}
                    items={items}
                    totalQuantity={totalQuantity}
                    onClearCart={clearCart}
                />

                <CartNotice notice={notice} />
                <CartErrorBanner error={error} onRetry={loadCart} />

                {loading && <CartSkeleton />}

                {!loading && items.length === 0 && <CartEmpty />}

                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px] gap-5 items-start">
                        <CartItemsSection
                            items={items}
                            onRemove={removeItem}
                            onUpdateQuantity={updateQuantity}
                        />

                        <CartSummary
                            addresses={addresses}
                            selectedAddressId={selectedAddressId}
                            onSelectAddress={setSelectedAddressId}
                            ongkirLoading={ongkirLoading}
                            ongkirEstimasi={ongkirEstimasi}
                            pilihanKurir={pilihanKurir}
                            onPilihanKurir={setPilihanKurir}
                            subtotal={subtotal}
                            ongkirPreview={ongkirPreview}
                            onCheckout={() =>
                                navigate("/checkout", {
                                    state: {
                                        selectedAddressId,
                                        pilihanKurir,
                                    },
                                })
                            }
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
