import { Package, AlertTriangle, CheckCircle2, Layers3 } from "lucide-react";

import AdminLayout from "../components/AdminLayout.jsx";

import AdminProductsToolbar from "../components/adminproducts/AdminProductsToolbar.jsx";
import AdminProductsTable from "../components/adminproducts/AdminProductsTable.jsx";
import AdminProductMobileCards from "../components/adminproducts/AdminProductMobileCards.jsx";
import AdminProductFormModal from "../components/adminproducts/AdminProductFormModal.jsx";
import AdminProductsLoading from "../components/adminproducts/AdminProductsLoading.jsx";
import AdminProductsEmpty from "../components/adminproducts/AdminProductsEmpty.jsx";
import ProductSummaryCard from "../components/adminproducts/ProductSummaryCard.jsx";

import useAdminProducts from "../hooks/useAdminProducts.js";
import { formatPrice } from "../utils/format.js";

export default function AdminProducts() {
    const {
        query,
        setQuery,
        items,
        loading,
        error,
        setError,
        showForm,
        setShowForm,
        editingId,
        form,
        setForm,
        statusFilter,
        setStatusFilter,
        quickSaving,
        summary,
        openCreate,
        openEdit,
        tryUploadImage,
        saveProduct,
        updateStatus,
        deleteProduct,
    } = useAdminProducts();

    return (
        <AdminLayout title="Produk" activeMenu="products">
            <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-5 lg:p-6">
                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            Produk
                        </h1>

                        <p className="mt-1 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
                            Kelola katalog, harga, stok, dan informasi produk.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    SUMMARY
                ================================================== */}

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <ProductSummaryCard
                        icon={Layers3}
                        label="Total Produk"
                        value={summary.total}
                        color="gray"
                    />

                    <ProductSummaryCard
                        icon={CheckCircle2}
                        label="Tersedia"
                        value={summary.available}
                        color="emerald"
                    />

                    <ProductSummaryCard
                        icon={AlertTriangle}
                        label="Stok Menipis"
                        value={summary.lowStock}
                        color="amber"
                    />

                    <ProductSummaryCard
                        icon={Package}
                        label="Habis"
                        value={summary.outOfStock}
                        color="red"
                    />
                </div>

                {/* =================================================
                    TOOLBAR
                ================================================== */}

                <section className="mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <AdminProductsToolbar
                        query={query}
                        onQueryChange={setQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onCreate={openCreate}
                    />
                </section>

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* =================================================
                    CONTENT
                ================================================== */}

                {loading && <AdminProductsLoading />}

                {!loading && items.length === 0 && <AdminProductsEmpty />}

                {!loading && items.length > 0 && (
                    <>
                        {/* Desktop */}
                        <AdminProductsTable
                            items={items}
                            formatPrice={formatPrice}
                            onEdit={openEdit}
                            onDelete={deleteProduct}
                            onUpdateStatus={updateStatus}
                            saving={quickSaving}
                        />

                        {/* Mobile */}
                        <AdminProductMobileCards
                            items={items}
                            formatPrice={formatPrice}
                            onEdit={openEdit}
                            onDelete={deleteProduct}
                        />
                    </>
                )}

                {/* =================================================
                    FORM MODAL
                ================================================== */}

                {showForm && (
                    <AdminProductFormModal
                        editingId={editingId}
                        form={form}
                        onChange={setForm}
                        onImageUpload={tryUploadImage}
                        onError={setError}
                        loading={loading}
                        onSubmit={saveProduct}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </main>
        </AdminLayout>
    );
}
