import { useEffect, useState } from "react";
import api from "../api/Axios.jsx";
import { formatPrice, toMoney } from "../utils/format.js";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

export default function useDashboardData() {
    const [stats, setStats] = useState([
        {
            icon: TrendingUp,
            value: "Rp 0",
            label: "Total Penjualan Bulan Ini",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
        },
        {
            icon: ShoppingBag,
            value: "0",
            label: "Pesanan Baru",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
        },
        {
            icon: Users,
            value: "0",
            label: "Total Pelanggan",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
        },
        {
            icon: Package,
            value: "0",
            label: "Produk Terjual",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
        },
    ]);

    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [orderStatusCounts, setOrderStatusCounts] = useState({
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        returned: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const year = new Date().getFullYear();

            // 1. Fetch Grafik Data
            try {
                // Endpoint ini memang bernama "12-bulan-terakhir": grafiknya berjalan
                // mundur dari bulan ini, bukan Januari–Desember tahun berjalan.
                const res = await api.get("/api/statistik/grafik/12-bulan-terakhir");
                const arr = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : Array.isArray(res?.data)
                      ? res.data
                      : [];
                // Rentangnya melewati pergantian tahun, jadi urutannya harus
                // memakai tahun dulu — mengurutkan berdasarkan nomor bulan saja
                // akan melempar Januari tahun ini ke depan Desember tahun lalu.
                const sorted = arr
                    .filter((x) => typeof x?.bulan === "number")
                    .sort(
                        (a, b) =>
                            Number(a.tahun || 0) - Number(b.tahun || 0) ||
                            Number(a.bulan) - Number(b.bulan),
                    );

                const lintasTahun = new Set(sorted.map((x) => x.tahun)).size > 1;

                const lbls = sorted.map((x) => {
                    const nama =
                        x.namaBulan ||
                        new Date(x.tahun || year, x.bulan - 1, 1).toLocaleString("id-ID", {
                            month: "long",
                        });
                    return lintasTahun ? `${nama} ${String(x.tahun).slice(-2)}` : nama;
                });
                const sales = sorted.map((x) => toMoney(x.totalPenjualan));
                const products = sorted.map((x) => Number(x.totalProdukTerjual || 0));
                setLabels(lbls);
                setSalesData(sales);
                setProductData(products);
            } catch (error) {
                console.error("[Dashboard] Gagal mengambil data grafik:", error);
                console.error("[Dashboard] Error details:", error.response?.data || error.message);
                setLabels([]);
                setSalesData([]);
                setProductData([]);
            }

            // 2. Fetch Total Pelanggan
            try {
                const res = await api.get("/api/user/total-pelanggan");
                const raw = res?.data?.data ?? res?.data;
                const count = typeof raw === "number" ? raw : (raw?.total ?? raw?.count ?? 0);

                setStats((prev) =>
                    prev.map((s) =>
                        s.label === "Total Pelanggan" ? { ...s, value: String(count) } : s,
                    ),
                );
            } catch (error) {
                console.warn("[Dashboard] Gagal mengambil total pelanggan:", error.message);
                console.error("[Dashboard] Error response:", error.response?.data);
                setStats((prev) =>
                    prev.map((s) => (s.label === "Total Pelanggan" ? { ...s, value: "0" } : s)),
                );
            }

            // 3. Fetch Statistik Bulan Ini (Penjualan, Produk, Pesanan)
            try {
                // Penjualan
                try {
                    const penRes = await api.get("/api/statistik/penjualan/bulan-ini");
                    const pen = penRes?.data?.data ?? penRes?.data;
                    const totalPenjualan = toMoney(pen?.totalPenjualan);
                    const persen = pen?.persenPenjualan ?? 0;
                    const change = persen
                        ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%`
                        : "";
                    setStats((prev) =>
                        prev.map((s) =>
                            s.label === "Total Penjualan Bulan Ini"
                                ? { ...s, value: totalPenjualan, change }
                                : s,
                        ),
                    );
                } catch (err) {
                    console.warn(
                        "[Dashboard] Gagal mengambil data penjualan bulan ini:",
                        err.message,
                    );
                    setStats((prev) =>
                        prev.map((s) =>
                            s.label === "Total Penjualan Bulan Ini"
                                ? { ...s, value: "Rp 0", change: "" }
                                : s,
                        ),
                    );
                }

                // Produk Terjual
                try {
                    const prodRes = await api.get("/api/statistik/produk-terjual/bulan-ini");
                    const prod = prodRes?.data?.data ?? prodRes?.data;
                    const total = prod?.totalJenisProduk ?? 0;
                    const persen = prod?.persenProduk ?? 0;
                    const change = persen
                        ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%`
                        : "";
                    setStats((prev) =>
                        prev.map((s) =>
                            s.label === "Produk Terjual"
                                ? { ...s, value: String(total), change }
                                : s,
                        ),
                    );
                } catch (err) {
                    console.warn(
                        "[Dashboard] Gagal mengambil data produk terjual bulan ini:",
                        err.message,
                    );
                    setStats((prev) =>
                        prev.map((s) =>
                            s.label === "Produk Terjual" ? { ...s, value: "0", change: "" } : s,
                        ),
                    );
                }

                // Pesanan Baru
                try {
                    const ordRes = await api.get("/api/statistik/pesanan/bulan-ini");
                    const ord = ordRes?.data?.data ?? ordRes?.data;
                    const total = ord?.totalPesanan ?? 0;
                    const persen = ord?.persenPesanan ?? 0;
                    const change = persen
                        ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%`
                        : "";
                    setStats((prev) =>
                        prev.map((s) =>
                            s.label === "Pesanan Baru" ? { ...s, value: String(total), change } : s,
                        ),
                    );
                } catch (err) {
                    console.warn(
                        "[Dashboard] Gagal mengambil data pesanan baru bulan ini:",
                        err.message,
                    );
                    setStats((prev) =>
                        prev.map((s) =>
                            s.label === "Pesanan Baru" ? { ...s, value: "0", change: "" } : s,
                        ),
                    );
                }
            } catch (error) {
                console.error("[Dashboard] Gagal mengambil statistik bulan ini:", error);
                console.error("[Dashboard] Error details:", error.response?.data || error.message);
            }

            // 4. Fetch Produk Terlaris
            try {
                const res = await api.get("/api/terjual-produk");
                const arr = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : Array.isArray(res?.data)
                      ? res.data
                      : [];
                const sorted = arr
                    .filter((p) => Number(p?.terjual || 0) > 0)
                    .sort((a, b) => Number(b?.terjual || 0) - Number(a?.terjual || 0))
                    .slice(0, 5)
                    .map((p, idx) => ({
                        rank: idx + 1,
                        id: p.produkId ?? p.id,
                        name: p.namaProduk || `Produk ${p.produkId || ""}`,
                        price: formatPrice(p.harga),
                        sales: Number(p.terjual || 0),
                        karat: p.karatEmas ? `${p.karatEmas}K` : "",
                        image: p.gambar || "",
                    }));
                setBestSellingProducts(sorted);
            } catch (error) {
                console.warn("[Dashboard] Gagal mengambil produk terlaris:", error.message);
                console.error("[Dashboard] Error response:", error.response?.data);
                setBestSellingProducts([]);
            }

            // 5. Fetch Data Real Status Pesanan (ORI Data)
            try {
                const res = await api.get("/api/pesanan");
                const allOrders = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : Array.isArray(res?.data)
                      ? res.data
                      : [];

                let pending = 0;
                let processing = 0;
                let shipped = 0;
                let completed = 0;
                let returned = 0;

                allOrders.forEach((o) => {
                    const st = String(o.status || "").toUpperCase();
                    if (["PENDING", "UNPAID", "CREATED", "DIBUAT"].includes(st)) {
                        pending++;
                    } else if (
                        ["PAID", "SETTLED", "DIKEMAS", "DIPROSES", "PROCESSING", "PACKED"].includes(
                            st,
                        )
                    ) {
                        processing++;
                    } else if (["DIKIRIM", "SHIPPED", "KIRIM"].includes(st)) {
                        shipped++;
                    } else if (["SELESAI", "COMPLETED", "DELIVERED"].includes(st)) {
                        completed++;
                    } else if (["DIKEMBALIKAN", "RETURNED", "REFUNDED"].includes(st)) {
                        returned++;
                    }
                });

                setOrderStatusCounts({
                    pending,
                    processing,
                    shipped,
                    completed,
                    returned,
                });
            } catch (error) {
                console.warn("[Dashboard] Gagal mengambil data status pesanan:", error.message);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return { stats, labels, salesData, productData, bestSellingProducts, orderStatusCounts };
}
