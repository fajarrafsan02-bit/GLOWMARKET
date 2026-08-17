import { Users, UserCheck } from "lucide-react";

import AdminLayout from "../components/AdminLayout.jsx";

import CustomerCard from "../components/admincustomers/CustomerCard.jsx";
import CustomerDetailModal from "../components/admincustomers/CustomerDetailModal.jsx";
import CustomerSummaryCard from "../components/admincustomers/CustomerSummaryCard.jsx";
import CustomerSearchBar from "../components/admincustomers/CustomerSearchBar.jsx";
import CustomerSkeletonList from "../components/admincustomers/CustomerSkeletonList.jsx";
import CustomerEmptyState from "../components/admincustomers/CustomerEmptyState.jsx";
import ToggleStatusModal from "../components/admincustomers/ToggleStatusModal.jsx";
import FeatureComingSoonToast from "../components/admincustomers/FeatureComingSoonToast.jsx";

import useAdminCustomers from "../hooks/useAdminCustomers.js";

export default function AdminCustomers() {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        error,
        selectedCustomer,
        setSelectedCustomer,
        showFeatureNotice,
        setShowFeatureNotice,
        showDetailModal,
        setShowDetailModal,
        detailCustomer,
        statusModalCustomer,
        setStatusModalCustomer,
        togglingStatus,
        filtered,
        summary,
        handleViewDetail,
        handleOpenToggleStatusModal,
        handleConfirmToggleStatus,
        handleFeatureComingSoon,
    } = useAdminCustomers();

    return (
        <AdminLayout title="Pelanggan" activeMenu="customers">
            <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-5 lg:p-6">
                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            Pelanggan
                        </h1>

                        <p className="mt-1 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
                            Kelola dan pantau pelanggan terdaftar.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    SUMMARY
                ================================================== */}

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <CustomerSummaryCard
                        icon={Users}
                        label="Total Pelanggan"
                        value={summary.total}
                        color="gray"
                    />

                    <CustomerSummaryCard
                        icon={UserCheck}
                        label="Pelanggan Aktif"
                        value={summary.active}
                        color="emerald"
                    />
                </div>

                {/* =================================================
                    SEARCH
                ================================================== */}

                <CustomerSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* =================================================
                    LOADING
                ================================================== */}

                {loading && <CustomerSkeletonList />}

                {/* =================================================
                    EMPTY
                ================================================== */}

                {!loading && filtered.length === 0 && (
                    <CustomerEmptyState hasSearch={Boolean(searchTerm.trim())} />
                )}

                {/* =================================================
                    CUSTOMER LIST
                ================================================== */}

                {!loading && filtered.length > 0 && (
                    <div className="space-y-2">
                        {filtered.map((customer, index) => (
                            <CustomerCard
                                key={customer.id || customer.userId}
                                customer={customer}
                                i={index}
                                selectedCustomer={selectedCustomer}
                                setSelectedCustomer={setSelectedCustomer}
                                handleViewDetail={handleViewDetail}
                                handleFeatureComingSoon={handleFeatureComingSoon}
                                handleToggleStatus={handleOpenToggleStatusModal}
                            />
                        ))}
                    </div>
                )}

                {/* =================================================
                    DETAIL MODAL
                ================================================== */}

                <CustomerDetailModal
                    showDetailModal={showDetailModal}
                    setShowDetailModal={setShowDetailModal}
                    detailCustomer={detailCustomer}
                />

                {/* =================================================
                    TOGGLE STATUS CONFIRMATION MODAL
                ================================================== */}

                <ToggleStatusModal
                    customer={statusModalCustomer}
                    loading={togglingStatus}
                    onClose={() => setStatusModalCustomer(null)}
                    onConfirm={handleConfirmToggleStatus}
                />

                <FeatureComingSoonToast
                    show={showFeatureNotice}
                    onClose={() => setShowFeatureNotice(false)}
                />
            </main>
        </AdminLayout>
    );
}
