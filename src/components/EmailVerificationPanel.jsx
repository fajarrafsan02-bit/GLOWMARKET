import { useState } from "react";
import { MailCheck, RefreshCw, ShieldAlert } from "lucide-react";

import api from "../api/Axios.jsx";

/**
 * Panel verifikasi email untuk pengguna yang sudah login.
 *
 * Dipakai di dua tempat dengan perilaku sama: banner di halaman profil dan
 * penghalang di halaman checkout. Alurnya: kirim kode ke email, masukkan 6
 * digit, lalu beri tahu pemanggil lewat onVerified.
 */
export default function EmailVerificationPanel({
    email,
    onVerified,
    judul = "Email belum terverifikasi",
    keterangan = "Verifikasi email Anda agar bukti pembayaran dan pemberitahuan status pesanan bisa kami kirim.",
}) {
    const [kode, setKode] = useState("");
    const [kodeTerkirim, setKodeTerkirim] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pesan, setPesan] = useState("");
    const [error, setError] = useState("");

    const kirimKode = async () => {
        setLoading(true);
        setError("");
        setPesan("");

        try {
            const res = await api.post("/auth/kirim-ulang-verifikasi", { email });
            setKodeTerkirim(true);
            setPesan(res.data?.message || `Kode dikirim ke ${email}`);
        } catch (err) {
            setError(err.message || "Gagal mengirim kode verifikasi.");
        } finally {
            setLoading(false);
        }
    };

    const verifikasi = async (event) => {
        event.preventDefault();

        if (kode.trim().length !== 6) {
            setError("Masukkan 6 digit kode verifikasi.");
            return;
        }

        setLoading(true);
        setError("");
        setPesan("");

        try {
            await api.post("/auth/verifikasi-email", {
                email,
                kode: kode.trim(),
            });

            setPesan("Email berhasil diverifikasi.");
            onVerified?.();
        } catch (err) {
            setError(err.message || "Kode verifikasi salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/10">
            <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        {judul}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700/80 dark:text-amber-400/80">
                        {keterangan}
                    </p>

                    {!kodeTerkirim ? (
                        <button
                            type="button"
                            onClick={kirimKode}
                            disabled={loading}
                            className="mt-3 h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
                        >
                            <MailCheck className="w-3.5 h-3.5" />
                            {loading ? "Mengirim..." : "Kirim kode verifikasi"}
                        </button>
                    ) : (
                        <form
                            onSubmit={verifikasi}
                            className="mt-3 flex flex-wrap items-center gap-2"
                        >
                            <input
                                value={kode}
                                onChange={(event) =>
                                    setKode(event.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                inputMode="numeric"
                                placeholder="6 digit kode"
                                className="h-9 w-36 px-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-900 text-sm tracking-[0.3em] text-center text-gray-900 dark:text-white outline-none focus:border-amber-500"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold disabled:opacity-60"
                            >
                                {loading ? "Memverifikasi..." : "Verifikasi"}
                            </button>

                            <button
                                type="button"
                                onClick={kirimKode}
                                disabled={loading}
                                className="h-9 px-2 text-xs font-medium text-amber-700 dark:text-amber-400 inline-flex items-center gap-1 disabled:opacity-60"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Kirim ulang
                            </button>
                        </form>
                    )}

                    {pesan && (
                        <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                            {pesan}
                        </p>
                    )}

                    {error && (
                        <p className="mt-2 text-[11px] text-red-600 dark:text-red-400">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
