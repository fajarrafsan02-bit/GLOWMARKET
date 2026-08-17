import { Edit3, Trash2, Package } from "lucide-react";

import { statusMenurutStok } from "../../utils/productStatus.js";

import ProductStatusBadge from "./ProductStatusBadge.jsx";
import QuickStockCell from "./QuickStockCell.jsx";

export default function AdminProductsTable({
    items,
    formatPrice,
    onEdit,
    onDelete,
    onUpdateStatus,
    saving,
}) {
    return (
        <div className="hidden lg:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full table-fixed">
                <colgroup>
                    <col className="w-[28%]" />
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                    <col className="w-[18%]" />
                    <col className="w-[13%]" />
                    <col className="w-[11%]" />
                </colgroup>

                {/* =================================================
                    HEADER
                ================================================== */}

                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900">
                        <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Produk
                        </th>

                        <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Harga
                        </th>

                        <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Stok
                        </th>

                        <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Spesifikasi
                        </th>

                        <th className="px-6 py-3.5 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Status
                        </th>

                        <th className="px-6 py-3.5 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Aksi
                        </th>
                    </tr>
                </thead>

                {/* =================================================
                    BODY
                ================================================== */}

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((product) => {
                        const stock = Number(product.stock ?? product.stok ?? 0) || 0;

                        const lowStock = stock > 0 && stock <= 5;

                        const outOfStock = stock <= 0;

                        return (
                            <tr
                                key={product.id}
                                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                {/* =================================
                                        PRODUCT
                                    ================================== */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            {product.gambar ? (
                                                <img
                                                    src={product.gambar}
                                                    alt={product.nama}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[220px]"
                                                title={product.nama}
                                            >
                                                {product.nama}
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-gray-400">
                                                ID #{product.id}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* =================================
                                        PRICE
                                    ================================== */}

                                <td className="px-6 py-4">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                        {formatPrice(product.harga)}
                                    </p>
                                </td>

                                {/* =================================
                                        STOCK
                                    ================================== */}

                                <td className="px-6 py-4">
                                    <QuickStockCell
                                        stock={stock}
                                        outOfStock={outOfStock}
                                        lowStock={lowStock}
                                    />
                                </td>

                                {/* =================================
                                        SPECIFICATION
                                    ================================== */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                                            {product.karatEmas}K
                                        </span>

                                        <span className="text-[10px] text-gray-400">•</span>

                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                            {product.beratGram}g
                                        </span>
                                    </div>
                                </td>

                                {/* =================================
                                        STATUS
                                    ================================== */}

                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <ProductStatusBadge status={product.status} stock={product.stock} />

                                        {/* Ubah ketersediaan tanpa membuka form penuh */}
                                        <select
                                            value={statusMenurutStok(
                                                product.stock,
                                                product.status,
                                            )}
                                            onChange={(event) =>
                                                onUpdateStatus(product, event.target.value)
                                            }
                                            disabled={saving}
                                            aria-label="Ubah status produk"
                                            className="h-6 px-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[10px] text-gray-500 dark:text-gray-400 focus:outline-none focus:border-amber-500 disabled:opacity-40"
                                        >
                                            <option
                                                value="TERSEDIA"
                                                disabled={Number(product.stock) <= 0}
                                            >
                                                Tersedia
                                            </option>
                                            <option value="TIDAK_TERSEDIA">Tidak Tersedia</option>
                                            <option
                                                value="HABIS"
                                                disabled={Number(product.stock) > 0}
                                            >
                                                Habis
                                            </option>
                                        </select>
                                    </div>
                                </td>

                                {/* =================================
                                        ACTIONS
                                    ================================== */}

                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(product)}
                                            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center justify-center transition"
                                            title="Edit produk"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(product.id)}
                                            className="w-8 h-8 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition"
                                            title="Hapus produk"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
