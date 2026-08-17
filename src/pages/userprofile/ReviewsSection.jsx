import { Star, MessageSquare } from "lucide-react";

/**
 * Ulasan yang pernah ditulis pengguna.
 *
 * Datanya dari GET /api/reviews/user — sebelumnya endpoint ini tidak pernah
 * dipanggil FE, sehingga pembeli tidak punya cara melihat kembali ulasannya.
 */
export default function ReviewsSection({ loading, error, items }) {
    if (loading) {
        return <div className="py-12 text-center text-sm text-gray-400">Memuat ulasan...</div>;
    }

    if (error) {
        return (
            <div className="py-10 text-center text-sm text-rose-600 dark:text-rose-400">
                {error}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="py-12 text-center">
                <MessageSquare className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />

                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Belum ada ulasan
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    Ulasan bisa ditulis dari halaman Pesanan setelah pesanan selesai.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((review) => (
                <div
                    key={review.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {review.namaProduk || "Produk"}
                            </p>

                            {review.nomorPesanan && (
                                <p className="mt-0.5 text-[11px] text-gray-400 font-mono">
                                    {review.nomorPesanan}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0">
                            {[1, 2, 3, 4, 5].map((bintang) => (
                                <Star
                                    key={bintang}
                                    className={` w-3.5 h-3.5 ${bintang <= (review.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-700"} `}
                                />
                            ))}
                        </div>
                    </div>

                    {review.komentar && (
                        <p className="mt-2.5 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                            {review.komentar}
                        </p>
                    )}

                    {review.createdAt && (
                        <p className="mt-2 text-[10px] text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
