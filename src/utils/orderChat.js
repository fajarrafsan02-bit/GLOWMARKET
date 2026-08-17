import { formatPrice, toMoney } from "./format.js";
import { orderStatusLabel } from "./orderStatus.js";
import { STATUS_META } from "./pengembalianStatus.js";

export function normalizeOrderStatus(status) {
    const value = String(status || "").toUpperCase();

    if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(value)) return "PENDING";
    if (["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(value)) {
        return "DIKEMAS";
    }
    if (["SHIPPED", "DIKIRIM"].includes(value)) return "DIKIRIM";
    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(value)) return "SELESAI";
    if (["DIBATALKAN", "CANCELED", "CANCELLED"].includes(value)) return "DIBATALKAN";
    if (["DIKEMBALIKAN", "PENGEMBALIAN", "RETURNED", "REFUNDED"].includes(value)) {
        return "DIKEMBALIKAN";
    }

    return value || "";
}

function orderIdOf(order, pengembalian) {
    return (
        order?.nomorPesanan ||
        order?.id ||
        order?.orderId ||
        pengembalian?.nomorPesanan ||
        pengembalian?.pesananId ||
        null
    );
}

function productNames(order) {
    const items = Array.isArray(order?.items) ? order.items : [];
    return items
        .map((item) => item.namaProduk || item.nama || item.productName)
        .filter(Boolean)
        .join(", ");
}

function orderTotal(order) {
    if (order?.totalHarga != null) return toMoney(order.totalHarga);
    if (order?.total != null) return toMoney(order.total);

    if (Array.isArray(order?.items)) {
        return order.items.reduce((sum, item) => {
            const qty = parseInt(item.quantity ?? item.jumlah ?? 1, 10) || 1;
            if (item.subtotal != null) return sum + toMoney(item.subtotal);
            return sum + toMoney(item.hargaSatuan ?? item.harga) * qty;
        }, 0);
    }

    return 0;
}

function prefix(ctx) {
    if (ctx?.nomorPengembalian) {
        const orderPart = ctx.orderId ? ` (pesanan #${ctx.orderId})` : "";
        return `Halo Admin, terkait pengembalian ${ctx.nomorPengembalian}${orderPart}:`;
    }
    if (ctx?.orderId) {
        return `Halo Admin, terkait pesanan #${ctx.orderId}:`;
    }
    if (ctx?.externalId) {
        return `Halo Admin, terkait pembayaran ${ctx.externalId}:`;
    }
    return "Halo Admin,";
}

function chip(id, label, body, ctx) {
    return {
        id,
        label,
        text: `${prefix(ctx)} ${body}`.replace(/\s+/g, " ").trim(),
    };
}

function buildDefaultMessage(source, ctx, order, payment, pengembalian) {
    if (source === "pengembalian") {
        const statusLabel =
            STATUS_META[pengembalian?.status]?.label || pengembalian?.status || "-";
        const lines = [
            `Halo Admin, saya ingin bertanya mengenai pengembalian ${ctx.nomorPengembalian || "-"}.`,
        ];
        if (ctx.orderId) lines.push(`Pesanan: #${ctx.orderId}`);
        lines.push(`Status: ${statusLabel}`);
        return lines.join("\n");
    }

    if (source === "pembayaran") {
        const lines = ["Halo Admin, saya ingin bertanya mengenai pembayaran."];
        if (ctx.externalId) lines.push(`ID Transaksi: ${ctx.externalId}`);
        if (ctx.orderId) lines.push(`Pesanan: #${ctx.orderId}`);
        if (ctx.status) lines.push(`Status: ${ctx.status}`);
        if (payment?.amount != null) lines.push(`Total: ${formatPrice(payment.amount)}`);
        return lines.join("\n");
    }

    if (source === "checkout") {
        return "Halo Admin, saya butuh bantuan saat checkout.";
    }

    if (source === "pesanan" && ctx.orderId) {
        const lines = [
            `Halo Admin, saya ingin bertanya mengenai pesanan #${ctx.orderId}.`,
        ];
        const statusLabel = orderStatusLabel(normalizeOrderStatus(ctx.status) || ctx.status);
        if (statusLabel) lines.push(`Status: ${statusLabel}`);
        const products = productNames(order);
        if (products) lines.push(`Produk: ${products}`);
        const total = orderTotal(order);
        if (total > 0) lines.push(`Total: ${formatPrice(total)}`);
        return lines.join("\n");
    }

    return "";
}

