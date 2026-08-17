import AdminLayout from "../components/AdminLayout.jsx";

import { Plus, Search, Loader2, TicketPercent } from "lucide-react";

import useAdminVouchers from "../hooks/useAdminVouchers.js";

import VoucherModal from "../components/adminvouchers/VoucherModal.jsx";
import VoucherRow from "../components/adminvouchers/VoucherRow.jsx";

export default function AdminVouchersPage() {
    const {
        loading,
        search,
        setSearch,
        modalOpen,
        editing,
        error,
        filtered,
        openCreate,
        openEdit,
        closeModal,
        toggle,
        remove,
        load,
    } = useAdminVouchers();

    return (
        <AdminLayout activeMenu="vouchers">
            <div className="p-3 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            Voucher Diskon
                        </h1>
                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Kelola kode promo untuk pelanggan
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 sm:h-10 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-sm font-semibold transition shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Buat Voucher
                    </button>
                </div>

                {error && (
                    <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode voucher..."
                                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-6 h-6 mx-auto animate-spin text-amber-500" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <TicketPercent className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-3 text-sm text-gray-400">Belum ada voucher</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filtered.map((v) => (
                                <VoucherRow
                                    key={v.id}
                                    v={v}
                                    onToggle={toggle}
                                    onEdit={openEdit}
                                    onDelete={remove}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <VoucherModal
                open={modalOpen}
                onClose={closeModal}
                onSaved={load}
                editing={editing}
            />
        </AdminLayout>
    );
}
