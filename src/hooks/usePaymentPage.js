import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock3 } from "lucide-react";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function usePaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [paymentData, setPaymentData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("PENDING");

    const [syncing, setSyncing] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [shouldPoll, setShouldPoll] = useState(true);

    const { isAuthenticated: isLoggedIn } = useAuth();

    const isPaid = ["PAID", "SETTLED"].includes(String(status).toUpperCase());

    const isExpired = String(status).toUpperCase() === "EXPIRED";

    const isPending = ["PENDING", "UNPAID"].includes(String(status).toUpperCase());

    const formatPrice = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    const getStatusConfig = () => {
        if (isPaid) {
            return {
                title: "Pembayaran Berhasil",
                description: "Pembayaran Anda telah diterima dan pesanan sedang diproses.",
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                border: "border-emerald-200 dark:border-emerald-800",
                icon: CheckCircle2,
                iconColor: "text-emerald-500",
                label: "Berhasil",
            };
        }

        if (isExpired) {
            return {
                title: "Pembayaran Kedaluwarsa",
                description: "Batas waktu pembayaran telah berakhir. Silakan buat transaksi baru.",
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                border: "border-red-200 dark:border-red-800",
                icon: XCircle,
                iconColor: "text-red-500",
                label: "Kedaluwarsa",
            };
        }

        return {
            title: "Menunggu Pembayaran",
            description: "Selesaikan pembayaran melalui halaman pembayaran yang tersedia.",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            border: "border-amber-200 dark:border-amber-800",
            icon: Clock3,
            iconColor: "text-amber-500",
            label: "Menunggu",
        };
    };

    const checkPaymentStatus = async (externalId) => {
        if (!externalId) return;

        try {
            setSyncing(true);
            setErrorMsg("");

            const syncResponse = await api.post(`/api/payments/sync/${externalId}`);

            if (syncResponse.data?.success && syncResponse.data?.data) {
                const newStatus = syncResponse.data.data.status;

                setStatus(newStatus);

                const normalized = String(newStatus || "").toUpperCase();

                if (["PAID", "SETTLED", "EXPIRED"].includes(normalized)) {
                    setShouldPoll(false);
                }

                return;
            }
        } catch (error) {
            console.error("[Payment] Sync error:", error);

            try {
                const invoiceUrl = paymentData?.invoiceUrl || "";

                const match = invoiceUrl.match(/invoices\/([^/?#]+)/i);

                const xenditId = match?.[1];

                if (xenditId) {
                    const response = await api.post(`/api/payments/sync-by-xendit/${xenditId}`);

                    if (response.data?.success && response.data?.data) {
                        const newStatus = response.data.data.status;

                        setStatus(newStatus);

                        setErrorMsg("");

                        const normalized = String(newStatus || "").toUpperCase();

                        if (["PAID", "SETTLED", "EXPIRED"].includes(normalized)) {
                            setShouldPoll(false);
                        }

                        return;
                    }
                }

                const response = await api.get(`/api/payments/${externalId}`);

                if (response.data?.success && response.data?.data) {
                    const newStatus = response.data.data.status;

                    setStatus(newStatus);

                    setErrorMsg("");

                    const normalized = String(newStatus || "").toUpperCase();

                    if (["PAID", "SETTLED", "EXPIRED"].includes(normalized)) {
                        setShouldPoll(false);
                    }
                }
            } catch (fallbackError) {
                console.error("[Payment] Fallback error:", fallbackError);

                setErrorMsg("Gagal memeriksa status pembayaran.");
            }
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        const { invoiceUrl, externalId, amount, ongkir, status: initialStatus } =
            location.state || {};

        if (!invoiceUrl || !externalId) {
            navigate("/keranjang");
            return;
        }

        const normalizedStatus = String(initialStatus || "PENDING").toUpperCase();

        setPaymentData({
            invoiceUrl,
            externalId,
            amount,
            ongkir,
            status: normalizedStatus,
        });

        setStatus(normalizedStatus);

        setShouldPoll(!["PAID", "SETTLED", "EXPIRED"].includes(normalizedStatus));

        setLoading(false);
    }, [isLoggedIn, location.state, navigate]);

    useEffect(() => {
        if (!shouldPoll || !paymentData?.externalId) {
            return;
        }

        checkPaymentStatus(paymentData.externalId);

        const interval = setInterval(() => {
            checkPaymentStatus(paymentData.externalId);
        }, 5000);

        const onFocus = () => {
            checkPaymentStatus(paymentData.externalId);
        };

        window.addEventListener("focus", onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [shouldPoll, paymentData?.externalId]);

    useEffect(() => {
        if (!isPaid) return;

        const timer = setTimeout(() => {
            window.dispatchEvent(new Event("cart:update"));
        }, 2000);

        return () => clearTimeout(timer);
    }, [isPaid]);

    return {
        navigate,
        isLoggedIn,
        paymentData,
        loading,
        status,
        syncing,
        errorMsg,
        isPaid,
        isExpired,
        isPending,
        formatPrice,
        statusInfo: getStatusConfig(),
        checkPaymentStatus,
    };
}
