import { toMoney } from "./format.js";

export function normalizeKurirCode(code) {
    if (!code) return "";
    const c = String(code).trim().toLowerCase();
    if (c === "jnt" || c === "j&t" || c.includes("j&t") || c.includes("jnt")) return "jnt";
    if (c === "jne" || c.includes("nugraha") || c.includes("jne")) return "jne";
    if (c === "sicepat" || c.includes("sicepat")) return "sicepat";
    if (c === "tiki" || c.includes("tiki")) return "tiki";
    if (c === "pos" || c.includes("pos")) return "pos";
    return c;
}

export function isSameCourier(a, b) {
    if (!a || !b) return false;
    const codeA = normalizeKurirCode(a.kurirCode || a.kurirName);
    const codeB = normalizeKurirCode(b.kurirCode || b.kurirName);
    const layA = String(a.layanan || "")
        .trim()
        .toLowerCase();
    const layB = String(b.layanan || "")
        .trim()
        .toLowerCase();
    if (layA && layB) {
        return codeA === codeB && layA === layB;
    }
    return codeA === codeB;
}

export function opsiTermurah(opsi) {
    if (!Array.isArray(opsi) || opsi.length === 0) {
        return null;
    }

    return opsi.reduce((min, o) => (toMoney(o.tarif) < toMoney(min.tarif) ? o : min));
}

export function tarifOngkirTerpilih(estimasi, pilihan) {
    if (!estimasi) {
        return pilihan?.tarif != null ? toMoney(pilihan.tarif) : 0;
    }

    if (estimasi.sumber === "GRATIS_MINIMAL_BELANJA") {
        return 0;
    }

    const opsi = Array.isArray(estimasi.opsi) ? estimasi.opsi : [];

    if (pilihan && opsi.length >= 1) {
        const found = opsi.find((o) => isSameCourier(o, pilihan));
        if (found) {
            return toMoney(found.tarif);
        }
    }

    if (pilihan?.tarif != null && toMoney(pilihan.tarif) > 0) {
        return toMoney(pilihan.tarif);
    }

    return toMoney(estimasi.tarif);
}

export function estimasiHariTerpilih(estimasi, pilihan) {
    const opsi = Array.isArray(estimasi?.opsi) ? estimasi.opsi : [];

    if (pilihan && opsi.length >= 1) {
        const found = opsi.find((o) => isSameCourier(o, pilihan));
        if (found?.estimasiHari != null) {
            return found.estimasiHari;
        }
    }

    if (pilihan?.estimasiHari != null) {
        return pilihan.estimasiHari;
    }

    return estimasi?.estimasiHari ?? null;
}
