import { useEffect, useMemo, useState } from "react";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getQuantity, getProductPrice } from "../utils/cartItem.js";
import {
    tarifOngkirTerpilih,
    estimasiHariTerpilih,
    opsiTermurah,
    isSameCourier,
} from "../utils/ongkir.js";

export default function useKeranjang() {
    const { isAuthenticated } = useAuth();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [ongkirEstimasi, setOngkirEstimasi] = useState(null);
    const [ongkirLoading, setOngkirLoading] = useState(false);
    const [pilihanKurir, setPilihanKurir] = useState(null);

    const loadCart = async () => {
        if (!isAuthenticated) {
            setItems([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/keranjang");

            const data = Array.isArray(response.data?.data) ? response.data.data : [];

            setItems(data);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Gagal memuat keranjang";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            setAddresses([]);
            setSelectedAddressId(null);
            return;
        }

        let batal = false;

        const muatAlamat = async () => {
            try {
                const res = await api.get("/api/alamat");
                const list = Array.isArray(res.data?.data) ? res.data.data : [];
                if (batal) return;

                setAddresses(list);

                const utama = list.find((a) => a.isDefault) || list[0] || null;
                setSelectedAddressId(utama?.id ?? null);
            } catch (err) {
                if (!batal) {
                    console.error("[Cart] Load alamat error:", err);
                }
            }
        };

        muatAlamat();

        return () => {
            batal = true;
        };
    }, [isAuthenticated]);

    /*
     * Estimasi dihitung ulang tiap kali alamat atau isi keranjang berubah —
     * lewat endpoint yang sama dipakai Checkout sungguhan (OngkirCalculationService
     * di backend), jadi angkanya tidak pernah berbeda dari yang benar-benar
     * ditagih nanti.
     */
    useEffect(() => {
        if (!selectedAddressId || items.length === 0) {
            setOngkirEstimasi(null);
            return;
        }

        let batal = false;

        const muatEstimasi = async () => {
            try {
                setOngkirLoading(true);
                const res = await api.post("/api/ongkir/estimasi", {
                    alamatId: selectedAddressId,
                });
                if (!batal) {
                    setOngkirEstimasi(res.data?.data || null);
                }
            } catch (err) {
                console.error("[Cart] Estimasi ongkir error:", err);
                if (!batal) {
                    setOngkirEstimasi(null);
                }
            } finally {
                if (!batal) {
                    setOngkirLoading(false);
                }
            }
        };

        muatEstimasi();

        return () => {
            batal = true;
        };
    }, [selectedAddressId, items]);

    useEffect(() => {
        if (!ongkirEstimasi) return;

        const opsi = ongkirEstimasi?.opsi;
        if (!Array.isArray(opsi) || opsi.length === 0) {
            setPilihanKurir(null);
            return;
        }

        setPilihanKurir((prev) => {
            if (prev) {
                const found = opsi.find((o) => isSameCourier(o, prev));
                if (found) {
                    return found;
                }
            }
            const termurah = opsiTermurah(opsi);
            return termurah || null;
        });
    }, [ongkirEstimasi]);

    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + getProductPrice(item) * getQuantity(item);
        }, 0);
    }, [items]);

    const ongkirPreview = tarifOngkirTerpilih(ongkirEstimasi, pilihanKurir);
    const hariEstimasi = estimasiHariTerpilih(ongkirEstimasi, pilihanKurir);

    const totalQuantity = useMemo(() => {
        return items.reduce((sum, item) => sum + getQuantity(item), 0);
    }, [items]);

    const showNotice = (message, duration = 2500) => {
        setNotice(message);

        setTimeout(() => {
            setNotice("");
        }, duration);
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity <= 0) {
            await removeItem(id);
            return;
        }

        try {
            await api.patch(`/api/keranjang/${id}`, {
                quantity: newQuantity,
            });

            await loadCart();

            window.dispatchEvent(new Event("cart:update"));
        } catch (err) {
            console.error("[Cart] Update quantity error:", err);

            showNotice("Gagal mengubah jumlah");
        }
    };

    const removeItem = async (id) => {
        try {
            await api.delete(`/api/keranjang/${id}`);

            await loadCart();

            window.dispatchEvent(new Event("cart:update"));

            showNotice("Item dihapus dari keranjang");
        } catch (err) {
            console.error("[Cart] Remove error:", err);

            showNotice("Gagal menghapus item");
        }
    };

    /**
     * Mengosongkan keranjang sekaligus lewat satu permintaan, bukan menghapus
     * satu per satu — kalau di tengah jalan gagal, keranjang tidak akan
     * tertinggal separuh terhapus.
     */
    const clearCart = async () => {
        const yakin = window.confirm("Kosongkan seluruh keranjang?");

        if (!yakin) return;

        try {
            await api.delete("/api/keranjang/clear");

            await loadCart();

            window.dispatchEvent(new Event("cart:update"));

            showNotice("Keranjang dikosongkan");
        } catch (err) {
            console.error("[Cart] Clear error:", err);

            showNotice("Gagal mengosongkan keranjang");
        }
    };

    return {
        isAuthenticated,
        items,
        loading,
        error,
        notice,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        ongkirEstimasi,
        ongkirLoading,
        pilihanKurir,
        setPilihanKurir,
        subtotal,
        ongkirPreview,
        hariEstimasi,
        totalQuantity,
        loadCart,
        showNotice,
        updateQuantity,
        removeItem,
        clearCart,
    };
}
