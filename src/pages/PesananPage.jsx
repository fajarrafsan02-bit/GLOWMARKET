import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

import OrderPageHeader from "../components/pesanan/OrderPageHeader.jsx";
import OrderNotice from "../components/pesanan/OrderNotice.jsx";
import OrderStats from "../components/pesanan/OrderStats.jsx";
import OrderErrorBanner from "../components/pesanan/OrderErrorBanner.jsx";
import OrderSkeleton from "../components/pesanan/OrderSkeleton.jsx";
import OrderEmptyState from "../components/pesanan/OrderEmptyState.jsx";
import OrderSyncSection from "../components/pesanan/OrderSyncSection.jsx";
import OrderFilterBar from "../components/pesanan/OrderFilterBar.jsx";
import OrderCard from "../components/pesanan/OrderCard.jsx";
import OrderReviewModal from "../components/pesanan/OrderReviewModal.jsx";

import usePesanan from "../hooks/usePesanan.js";
import { formatPrice } from "../utils/format.js";

export default function Pesanan() {
    const {
        showAuth,
        setShowAuth,
        externalId,
        setExternalId,
        loadingSync,
        notice,
        noticeType,
        orders,
        ordersLoading,
        ordersError,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        sortOrder,
        setSortOrder,
        showReviewModal,
        selectedOrder,
        reviewChecking,
        alreadyReviewed,
        selectedProduct,
        reviewRating,
        setReviewRating,
        reviewComment,
        setReviewComment,
        reviewError,
        reviewLoading,
        filteredOrders,
        totalFilteredValue,
        loadOrders,
        sync,
        getStatusConfig,
        getOrderTotal,
        openReviewModal,
        closeReviewModal,
        submitReview,
    } = usePesanan();

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950">
            <Header setShowAuth={setShowAuth} />

            <OrderNotice notice={notice} noticeType={noticeType} />

            {/* ====================================================
                PAGE
            ===================================================== */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <OrderPageHeader />

                {/* ====================================================
                    ACCOUNT SUMMARY
                ===================================================== */}

                <OrderStats
                    totalOrders={orders.length}
                    totalShown={filteredOrders.length}
                    totalValue={totalFilteredValue}
                />

                {/* ====================================================
                    PAYMENT SYNC
                ===================================================== */}

                <div className="mb-6">
                    <OrderSyncSection
                        externalId={externalId}
                        setExternalId={setExternalId}
                        sync={sync}
                        loadingSync={loadingSync}
                    />
                </div>

                {/* ====================================================
                    FILTER BAR
                ===================================================== */}

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6">
                    <OrderFilterBar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />
                </div>

                {/* ====================================================
                    ERROR
                ===================================================== */}

                <OrderErrorBanner error={ordersError} onRetry={loadOrders} />

                {/* ====================================================
                    LOADING
                ===================================================== */}

                {ordersLoading && <OrderSkeleton />}

                {/* ====================================================
                    EMPTY STATE
                ===================================================== */}

                {!ordersLoading && filteredOrders.length === 0 && <OrderEmptyState />}

                {/* ====================================================
                    ORDER LIST
                ===================================================== */}

                {!ordersLoading && filteredOrders.length > 0 && (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id || order.orderId}
                                order={order}
                                getStatusConfig={getStatusConfig}
                                formatPrice={formatPrice}
                                getOrderTotal={getOrderTotal}
                                openReviewModal={openReviewModal}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ========================================================
                REVIEW MODAL
            ========================================================= */}

            <OrderReviewModal
                showReviewModal={showReviewModal}
                closeReviewModal={closeReviewModal}
                selectedProduct={selectedProduct}
                selectedOrder={selectedOrder}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                reviewError={reviewError}
                reviewLoading={reviewLoading}
                submitReview={submitReview}
                reviewChecking={reviewChecking}
                alreadyReviewed={alreadyReviewed}
            />

            <Footer />

            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
