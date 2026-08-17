/**
 * Nilai uang dari API: number atau string BigDecimal ("3850000.00").
 * Jangan dipakai untuk string yang sudah diformat id-ID ("3.850.000" / "Rp ...").
 */
export function toMoney(value) {
    if (value == null || value === "") {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    const parsed = Number(String(value).trim().replace(/\./g, "").replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

export function formatThousand(val) {
    if (val == null || val === "") return "";
    const digits = String(val).replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("id-ID").format(Number(digits));
}

export function moneyTimesQty(price, qty) {
    return toMoney(price) * (Number(qty) || 0);
}

export const formatPrice = (val) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(toMoney(val));

export function getLocalDateString(date = new Date()) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function toDate(value) {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(dateValue) {
    const date = toDate(dateValue);

    if (!date) {
        return "-";
    }

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function formatDateTime(dateValue) {
    const date = toDate(dateValue);

    if (!date) {
        return "-";
    }

    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
