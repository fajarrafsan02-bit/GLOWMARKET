import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getQuantity, getPrice } from "../utils/cartItem.js";
import {
    tarifOngkirTerpilih,
    estimasiHariTerpilih,
    opsiTermurah,
    isSameCourier,
} from "../utils/ongkir.js";

export default function useCheckout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated: isLoggedIn, user, loading: authLoading } = useAuth();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("error");

    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState(
        () => location.state?.selectedAddressId || null,
    );

    const [ongkirEstimasi, setOngkirEstimasi] = useState(null);
    const [ongkirEstimasiLoading, setOngkirEstimasiLoading] = useState(false);

    const [pilihanKurir, setPilihanKurir] = useState(() => location.state?.pilihanKurir || null);
    const [ubahKurir, setUbahKurir] = useState(false);

    const [perluVerifikasiEmail, setPerluVerifikasiEmail] = useState(false);

    const [voucherKode, setVoucherKode] = useState("");
    const [voucherInfo, setVoucherInfo] = useState(null);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [vouchersSaya, setVouchersSaya] = useState([]);

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState(null);

    // Ditampilkan sebagai overlay penuh layar saat invoice sedang dibuat &
    // sebelum redirect ke Xendit — beda dari `processing` yang hanya
    // menonaktifkan tombol, ini menutup seluruh halaman supaya pembeli tidak
    // mengira tombolnya tidak merespons selama jeda create-invoice+redirect.
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (authLoading || !isLoggedIn) {
            return;
        }

        loadCart();
        loadUserData();
        muatVouchersSaya();
        muatMetodePembayaran();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, authLoading]);

    const muatMetodePembayaran = async () => {
        try {
            setPaymentMethodsLoading(true);
            const res = await api.get("/api/payments/methods");
            const list = Array.isArray(res.data?.data) ? res.data.data : [];
            setPaymentMethods(list);
        } catch (error) {
            console.error("[Checkout] Load payment methods error:", error);
            setPaymentMethods([]);
        } finally {
            setPaymentMethodsLoading(false);
        }
    };

    /*
     * Estimasi ongkir dihitung lewat endpoint yang sama dipakai halaman
     * Keranjang dan yang benar-benar dipakai server saat invoice dibuat
     * (OngkirCalculationService) — supaya angka yang tampil di sini tidak
     * pernah berbeda dari yang benar-benar ditagih.
     */
    useEffect(() => {
        if (!selectedAddress || items.length === 0) {
            setOngkirEstimasi(null);
            return;
        }

        let batal = false;

        const muatEstimasi = async () => {
            try {
                setOngkirEstimasiLoading(true);
                const res = await api.post("/api/ongkir/estimasi", {
                    alamatId: selectedAddress,
                });
                if (!batal) {
                    setOngkirEstimasi(res.data?.data || null);
                }
            } catch (error) {
                console.error("[Checkout] Estimasi ongkir error:", error);
                if (!batal) {
                    setOngkirEstimasi(null);
                }
            } finally {
                if (!batal) {
                    setOngkirEstimasiLoading(false);
                }
            }
        };

        muatEstimasi();

        return () => {
            batal = true;
        };
    }, [selectedAddress, items]);

    useEffect(() => {
        if (!ongkirEstimasi) return;

        const opsi = ongkirEstimasi?.opsi;
        if (!Array.isArray(opsi) || opsi.length === 0) {
            setPilihanKurir(null);
            return;
        }

        setPilihanKurir((prev) => {
            const candidate = prev || location.state?.pilihanKurir;
            if (candidate) {
                const found = opsi.find((o) => isSameCourier(o, candidate));
                if (found) {
                    return found;
                }
            }
            const termurah = opsiTermurah(opsi);
            return termurah || null;
        });
    }, [ongkirEstimasi, location.state]);

    const loadUserData = async () => {
        try {
            const response = await api.get("/api/alamat");

            const addressList = Array.isArray(response.data?.data) ? response.data.data : [];

            setAddresses(addressList);

            const stateAddrId = location.state?.selectedAddressId;
            const existsInList =
                stateAddrId && addressList.some((a) => String(a.id) === String(stateAddrId));

            if (existsInList) {
                setSelectedAddress(stateAddrId);
            } else {
                const defaultAddress = addressList.find((address) => address.isDefault);

                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.id);
                } else if (addressList.length > 0) {
                    setSelectedAddress(addressList[0].id);
                }
            }
        } catch (error) {
            console.error("Could not load addresses:", error);
        }
    };

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/keranjang");

            const data = Array.isArray(response.data?.data) ? response.data.data : [];

            if (data.length === 0) {
                navigate("/keranjang");
                return;
            }

            setItems(data);
        } catch (error) {
            console.error("[Checkout] Load cart error:", error);

            setError("Gagal memuat keranjang.");
        } finally {
            setLoading(false);
        }
    };

    const selectedAddressObj = addresses.find(
        (address) => String(address.id) === String(selectedAddress),
    );

    const totalQuantity = useMemo(() => {
        return items.reduce((sum, item) => sum + getQuantity(item), 0);
    }, [items]);

    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => sum + getPrice(item) * getQuantity(item), 0);
    }, [items]);

    const ongkirCost = tarifOngkirTerpilih(ongkirEstimasi, pilihanKurir);
    const hariEstimasi = estimasiHariTerpilih(ongkirEstimasi, pilihanKurir);

    const diskonVoucher = voucherInfo?.diskon || 0;

    const grandTotal = totalPrice + ongkirCost - diskonVoucher;

    const applyVoucher = async (kode = voucherKode) => {
        if (!kode.trim()) {
            showNotice("Masukkan kode voucher.", "error");
            return;
        }

        setVoucherLoading(true);
        setVoucherInfo(null);

        try {
            const res = await api.post("/api/vouchers/check", {
                kode: kode.trim(),
                subtotal: String(totalPrice),
            });

            if (res.data?.success && res.data?.data) {
                setVoucherInfo(res.data.data);
                showNotice(res.data.message || "Voucher berhasil dipakai.", "success");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Voucher tidak valid.";
            setVoucherInfo(null);
            showNotice(message, "error");
        } finally {
            setVoucherLoading(false);
        }
    };

    const removeVoucher = () => {
        setVoucherKode("");
        setVoucherInfo(null);
    };

    const muatVouchersSaya = async () => {
        try {
            const res = await api.get("/api/poin");
            const data = res.data?.data;
            const list = Array.isArray(data?.vouchers) ? data.vouchers : [];
            const now = Date.now();
            setVouchersSaya(
                list.filter(
                    (v) =>
                        v.aktif &&
                        v.terpakai < (v.kuota ?? Infinity) &&
                        (!v.berlakuSampai || new Date(v.berlakuSampai).getTime() > now),
                ),
            );
        } catch {
            setVouchersSaya([]);
        }
    };

    const showNotice = (message, type = "error", duration = 4000) => {
        setNotice(message);
        setNoticeType(type);

        setTimeout(() => {
            setNotice("");
        }, duration);
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            const message = "Pilih alamat pengiriman terlebih dahulu.";

            setError(message);
            showNotice(message, "error");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        if (!Array.isArray(items) || items.length === 0) {
            const message = "Keranjang kosong.";

            setError(message);
            showNotice(message, "error");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        if (!paymentMethod) {
            const message = "Pilih metode pembayaran terlebih dahulu.";

            setError(message);
            showNotice(message, "error");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        setProcessing(true);
        setError("");

        try {
            const userEmail = user?.email || "";
            const userName = user?.namaLengkap || "Customer";

            const selectedAddr = addresses.find(
                (address) => String(address.id) === String(selectedAddress),
            );

            const computedAmount = items.reduce(
                (sum, item) => sum + getPrice(item) * getQuantity(item),
                0,
            );

            const paymentData = {
                amount: Math.round(computedAmount + ongkirCost),
                ongkir: Math.round(ongkirCost),
                customerName: selectedAddr?.namaLengkap || userName,
                customerEmail: userEmail,
                customerPhone: selectedAddr?.nomorTelepon || "",
                description: `Pembelian ${items.length} produk emas`,
                alamatId: parseInt(selectedAddress, 10),
                catatan: selectedAddr?.catatan || "",
                kurirCode: pilihanKurir?.kurirCode || undefined,
                layanan: pilihanKurir?.layanan || undefined,
                kodeVoucher: voucherInfo?.kode || undefined,
                paymentMethod,
            };

            const response = await api.post("/api/payments/create-invoice", paymentData);

            if (response.data?.success && response.data?.data) {
                const payment = response.data.data;

                // Keranjang sudah dikosongkan server saat pesanan dibuat,
                // jadi badge di header perlu ikut disegarkan.
                window.dispatchEvent(new Event("cart:update"));

                if (!payment.invoiceUrl) {
                    throw new Error("Gagal membuat invoice");
                }

                // Overlay penuh layar dulu — create-invoice + redirect ke
                // domain Xendit ada jeda, tanpa ini terasa seperti tombol
                // tidak merespons. Tab yang sama (bukan tab baru); setelah
                // pembayaran selesai/gagal Xendit mengarahkan balik otomatis
                // ke /payment-status/:externalId (lihat XenditService).
                setRedirecting(true);
                window.location.href = payment.invoiceUrl;

                return;
            }

            throw new Error("Gagal membuat invoice");
        } catch (error) {
            console.error("[Checkout] Payment error:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                (Array.isArray(error.response?.data?.errors)
                    ? error.response.data.errors.join(", ")
                    : null) ||
                error.message ||
                "Gagal memproses pembayaran.";

            // Server menolak karena email belum terbukti — tampilkan panel
            // verifikasi, bukan sekadar pesan merah yang buntu.
            if (message.toLowerCase().includes("verifikasi email")) {
                setPerluVerifikasiEmail(true);
            }

            setError(message);
            showNotice(message, "error", 5000);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setProcessing(false);
        }
    };

    return {
        authLoading,
        user,
        items,
        loading,
        processing,
        error,
        setError,
        notice,
        noticeType,
        showNotice,
        addresses,
        selectedAddress,
        setSelectedAddress,
        selectedAddressObj,
        ongkirEstimasi,
        ongkirEstimasiLoading,
        pilihanKurir,
        setPilihanKurir,
        ubahKurir,
        setUbahKurir,
        perluVerifikasiEmail,
        setPerluVerifikasiEmail,
        voucherKode,
        setVoucherKode,
        voucherInfo,
        voucherLoading,
        vouchersSaya,
        applyVoucher,
        removeVoucher,
        totalQuantity,
        totalPrice,
        ongkirCost,
        hariEstimasi,
        diskonVoucher,
        grandTotal,
        paymentMethods,
        paymentMethodsLoading,
        paymentMethod,
        setPaymentMethod,
        redirecting,
        handleCheckout,
    };
}
