/* eslint-disable no-unused-vars */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Truck, MessageCircle, Star, ChevronRight, Package, MapPin } from "lucide-react";
import { moneyTimesQty } from "../../utils/format.js";
import { buildOrderChatState } from "../../utils/orderChat.js";

export default function OrderCard({
    order,
    getStatusConfig,
    formatPrice,
    getOrderTotal,
    openReviewModal,
}) {
    const status = getStatusConfig(order.status);
    const StatusIcon = status.icon;

    const orderId = order.id || order.orderId;

    const items = order.items || [];

    const totalItems = items.reduce(
        (sum, item) => sum + (parseInt(item.quantity ?? item.jumlah ?? 1, 10) || 1),
        0,
    );

    const isCompleted = ["COMPLETED", "DELIVERED", "SELESAI"].includes(
        (order.status || "").toUpperCase(),
    );

    const isWaitingPayment = ["PENDING", "UNPAID"].includes((order.status || "").toUpperCase());

    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "-";

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 15,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.1,
            }}
            transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700"
        >
            {/* =====================================================
                ORDER HEADER
            ====================================================== */}
            <div className="px-3 py-3 sm:px-5 sm:py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    {/* Order Info */}
                    <div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />

                            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                Pesanan #{orderId}
                            </span>

                            <span className="text-gray-300 dark:text-gray-700">•</span>

                            <span className="text-[10px] sm:text-xs text-gray-400">{orderDate}</span>
                        </div>
                    </div>

                    {/* Status */}
                    <div
                        className={` self-start sm:self-auto inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[9px] sm:text-[10px] font-medium ${status.color} `}
                    >
                        <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />

                        {status.label}
                    </div>
                </div>
            </div>

            {/* =====================================================
                PRODUCT LIST
            ====================================================== */}
            <div className="px-3 py-3 sm:px-5 sm:py-5">
                <div className="space-y-3 sm:space-y-4">
                    {items.slice(0, 2).map((item, index) => {
                        const quantity = parseInt(item.quantity ?? item.jumlah ?? 1, 10) || 1;

                        return (
                            <div
                                key={item.id || item.produkId || index}
                                className="flex items-center gap-3 sm:gap-4"
                            >
                                {/* Image */}
                                <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                                    {item.gambarProduk ? (
                                        <img
                                            src={item.gambarProduk}
                                            alt={item.namaProduk || "Produk"}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl text-gray-300">
                                            ✦
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                        {item.namaProduk || "Produk Emas"}
                                    </h3>

                                    {item.namaVariant && (
                                        <span className="mt-0.5 sm:mt-1 inline-block px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-[9px] sm:text-[10px] font-medium text-amber-700 dark:text-amber-300 rounded">
                                            {item.namaVariant}
                                        </span>
                                    )}

                                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-400">
                                        {quantity} × {formatPrice(item.hargaSatuan)}
                                    </p>
                                </div>

                                {/* Item Price */}
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                        {formatPrice(
                                            item.subtotal ??
                                                moneyTimesQty(item.hargaSatuan, quantity),
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Remaining Products */}
                    {items.length > 2 && (
                        <div className="pl-[68px] sm:pl-24">
                            <span className="text-[10px] sm:text-xs text-gray-400">
                                +{items.length - 2} produk lainnya
                            </span>
                        </div>
                    )}
                </div>

                {/* =================================================
                    SHIPPING
                ================================================== */}
                {(order.resi || order.nomorResi) && (
                    <div className="mt-4 sm:mt-5 p-2.5 sm:p-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                            </div>

                            <div>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400">
                                    Nomor Resi
                                </p>

                                <p className="text-[11px] sm:text-xs font-mono font-semibold text-gray-800 dark:text-gray-200 select-all">
                                    {order.resi || order.nomorResi}
                                </p>
                            </div>
                        </div>

                        <Link
                            to={`/pesanan/${orderId}`}
                            className="inline-flex self-start sm:self-auto items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                        >
                            Lacak pesanan
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </Link>
                    </div>
                )}
            </div>

            {/* =====================================================
                ORDER FOOTER
            ====================================================== */}
            <div className="px-3 py-3 sm:px-5 sm:py-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                    {/* Summary */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-8 sm:items-center">
                        <div>
                            <p className="text-[10px] sm:text-xs text-gray-400">
                                {totalItems} {totalItems === 1 ? "item" : "item"} · Total pesanan
                            </p>

                            <p className="mt-0.5 sm:mt-1 text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                                {formatPrice(getOrderTotal(order))}
                            </p>
                        </div>

                        {order.ongkirKurir && (
                            <div className="sm:border-l sm:border-gray-200 sm:dark:border-gray-800 sm:pl-8">
                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-0">Kurir Pengiriman</p>
                                <p className="text-[11px] sm:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase">
                                    {order.ongkirKurir}{" "}
                                    {order.ongkirLayanan && `- ${order.ongkirLayanan}`}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {/* Chat */}
                        <Link
                            to="/chat"
                            state={buildOrderChatState({ source: "pesanan", order })}
                            className="h-8 sm:h-9 px-2.5 sm:px-3.5 inline-flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Hubungi
                        </Link>

                        {/* Lanjutkan pembayaran untuk pesanan yang belum dibayar */}
                        {isWaitingPayment && order.externalId && (
                            <Link
                                to={`/payment-status/${order.externalId}`}
                                className="h-8 sm:h-9 px-3 sm:px-4 inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-semibold transition-colors"
                            >
                                Bayar
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        )}

                        {/* Detail */}
                        <Link
                            to={`/pesanan/${orderId}`}
                            className="h-8 sm:h-9 px-3 sm:px-4 inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] sm:text-xs font-medium hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
                        >
                            Detail
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* =================================================
                    REVIEW ACTION
                ================================================== */}
                {isCompleted && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400">
                                Bagikan pengalaman Anda
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {items.map((item, index) => (
                                    <button
                                        key={item.id || item.produkId || index}
                                        type="button"
                                        onClick={() => openReviewModal(order, item)}
                                        className="h-7 sm:h-8 px-2 sm:px-3 inline-flex items-center gap-1 sm:gap-1.5 border border-amber-200 dark:border-amber-900 text-[10px] sm:text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                                    >
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                                        Review {item.namaProduk || "Produk"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.article>
    );
}
