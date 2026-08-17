import { useState, useEffect, useCallback, useMemo } from "react";

import api from "../api/Axios.jsx";
import { toMoney } from "../utils/format.js";
import { getProductImages } from "../utils/productImages.js";

export const emptyForm = () => ({
    nama: "",
    deskripsi: "",
    gambar: "",
    gambarList: [],
    kategori: "",
    harga: "",
    hargaModal: "",
    hargaModalAwal: 0,
    stock: "0",
    karatEmas: "",
    beratGram: "",
    status: "TERSEDIA",
    varian: [],
});

export default function useAdminProducts() {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm());

    /* Kosong berarti semua status. */
    const [statusFilter, setStatusFilter] = useState("");

    const [quickSaving, setQuickSaving] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get(
                statusFilter ? `/api/produk/status/${statusFilter}` : "/api/produk",
            );

            setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengambil data produk");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    const searchProducts = useCallback(async (nama) => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/api/produk/search", {
                params: {
                    nama,
                },
            });

            setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mencari produk");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const value = query.trim();

            if (value) {
                searchProducts(value);
            } else {
                fetchProducts();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchProducts, fetchProducts]);

    const summary = useMemo(() => {
        const total = items.length;

        const available = items.filter(
            (product) => String(product.status || "").toUpperCase() === "TERSEDIA",
        ).length;

        const lowStock = items.filter((product) => {
            const stock = Number(product.stock ?? product.stok ?? 0);

            return stock > 0 && stock <= 5;
        }).length;

        const outOfStock = items.filter(
            (product) => Number(product.stock ?? product.stok ?? 0) <= 0,
        ).length;

        return {
            total,
            available,
            lowStock,
            outOfStock,
        };
    }, [items]);

    const openCreate = () => {
        setForm(emptyForm());
        setEditingId(null);
        setShowForm(true);
        setError("");
    };

    const openEdit = (product) => {
        const gambarList = getProductImages(product);

        setForm({
            nama: product.nama || "",
            deskripsi: product.deskripsi || "",
            gambar: gambarList[0] || "",
            gambarList,
            kategori: product.kategori || "",
            harga:
                product.harga != null && product.harga !== ""
                    ? new Intl.NumberFormat("id-ID").format(toMoney(product.harga))
                    : "",
            hargaModal:
                product.hargaModal != null && product.hargaModal !== ""
                    ? new Intl.NumberFormat("id-ID").format(toMoney(product.hargaModal))
                    : "",
            hargaModalAwal: toMoney(product.hargaModal),
            stock: product.stock ?? 0,
            karatEmas: product.karatEmas ?? "",
            beratGram: product.beratGram ?? "",
            status: product.status || "TERSEDIA",
            varian: Array.isArray(product.varian)
                ? product.varian.map((v) => ({
                      id: v.id,
                      nama: v.nama || "",
                      harga: v.harga ?? "",
                      hargaModal: v.hargaModal ?? "",
                      stock: v.stock ?? "0",
                      aktif: v.aktif !== false,
                  }))
                : [],
        });

        setEditingId(product.id);
        setShowForm(true);
        setError("");
    };

    const tryUploadImage = async (file) => {
        const formData = new FormData();

        formData.append("file", file);

        const res = await api.post("/api/produk/upload-image", formData);

        const url = res.data?.imageUrl;

        if (!url) {
            throw new Error("Upload gagal: URL gambar tidak ditemukan");
        }

        return String(url);
    };

    const saveVarian = async (productId) => {
        const varianList = Array.isArray(form.varian) ? form.varian : [];

        for (const v of varianList) {
            const payload = {
                nama: String(v.nama || "").trim(),
                harga: Number(v.harga) || 0,
                hargaModal: Number(v.hargaModal) || 0,
                stock: Number(v.stock) || 0,
                aktif: v.aktif !== false,
            };

            if (v._removed) {
                if (v.id) {
                    await api.delete(`/api/produk/varian/${v.id}`);
                }
                continue;
            }

            if (v.id) {
                await api.put(`/api/produk/varian/${v.id}`, payload);
            } else {
                await api.post(`/api/produk/${productId}/varian`, payload);
            }
        }
    };

    const saveProduct = async (event) => {
        event.preventDefault();

        if (!form.nama.trim()) {
            setError("Nama produk wajib diisi");
            return;
        }

        const hargaNum = Number(String(form.harga).replace(/\./g, ""));

        const hargaModalNum = Number(String(form.hargaModal || "0").replace(/\./g, ""));

        /* Stok tidak diubah lewat form: produk baru selalu 0,
           produk lama memakai angka yang sudah tersimpan. */
        const stockNum = editingId ? Number(form.stock) || 0 : 0;

        const karatNum = Number(form.karatEmas);

        const beratNum = Number(form.beratGram);

        if (Number.isNaN(hargaNum) || hargaNum < 0) {
            setError("Harga harus angka dan tidak boleh negatif");
            return;
        }

        if (Number.isNaN(hargaModalNum) || hargaModalNum < 0) {
            setError("Harga modal harus angka dan tidak boleh negatif");
            return;
        }

        if (Number.isNaN(stockNum) || stockNum < 0) {
            setError("Stock harus angka dan tidak boleh negatif");
            return;
        }

        if (stockNum > 0 && hargaModalNum <= 0) {
            setError(
                "Harga modal wajib diisi jika stok lebih dari nol, supaya nilai persediaan dan HPP tercatat",
            );
            return;
        }

        if (Number.isNaN(karatNum) || karatNum <= 0) {
            setError("Karat emas harus angka dan lebih dari 0");
            return;
        }

        if (Number.isNaN(beratNum) || beratNum <= 0) {
            setError("Berat gram harus angka dan lebih dari 0");
            return;
        }

        /* Varian baru tanpa nama/harga dianggap tidak lengkap. */
        const varianDraf = (form.varian || []).filter((v) => !v._removed);

        for (const v of varianDraf) {
            if (!String(v.nama || "").trim()) {
                setError("Setiap varian wajib diisi nama pilihannya");
                return;
            }
            if (Number(v.harga) < 0) {
                setError("Harga varian tidak boleh negatif");
                return;
            }
        }

        const gambarList = (form.gambarList || []).filter(Boolean);

        const payload = {
            nama: form.nama.trim(),
            deskripsi: form.deskripsi?.trim() ? form.deskripsi.trim() : null,
            gambar: gambarList[0] || null,
            gambarList,
            kategori: form.kategori ? form.kategori : null,
            harga: hargaNum,
            hargaModal: hargaModalNum,
            stock: stockNum,
            karatEmas: karatNum,
            beratGram: beratNum,
            status: form.status,
        };

        try {
            setLoading(true);
            setError("");

            let productId = editingId;

            if (editingId) {
                await api.put(`/api/produk/${editingId}`, payload);
            } else {
                const created = await api.post("/api/produk", payload);

                productId = created.data?.data?.id;
            }

            if (productId) {
                await saveVarian(productId);
            }

            setShowForm(false);

            await fetchProducts();
        } catch (err) {
            const message = err.response?.data?.validationErrors
                ? Object.values(err.response.data.validationErrors).join(", ")
                : err.response?.data?.message || "Gagal menyimpan produk";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (product, status) => {
        if (status === product.status) {
            return true;
        }

        try {
            setQuickSaving(true);
            setError("");

            await api.patch(`/api/produk/${product.id}/status`, { status });

            await fetchProducts();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengubah status produk");
            return false;
        } finally {
            setQuickSaving(false);
        }
    };

    const deleteProduct = async (id) => {
        const confirmed = window.confirm("Yakin ingin menghapus produk ini?");

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            await api.delete(`/api/produk/${id}`);

            await fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus produk");
        } finally {
            setLoading(false);
        }
    };

    return {
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
        fetchProducts,
        openCreate,
        openEdit,
        tryUploadImage,
        saveProduct,
        updateStatus,
        deleteProduct,
    };
}
