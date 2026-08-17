import { useState } from "react";

import { MAX_PRODUCT_IMAGES } from "../utils/productImages.js";

export default function useProductForm({ form, onChange, onError, onImageUpload, editingId }) {
    const [uploading, setUploading] = useState(false);

    const isEdit = Boolean(editingId);

    const modalDiketik = Number(String(form.hargaModal || "").replace(/\D/g, "") || "0");
    const modalAwal = Number(form.hargaModalAwal) || 0;
    const modalBerubah = isEdit && modalDiketik !== modalAwal;

    /* Dipakai bersama oleh harga jual dan harga modal:
       keduanya diketik sebagai angka lalu ditampilkan berformat ribuan. */
    const handleMoneyChange = (field) => (event) => {
        const rawValue = event.target.value.replace(/\D/g, "");

        const formattedValue = rawValue
            ? new Intl.NumberFormat("id-ID").format(Number(rawValue))
            : "";

        onChange({
            ...form,
            [field]: formattedValue,
        });
    };

    const handlePriceChange = handleMoneyChange("harga");

    const handleCostChange = handleMoneyChange("hargaModal");

    const applyGambarList = (nextList) => {
        const gambarList = nextList.slice(0, MAX_PRODUCT_IMAGES);
        onChange((prev) => ({
            ...prev,
            gambarList,
            gambar: gambarList[0] || "",
        }));
    };

    const handleImageChange = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (!files.length) return;

        const current = Array.isArray(form.gambarList) ? [...form.gambarList] : [];
        const slots = MAX_PRODUCT_IMAGES - current.length;

        if (slots <= 0) {
            onError(`Maksimal ${MAX_PRODUCT_IMAGES} gambar per produk.`);
            return;
        }

        const accepted = files.slice(0, slots);
        const maxSize = 5 * 1024 * 1024;

        for (const file of accepted) {
            if (!file.type.startsWith("image/")) {
                onError("File harus berupa gambar.");
                return;
            }

            if (file.size > maxSize) {
                onError("Ukuran gambar maksimal 5 MB.");
                return;
            }
        }

        try {
            setUploading(true);

            const uploaded = [...current];

            for (const file of accepted) {
                const uploadedUrl = await onImageUpload(file);
                if (uploadedUrl && !uploaded.includes(uploadedUrl)) {
                    uploaded.push(uploadedUrl);
                }
            }

            applyGambarList(uploaded);
        } catch (error) {
            console.error("[ProductForm] Upload error:", error);
            onError("Upload gambar gagal");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        const current = Array.isArray(form.gambarList) ? [...form.gambarList] : [];
        current.splice(index, 1);
        applyGambarList(current);
    };

    const moveImage = (index, direction) => {
        const current = Array.isArray(form.gambarList) ? [...form.gambarList] : [];
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= current.length) return;
        const [item] = current.splice(index, 1);
        current.splice(nextIndex, 0, item);
        applyGambarList(current);
    };

    const setVarian = (idx, patch) => {
        const next = Array.isArray(form.varian) ? [...form.varian] : [];

        next[idx] = { ...next[idx], ...patch };

        onChange({ ...form, varian: next });
    };

    const addVarian = () => {
        const next = Array.isArray(form.varian) ? [...form.varian] : [];

        next.push({
            id: undefined,
            nama: "",
            harga: "",
            hargaModal: "",
            stock: "0",
            aktif: true,
        });

        onChange({ ...form, varian: next });
    };

    const removeVarian = (idx) => {
        const next = Array.isArray(form.varian) ? [...form.varian] : [];

        const item = next[idx];

        // Varian yang sudah tersimpan cukup ditandai — penghapusan fisik
        // tidak dilakukan agar riwayat pesanan tetap utuh.
        if (item?.id) {
            next[idx] = { ...item, _removed: true };
        } else {
            next.splice(idx, 1);
        }

        onChange({ ...form, varian: next });
    };

    return {
        uploading,
        isEdit,
        modalBerubah,
        handlePriceChange,
        handleCostChange,
        handleImageChange,
        removeImage,
        moveImage,
        setVarian,
        addVarian,
        removeVarian,
    };
}
