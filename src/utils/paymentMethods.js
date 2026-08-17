/**
 * Metode pembayaran yang bisa dipilih pembeli/diaktifkan admin. Kode
 * mengikuti channel code Xendit (Invoice API v2). Dipakai bersama oleh
 * form pengaturan admin (PaymentSettingsForm) dan pemilih metode di
 * Checkout (PaymentMethodPicker) supaya daftarnya selalu sinkron.
 */
export const PAYMENT_METHOD_GROUPS = [
    {
        group: "Transfer Bank (Virtual Account)",
        items: [
            { code: "BCA", label: "BCA" },
            { code: "BNI", label: "BNI" },
            { code: "BRI", label: "BRI" },
            { code: "MANDIRI", label: "Mandiri" },
            { code: "PERMATA", label: "Permata" },
            { code: "BSI", label: "BSI" },
        ],
    },
    {
        group: "E-Wallet & QRIS",
        items: [
            { code: "QRIS", label: "QRIS" },
            { code: "OVO", label: "OVO" },
            { code: "DANA", label: "DANA" },
            { code: "SHOPEEPAY", label: "ShopeePay" },
            { code: "LINKAJA", label: "LinkAja" },
        ],
    },
    {
        group: "Gerai Retail",
        items: [
            { code: "ALFAMART", label: "Alfamart" },
            { code: "INDOMARET", label: "Indomaret" },
        ],
    },
    {
        group: "Kartu",
        items: [{ code: "CREDIT_CARD", label: "Kartu Kredit / Debit" }],
    },
];

export const ALL_PAYMENT_METHOD_CODES = PAYMENT_METHOD_GROUPS.flatMap((group) =>
    group.items.map((item) => item.code),
);

export function paymentMethodLabel(code) {
    for (const group of PAYMENT_METHOD_GROUPS) {
        const found = group.items.find((item) => item.code === code);
        if (found) return found.label;
    }
    return code;
}

/**
 * Daftar yang boleh ditampilkan sebagai pilihan di Checkout: kalau admin
 * sudah membatasi (activeCodes tidak kosong), hanya grup/metode itu yang
 * ditampilkan; kosong berarti admin belum membatasi apa pun, semua metode
 * dikenal ditawarkan (sama seperti tampilan form pengaturan admin).
 */
export function filterPaymentMethodGroups(activeCodes) {
    if (!Array.isArray(activeCodes) || activeCodes.length === 0) {
        return PAYMENT_METHOD_GROUPS;
    }

    return PAYMENT_METHOD_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => activeCodes.includes(item.code)),
    })).filter((group) => group.items.length > 0);
}
