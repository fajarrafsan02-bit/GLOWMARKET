export default function PaymentBreadcrumb({ navigate }) {
    return (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
            <button
                type="button"
                onClick={() => navigate("/pesanan")}
                className="hover:text-amber-600 transition"
            >
                Pesanan
            </button>

            <span>›</span>

            <span className="text-gray-600 dark:text-gray-300">Pembayaran</span>
        </div>
    );
}
