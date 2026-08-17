import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { buildOrderChatState } from "../utils/orderChat.js";

export default function PaymentStatus() {
    const { externalId } = useParams();
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [polling, setPolling] = useState(false);
    const [order, setOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");

    const syncOnce = async () => {
        if (!externalId) return;
        try {
            setLoading(true);
            setMessage("");

            // Sync dengan endpoint yang benar (use POST)
            const res = await api.post(`/api/payments/sync/${externalId}`);

            setData(res.data?.data || null);
            setStatus(res.data?.data?.status || res.data?.status || "");
            setMessage(res.data?.message || "");
        } catch (err) {
            console.error("Sync error:", err);
            const msg =
                err.message || err.response?.data?.message || "Gagal sinkronisasi pembayaran";
            setMessage(msg);
            setStatus("");
        } finally {
            setLoading(false);
        }
    };

    const loadOrderByExternal = async () => {
        if (!externalId) return;
        try {
            const res = await api.get(`/api/pesanan/external/${externalId}`);
            const o = res.data?.data || res.data || null;
            setOrder(o);
            setOrderStatus(o?.status || "");
        } catch (error) {
            console.error("Error loading order:", error);
        }
    };

    useEffect(() => {
        syncOnce();
        loadOrderByExternal();
    }, [externalId]);

    useEffect(() => {
        let timer;
        if (polling) {
            timer = setInterval(() => {
                syncOnce();
                loadOrderByExternal();
            }, 5000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [polling, externalId]);

    const orderLabel = (() => {
        const v = String(orderStatus || "").toUpperCase();
        if (["DIKEMAS", "DIPROSES", "PROCESSING", "PACKED"].includes(v)) return "Sedang Diproses";
        if (["DIBUAT", "CREATED"].includes(v)) return "Dibuat";
        if (["DIKIRIM", "SHIPPED"].includes(v)) return "Dikirim";
        if (["SELESAI", "COMPLETED"].includes(v)) return "Selesai";
        if (["DIBATALKAN", "CANCELED", "CANCELLED"].includes(v)) return "Dibatalkan";
        return orderStatus || "Tidak diketahui";
    })();

    const orderBadgeClass = ["SELESAI", "COMPLETED"].includes(
        String(orderStatus || "").toUpperCase(),
    )
        ? "bg-green-100 text-green-700"
        : ["DIKEMAS", "DIPROSES", "PROCESSING", "PACKED", "DIKIRIM", "SHIPPED"].includes(
                String(orderStatus || "").toUpperCase(),
            )
          ? "bg-yellow-100 text-yellow-700"
          : ["DIBATALKAN", "CANCELED", "CANCELLED"].includes(
                  String(orderStatus || "").toUpperCase(),
              )
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700";

    const badgeClass =
        status === "PAID" || status === "SETTLED"
            ? "bg-green-100 text-green-700"
            : status === "PENDING" || status === "UNPAID"
              ? "bg-yellow-100 text-yellow-700"
              : status
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Status Pesanan & Pembayaran
                </h1>
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-600">External ID</p>
                            <p className="font-semibold text-gray-900">{externalId}</p>
                        </div>
                        <div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}
                            >
                                {status || "Tidak diketahui"}
                            </span>
                        </div>
                    </div>

                    {message && (
                        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm sm:text-base">
                            {message}
                        </div>
                    )}

                    {data && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-600">Invoice ID</p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900 break-all">
                                    {data.invoiceId || data.id || "-"}
                                </p>
                            </div>
                            <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-600">Paid At</p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    {data.paidAt
                                        ? new Date(data.paidAt).toLocaleString("id-ID")
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Status Pesanan</h2>
                        <div className="flex items-center justify-between">
                            <p className="text-xs sm:text-sm text-gray-600">Status</p>
                            <span
                                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${orderBadgeClass}`}
                            >
                                {orderLabel}
                            </span>
                        </div>
                        {order?.id && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <p className="text-xs sm:text-sm text-gray-600">No. Pesanan</p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-900">{order.id}</p>
                                </div>
                                {order?.createdAt && (
                                    <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200">
                                        <p className="text-xs sm:text-sm text-gray-600">Dibuat</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                                            {new Date(order.createdAt).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        {["PENDING", "UNPAID"].includes(String(status || "").toUpperCase()) &&
                            data?.invoiceUrl && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.location.href = data.invoiceUrl;
                                    }}
                                    className="px-4 sm:px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold justify-center flex"
                                >
                                    Lanjutkan Pembayaran
                                </button>
                            )}

                        <Link
                            to="/chat"
                            state={buildOrderChatState({
                                source: "pembayaran",
                                payment: {
                                    ...(data || {}),
                                    externalId: data?.externalId || externalId,
                                    status: data?.status || status,
                                },
                                order,
                            })}
                            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-lg border border-gray-300 text-gray-800 text-xs sm:text-sm font-semibold hover:border-amber-400 hover:text-amber-700"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Hubungi Penjual
                        </Link>

                        <button
                            onClick={syncOnce}
                            disabled={loading}
                            className="px-4 sm:px-5 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-xs sm:text-sm font-semibold disabled:opacity-60 justify-center flex"
                        >
                            {loading ? "Sinkronisasi..." : "Sinkronkan Sekarang"}
                        </button>
                        <button
                            onClick={() => setPolling((v) => !v)}
                            className={`px-4 sm:px-5 py-2 rounded-lg border text-xs sm:text-sm font-semibold justify-center flex ${polling ? "border-green-600 text-green-700" : "border-gray-300 text-gray-800"}`}
                        >
                            {polling ? "Berhenti Auto-Sync" : "Nyalakan Auto-Sync"}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
