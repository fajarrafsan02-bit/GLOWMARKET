import { useEffect, useState } from "react";
import api from "../api/Axios.jsx";

/**
 * Nilai bawaan dipakai selama data belum termuat
 * atau bila admin mengosongkan field pengaturan.
 */
const DEFAULTS = {
    name: "GlowMarket",
    tagline: "Perhiasan Emas Asli Berkualitas",
    description:
        "Toko perhiasan emas yang menghadirkan koleksi berkualitas dengan pengalaman belanja yang aman dan nyaman.",
    phone: "+62 22 1234 5678",
    email: "info@fajargold.com",
    whatsapp: "",
    instagram: "",
    address: "Jl. Ahmad Yani No. 197, Bandung",
    logo: "",
};

/* Cache level modul supaya endpoint publik cukup dipanggil sekali
   walau dipakai di banyak komponen (header, footer, tentang, kontak). */
let cachedStore = null;
let inflightRequest = null;

/** Logo hanya dipakai bila benar-benar berupa URL gambar. */
function isUsableLogo(value) {
    return /^(https?:\/\/|\/)/i.test(String(value).trim());
}

function normalize(raw) {
    const store = { ...DEFAULTS };

    Object.entries(raw || {}).forEach(([key, value]) => {
        if (!key.startsWith("store.")) return;

        const field = key.slice("store.".length);

        if (value === null || value === undefined || String(value).trim() === "") {
            return;
        }

        // Nilai logo yang bukan URL diabaikan supaya tidak jadi gambar rusak
        if (field === "logo" && !isUsableLogo(value)) {
            return;
        }

        store[field] = String(value).trim();
    });

    return store;
}

function fetchStore() {
    if (cachedStore) {
        return Promise.resolve(cachedStore);
    }

    if (!inflightRequest) {
        inflightRequest = api
            .get("/api/settings/public")
            .then((response) => {
                cachedStore = normalize(response?.data?.data);

                return cachedStore;
            })
            .catch((error) => {
                console.debug("Gagal memuat pengaturan toko:", error);

                return { ...DEFAULTS };
            })
            .finally(() => {
                inflightRequest = null;
            });
    }

    return inflightRequest;
}

/**
 * Membuang cache agar pengambilan berikutnya memakai data terbaru.
 *
 * Dipanggil setelah admin menyimpan pengaturan toko; tanpa ini, nilai lama
 * bertahan sampai halaman dimuat ulang penuh karena cache-nya level modul.
 */
export function invalidateStoreSettings() {
    cachedStore = null;
    inflightRequest = null;
    window.dispatchEvent(new Event("store-settings:update"));
}

/**
 * Data identitas toko dari halaman Pengaturan admin.
 */
export default function useStoreSettings() {
    const [store, setStore] = useState(() => cachedStore || { ...DEFAULTS });

    useEffect(() => {
        let active = true;

        const load = () =>
            fetchStore().then((data) => {
                if (active) {
                    setStore(data);
                }
            });

        load();

        window.addEventListener("store-settings:update", load);

        return () => {
            active = false;
            window.removeEventListener("store-settings:update", load);
        };
    }, []);

    useEffect(() => {
        const logoUrl = store?.logo || "/logo-mark.png";
        let link = document.querySelector("link[rel='icon']");
        if (link) {
            link.href = logoUrl;
        }
    }, [store?.logo]);

    return store;
}

export { DEFAULTS as STORE_DEFAULTS };