export function buildOrderChatState({
    source = "umum",
    order,
    payment,
    pengembalian,
} = {}) {
    const chatContext = {
        source,
        orderId: orderIdOf(order, pengembalian),
        status: order?.status || payment?.status || pengembalian?.status || null,
        nomorPengembalian: pengembalian?.nomorPengembalian || pengembalian?.id || null,
        externalId: payment?.externalId || order?.externalId || null,
    };

    return {
        defaultMessage: buildDefaultMessage(source, chatContext, order, payment, pengembalian),
        chatContext,
    };
}

function repliesForOrder(status, ctx) {
    switch (status) {
        case "PENDING":
            return [
                chip("bayar-belum", "Pembayaran belum masuk", "pembayaran saya belum terkonfirmasi. Mohon dicek.", ctx),
                chip("cara-bayar", "Cara bayar", "mohon bantuannya, bagaimana cara menyelesaikan pembayaran?", ctx),
                chip("batal", "Batalkan pesanan", "saya ingin membatalkan pesanan ini. Apakah masih bisa?", ctx),
            ];
        case "DIKEMAS":
            return [
                chip("kapan-kirim", "Kapan dikirim", "kapan kira-kira pesanan ini dikirim?", ctx),
                chip("ubah-alamat", "Ubah alamat", "saya ingin mengubah alamat pengiriman. Apakah masih bisa?", ctx),
                chip("catatan", "Tambah catatan", "bolehkah saya menambahkan catatan untuk pengiriman?", ctx),
            ];
        case "DIKIRIM":
            return [
                chip("cek-resi", "Cek resi", "mohon info resi dan status pengirimannya.", ctx),
                chip("belum-sampai", "Belum sampai", "pesanan belum sampai. Mohon bantuannya dicek.", ctx),
                chip("salah-rusak", "Barang salah/rusak", "barang yang diterima salah atau rusak. Mohon bantuannya.", ctx),
            ];
        case "SELESAI":
            return [
                chip("retur", "Ajukan retur", "saya ingin mengajukan pengembalian barang. Bagaimana prosedurnya?", ctx),
                chip("komplain", "Komplain produk", "saya ingin menyampaikan komplain terkait produk yang diterima.", ctx),
                chip("beli-lagi", "Stok produk", "apakah produk yang sama masih tersedia?", ctx),
            ];
        case "DIBATALKAN":
            return [
                chip("alasan-batal", "Alasan pembatalan", "mohon infonya, kenapa pesanan ini dibatalkan?", ctx),
                chip("status-refund", "Status refund", "mohon update status pengembalian dananya.", ctx),
                chip("pesan-ulang", "Pesan ulang", "saya ingin memesan ulang. Apakah stoknya masih ada?", ctx),
            ];
        case "DIKEMBALIKAN":
            return [
                chip("status-refund", "Status refund", "mohon update status pengembalian dananya.", ctx),
                chip("dana-belum", "Dana belum masuk", "dana refund belum masuk. Mohon dicek.", ctx),
                chip("status-retur", "Status retur", "mohon update proses pengembalian barangnya.", ctx),
            ];
        default:
            return [
                chip("tanya-pesanan", "Tanya pesanan", "saya ingin bertanya mengenai pesanan ini.", ctx),
                chip("status-pesanan", "Status pesanan", "mohon update status pesanan ini.", ctx),
                chip("bantuan", "Butuh bantuan", "saya butuh bantuan terkait pesanan ini.", ctx),
            ];
    }
}

