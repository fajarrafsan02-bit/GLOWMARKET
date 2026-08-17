import { useState } from "react";

import { getLocalDateString, toMoney } from "../utils/format.js";

export const barisKosong = () => ({
    produkId: "",
    qty: "1",
    hargaBeli: "",
});

/**
 * State & logic form pembelian stok.
 * Logic / business flow TIDAK DIUBAH.
 */
export default function usePembelianForm(onSubmit) {
    const [showForm, setShowForm] = useState(false);

    const [tanggal, setTanggal] = useState(() => getLocalDateString());

    const [pemasok, setPemasok] = useState("");

    const [catatan, setCatatan] = useState("");

    const [metode, setMetode] = useState("TUNAI");

    const [items, setItems] = useState([barisKosong()]);

    const total = items.reduce(
        (jumlah, item) => jumlah + toMoney(item.hargaBeli) * (Number(item.qty) || 0),
        0,
    );

    const ubahItem = (index, patch) => {
        setItems((sebelumnya) =>
            sebelumnya.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          ...patch,
                      }
                    : item,
            ),
        );
    };

    const tambahBaris = () => setItems((sebelumnya) => [...sebelumnya, barisKosong()]);

    const hapusBaris = (index) =>
        setItems((sebelumnya) =>
            sebelumnya.length > 1 ? sebelumnya.filter((_, i) => i !== index) : sebelumnya,
        );

    const reset = () => {
        setPemasok("");
        setCatatan("");
        setMetode("TUNAI");
        setItems([barisKosong()]);
        setShowForm(false);
    };

    const simpan = async (event) => {
        event.preventDefault();

        const payload = {
            tanggal,
            pemasok: pemasok.trim() || null,
            catatan: catatan.trim() || null,
            metode,
            items: items
                .filter((item) => item.produkId)
                .map((item) => ({
                    produkId: Number(item.produkId),
                    qty: Number(item.qty),
                    hargaBeli: toMoney(item.hargaBeli),
                })),
        };

        const berhasil = await onSubmit(payload);

        if (berhasil) {
            reset();
        }
    };

    return {
        showForm,
        setShowForm,
        tanggal,
        setTanggal,
        pemasok,
        setPemasok,
        catatan,
        setCatatan,
        metode,
        setMetode,
        items,
        setItems,
        ubahItem,
        tambahBaris,
        hapusBaris,
        total,
        simpan,
    };
}
