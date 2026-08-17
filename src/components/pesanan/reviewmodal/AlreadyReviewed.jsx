export default function AlreadyReviewed({ alreadyReviewed, checking }) {
    return (
        <>
            {alreadyReviewed && (
                <div className="px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 text-xs text-amber-700 dark:text-amber-400">
                    Produk ini sudah pernah Anda ulas pada pesanan tersebut. Ulasan lamanya bisa
                    dilihat di Akun Saya → Ulasan Saya.
                </div>
            )}

            {checking && <p className="text-xs text-gray-400">Memeriksa ulasan sebelumnya...</p>}
        </>
    );
}