function repliesForPayment(status, ctx) {
    const value = String(status || "").toUpperCase();

    if (value === "EXPIRED") {
        return [
            chip("invoice-expired", "Invoice kedaluwarsa", "invoice pembayaran sudah kedaluwarsa. Bagaimana cara bayar ulang?", ctx),
            chip("buat-ulang", "Buat ulang", "mohon bantuannya membuatkan invoice pembayaran baru.", ctx),
            chip("cara-bayar", "Cara bayar", "mohon infonya cara menyelesaikan pembayaran.", ctx),
        ];
    }

    if (["PAID", "SETTLED"].includes(value)) {
        return [
            chip("konfirmasi", "Konfirmasi pesanan", "pembayaran sudah berhasil. Mohon konfirmasi pesanan diproses.", ctx),
            chip("kapan-kemas", "Kapan dikemas", "kapan kira-kira pesanan mulai dikemas?", ctx),
            chip("ubah-alamat", "Ubah alamat", "saya ingin mengubah alamat pengiriman. Apakah masih bisa?", ctx),
        ];
    }

    return [
        chip("sudah-transfer", "Sudah transfer", "saya sudah transfer. Mohon dicek konfirmasinya.", ctx),
        chip("bayar-belum", "Pembayaran belum masuk", "pembayaran belum terkonfirmasi. Mohon bantuannya.", ctx),
        chip("cara-bayar", "Cara bayar", "mohon infonya cara menyelesaikan pembayaran.", ctx),
        chip("invoice-expired", "Invoice kedaluwarsa", "jika invoice kedaluwarsa, bagaimana cara bayar ulang?", ctx),
    ];
}

function repliesForReturn(status, ctx) {
    const value = String(status || "").toUpperCase();

    if (value === "DISETUJUI") {
        return [
            chip("resi-retur", "Resi retur", "mohon infonya alamat dan cara kirim barang pengembalian.", ctx),
            chip("status-retur", "Status retur", "mohon update proses pengembaliannya.", ctx),
            chip("dana", "Kapan refund", "setelah barang dikirim, kapan dana dikembalikan?", ctx),
        ];
    }

    if (value === "DITOLAK") {
        return [
            chip("alasan-tolak", "Alasan penolakan", "mohon penjelasan kenapa pengembalian ditolak.", ctx),
            chip("ajukan-ulang", "Ajukan ulang", "apakah pengembalian ini bisa diajukan ulang?", ctx),
            chip("bantuan", "Butuh bantuan", "saya butuh bantuan terkait pengembalian yang ditolak.", ctx),
        ];
    }

    if (value === "DITERIMA") {
        return [
            chip("dana-belum", "Dana belum masuk", "barang sudah diterima toko, tetapi dana belum masuk. Mohon dicek.", ctx),
            chip("status-refund", "Status refund", "mohon update status pengembalian dananya.", ctx),
            chip("bukti", "Bukti refund", "mohon kirimkan bukti atau detail refund-nya.", ctx),
        ];
    }

    return [
        chip("status-retur", "Status retur", "mohon update status pengajuan pengembalian ini.", ctx),
        chip("percepat", "Percepat proses", "apakah proses pengembalian ini bisa dipercepat?", ctx),
        chip("dana-belum", "Dana belum masuk", "mohon info kapan dana dikembalikan.", ctx),
    ];
}

const UMUM_REPLIES = [
    { id: "tanya-produk", label: "Tanya produk", text: "Halo Admin, saya ingin bertanya tentang produk." },
    { id: "status-pesanan", label: "Status pesanan", text: "Halo Admin, saya ingin menanyakan status pesanan saya." },
    { id: "jam-operasional", label: "Jam operasional", text: "Halo Admin, jam operasional toko bagaimana?" },
    { id: "cara-order", label: "Cara order", text: "Halo Admin, bagaimana cara melakukan pemesanan?" },
];

const CHECKOUT_REPLIES = [
    { id: "voucher", label: "Voucher tidak bisa", text: "Halo Admin, saya butuh bantuan saat checkout. Voucher tidak bisa digunakan." },
    { id: "ongkir", label: "Ongkir", text: "Halo Admin, saya butuh bantuan saat checkout terkait ongkos kirim." },
    { id: "alamat", label: "Alamat pengiriman", text: "Halo Admin, saya butuh bantuan saat checkout terkait alamat pengiriman." },
    { id: "metode-bayar", label: "Metode bayar", text: "Halo Admin, saya butuh bantuan saat checkout terkait metode pembayaran." },
];

export function getQuickReplies(chatContext) {
    const source = chatContext?.source || "umum";
    const status = chatContext?.status;

    if (source === "checkout") return CHECKOUT_REPLIES;
    if (source === "pembayaran") return repliesForPayment(status, chatContext).slice(0, 5);
    if (source === "pengembalian") return repliesForReturn(status, chatContext).slice(0, 5);
    if (source === "pesanan") {
        return repliesForOrder(normalizeOrderStatus(status), chatContext).slice(0, 5);
    }

    return UMUM_REPLIES;
}
