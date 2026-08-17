import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/Axios.jsx";

const AuthContext = createContext(null);

function normalizeUser(raw) {
    if (!raw) return null;
    return {
        id: raw.id,
        namaLengkap: raw.namaLengkap,
        email: raw.email,
        noHp: raw.noHp,
        role: raw.role,
        /* Ikut disalin karena menentukan apakah panel verifikasi perlu
           ditampilkan. Tanpa baris ini nilainya selalu undefined dan
           pengguna yang emailnya sudah terbukti tetap diminta verifikasi. */
        emailTerverifikasi: raw.emailTerverifikasi,
    };
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Token JWT sekarang ada di cookie httpOnly — JavaScript tidak bisa
 * membacanya sama sekali, jadi "siapa yang login" tidak lagi bisa diketahui
 * secara sinkron dari localStorage seperti dulu. Satu-satunya cara tahu
 * adalah bertanya ke server (GET /api/user/profile, endpoint yang sama
 * dipakai halaman profil), makanya ada `loading` — sesuatu yang tidak pernah
 * dibutuhkan versi lama.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    /*
     * Penanda sesi dibaca sekali saat komponen dibuat, bukan di dalam efek.
     * Nilainya menentukan apakah aplikasi perlu menunggu jawaban server:
     * pengunjung tanpa penanda langsung dianggap selesai memuat, sehingga
     * tidak ada perubahan state susulan hanya untuk mematikan spinner.
     */
    const [punyaSesi] = useState(() => Boolean(localStorage.getItem("app_has_session")));
    const [loading, setLoading] = useState(punyaSesi);

    const refresh = useCallback(async () => {
        let lastError;

        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                const res = await api.get("/api/user/profile", {
                    _skipAuthLogout: true,
                });
                setUser(normalizeUser(res.data?.data));
                localStorage.setItem("app_has_session", "true");
                return;
            } catch (err) {
                lastError = err;
                if (err?.response?.status === 401) {
                    break;
                }
                await sleep(400 * (attempt + 1));
            }
        }

        /*
         * Hanya 401 = cookie/token tidak diterima server. Timeout, 5xx, atau
         * jaringan putus (sering setelah laptop sleep) jangan mengosongkan
         * user yang sudah ada — cookie httpOnly-nya masih di browser.
         */
        if (lastError?.response?.status === 401) {
            setUser(null);
            localStorage.removeItem("app_has_session");
        }
    }, []);

    useEffect(() => {
        /*
         * Hanya bertanya ke server bila ada tanda pernah login sebelumnya.
         * Pengunjung yang benar-benar baru (localStorage kosong) dilewatkan
         * saja — tidak ada cookie untuk dicek, jadi request ini pasti 401
         * dan cuma mengotori console tanpa manfaat.
         *
         * Kalau penanda ini hilang padahal cookie auth masih valid
         * (mis. localStorage dibersihkan manual), pengguna akan tampak
         * belum login sampai mereka login ulang — trade-off yang diterima
         * demi tidak memicu 401 percuma di setiap kunjungan baru.
         */
        if (!punyaSesi) {
            return;
        }

        let batal = false;

        /* Aturan set-state-in-effect menyasar setState yang dijalankan
           serentak saat efek berjalan. Di sini pemanggilannya justru
           tertunda sampai server menjawab — bentuk yang memang dianjurkan
           untuk pengambilan data — tetapi aturannya belum bisa membedakan
           keduanya. */
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refresh().finally(() => {
            // Komponen bisa saja sudah dilepas sebelum server menjawab.
            if (!batal) {
                setLoading(false);
            }
        });

        return () => {
            batal = true;
        };
    }, [refresh, punyaSesi]);

    useEffect(() => {
        const cobaPulihkan = () => {
            if (document.visibilityState && document.visibilityState !== "visible") {
                return;
            }
            refresh();
        };

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                refresh();
            }
        };

        window.addEventListener("online", cobaPulihkan);
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            window.removeEventListener("online", cobaPulihkan);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [refresh]);

    useEffect(() => {
        const onUnauthorized = () => {
            localStorage.removeItem("app_has_session");
            setUser(null);
        };
        window.addEventListener("auth:unauthorized", onUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
    }, []);

    /**
     * Dipanggil setelah /auth/login atau /auth/verifikasi-otp-admin sukses.
     * Sengaja tidak menerima data user dari respons endpoint itu — bentuk
     * datanya berbeda antara login biasa (field "user" bersarang) dan OTP
     * admin (field rata, tanpa "id") — dan langsung bertanya ke
     * /api/user/profile supaya kedua jalur login berakhir dengan bentuk data
     * yang sama persis, tidak perlu dua fungsi normalisasi berbeda.
     */
    const login = useCallback(async () => {
        localStorage.setItem("app_has_session", "true");
        await refresh();
        window.dispatchEvent(new Event("user:login"));
    }, [refresh]);

    const logout = useCallback(async () => {
        localStorage.removeItem("app_has_session");
        try {
            await api.post("/auth/logout");
        } catch {
            // Request gagal (mis. sudah offline) — tetap bersihkan state lokal;
            // cookie di browser paling lama bertahan sampai kedaluwarsa sendiri.
        }
        setUser(null);
        window.dispatchEvent(new Event("user:logout"));
    }, []);

    const value = {
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "ADMIN",
        loading,
        login,
        logout,
        refresh,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook hidup berdampingan dengan providernya, pola standar React Context
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
