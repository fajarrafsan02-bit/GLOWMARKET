import { ShoppingBag, Clock3, Package, Truck } from "lucide-react";

import AdminLayout from "../components/AdminLayout.jsx";

import useAdminOrders from "../hooks/useAdminOrders.js";

import OrdersToolbar from "../components/adminorders/OrdersToolbar.jsx";
import OrderCard from "../components/adminorders/OrderCard.jsx";
import OrdersPagination from "../components/adminorders/OrdersPagination.jsx";
import OrderStatusModal from "../components/adminorders/OrderStatusModal.jsx";
import OrderSummaryCard from "../components/adminorders/OrderSummaryCard.jsx";
import OrderSkeletonList from "../components/adminorders/OrderSkeletonList.jsx";
import EmptyOrders from "../components/adminorders/EmptyOrders.jsx";

export default function AdminOrders() {
    const {
        query,
        setQuery,
        items,
        loading,
        error,
        orderSummary,
        sortOrder,
        setSortOrder,
        itemsPerPage,
        setItemsPerPage,
        currentPage,
        setCurrentPage,
        selectedOrder,
        tempStatus,
        setTempStatus,
        tempResi,
        setTempResi,
        filtered,
        totalPages,
        startIndex,
        endIndex,
        currentItems,
        goToPage,
        fetchOrders,
        openDetail,
        closeDetail,
        saveChanges,
        lanjutkanTracking,
        trackingLoading,
        trackingNotice,
    } = useAdminOrders();

    return (
        <AdminLayout title="Pesanan" activeMenu="orders">
            <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-5 lg:p-6">
                {/* HEADER */}
                <div className="mb-4 sm:mb-5">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        Pesanan
                    </h1>

                    <p className="mt-1 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
                        Kelola dan pantau seluruh pesanan pelanggan.
                    </p>
                </div>

                {/* ORDER SUMMARY */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <OrderSummaryCard
                        icon={ShoppingBag}
                        label="Semua Pesanan"
                        value={items.length}
                        accent="gray"
                    />

                    <OrderSummaryCard
                        icon={Clock3}
                        label="Menunggu Bayar"
                        value={orderSummary.pending}
                        accent="amber"
                    />

                    <OrderSummaryCard
                        icon={Package}
                        label="Diproses"
                        value={orderSummary.processing}
                        accent="blue"
                    />

                    <OrderSummaryCard
                        icon={Truck}
                        label="Dikirim"
                        value={orderSummary.shipped}
                        accent="indigo"
                    />
                </div>

                {/* TOOLBAR */}
                <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-4">
                    <OrdersToolbar
                        query={query}
                        onQueryChange={setQuery}
                        sortOrder={sortOrder}
                        onToggleSort={() =>
                            setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
                        }
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1);
                        }}
                        onRefresh={fetchOrders}
                        loading={loading}
                    />
                </section>

                {/* ERROR */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* TABLE HEADER */}
                {!loading && filtered.length > 0 && (
                    <div className="hidden md:grid grid-cols-[1.4fr_1.6fr_1fr_1fr_100px] items-center gap-4 px-5 py-3 mb-2 bg-gray-100/70 dark:bg-gray-800/50 border border-transparent rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <span>Pesanan</span>

                        <span>Pelanggan</span>

                        <span>Total</span>

                        <span>Status</span>

                        <span className="text-right">Aksi</span>
                    </div>
                )}

                {/* ORDER LIST */}
                <div className="space-y-2">
                    {loading ? (
                        <OrderSkeletonList />
                    ) : filtered.length === 0 ? (
                        <EmptyOrders query={query} />
                    ) : (
                        currentItems.map((order) => (
                            <OrderCard key={order.id} order={order} onDetail={openDetail} />
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {!loading && filtered.length > 0 && (
                    <div className="mt-4">
                        <OrdersPagination
                            startIndex={startIndex}
                            endIndex={endIndex}
                            total={filtered.length}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                        />
                    </div>
                )}
            </main>

            {/* STATUS MODAL */}
            <OrderStatusModal
                order={selectedOrder}
                tempStatus={tempStatus}
                setTempStatus={setTempStatus}
                tempResi={tempResi}
                setTempResi={setTempResi}
                onSave={saveChanges}
                onClose={closeDetail}
                onLanjutkanTracking={lanjutkanTracking}
                trackingLoading={trackingLoading}
                trackingNotice={trackingNotice}
            />
        </AdminLayout>
    );
}
