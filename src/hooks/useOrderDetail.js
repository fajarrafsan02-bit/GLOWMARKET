import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getStatusStep } from "../utils/orderTimeline.js";
import { toMoney } from "../utils/format.js";

export default function useOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [beliLagiLoading, setBeliLagiLoading] = useState(false);
    const [beliLagiError, setBeliLagiError] = useState("");
    const [userAddr, setUserAddr] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const loadOrderDetail = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/pesanan/${id}`);
                setOrder(res.data?.data || res.data || null);
            } catch (err) {
                console.error("Error loading order detail:", err);
                setError(err?.response?.data?.message || "Gagal memuat detail pesanan");
            } finally {
                setLoading(false);
            }
        };

        loadOrderDetail();
    }, [id, navigate, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const loadUserAddress = async () => {
            try {
                const res = await api.get("/api/alamat");
                const list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                      ? res.data
                      : [];
                const defaultAddr = list.find((x) => x.isDefault || x.is_default) || list[0];
                setUserAddr(defaultAddr || null);
            } catch (error) {
                console.warn("Gagal memuat alamat pengguna untuk detail pesanan:", error);
            }
        };
        loadUserAddress();
    }, [isAuthenticated]);

    const currentStep = order ? getStatusStep(order.status) : 0;

    const items = Array.isArray(order?.items) ? order.items : [];
    const totalItems = items.reduce((sum, it) => sum + (it.quantity || it.jumlah || 1), 0);
    const subtotal = items.reduce((sum, it) => {
        if (it.subtotal != null) {
            return sum + toMoney(it.subtotal);
        }
        return sum + toMoney(it.hargaSatuan ?? it.harga) * (it.quantity || it.jumlah || 1);
    }, 0);
    const ongkir = toMoney(order?.ongkir);
    const totalBayar =
        order?.totalHarga != null
            ? toMoney(order.totalHarga)
            : toMoney(order?.total) || subtotal + ongkir;

    const recipientName = order?.customerName || userAddr?.namaLengkap || "Pelanggan";
    const baseAddress =
        order?.shippingAddress || order?.alamatLengkap || userAddr?.alamatLengkap || "-";
    const fullAddress = [
        baseAddress,
        userAddr?.kelurahan || order?.kelurahan,
        userAddr?.kecamatan || order?.kecamatan,
        userAddr?.kota || userAddr?.kabupaten || order?.kota,
        userAddr?.provinsi || order?.provinsi,
        userAddr?.kodePos || order?.kodePos,
    ]
        .filter(Boolean)
        .join(", ");
    const phone = order?.customerPhone || userAddr?.nomorTelepon || "-";

    const beliLagi = async () => {
        if (!items.length || beliLagiLoading) {
            return;
        }

        setBeliLagiError("");
        setBeliLagiLoading(true);

        try {
            let ditambah = 0;

            for (const item of items) {
                const produkId = item.produkId;
                if (!produkId) {
                    continue;
                }

                await api.post("/api/keranjang", {
                    produkId,
                    variantId: item.variantId || null,
                    quantity: item.quantity || item.jumlah || 1,
                });
                ditambah += 1;
            }

            if (ditambah === 0) {
                setBeliLagiError("Produk pesanan ini tidak bisa dibeli ulang.");
                return;
            }

            navigate("/keranjang");
        } catch (err) {
            setBeliLagiError(
                err?.response?.data?.message || "Gagal menambahkan ke keranjang",
            );
        } finally {
            setBeliLagiLoading(false);
        }
    };

    return {
        order,
        loading,
        error,
        currentStep,
        items,
        totalItems,
        subtotal,
        ongkir,
        totalBayar,
        recipientName,
        fullAddress,
        phone,
        beliLagi,
        beliLagiLoading,
        beliLagiError,
    };
}
