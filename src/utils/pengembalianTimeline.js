/**
 * Langkah tracking retur dari status + timestamp yang sudah ada di API.
 * Cabang DITOLAK tidak menampilkan Disetujui / Barang diterima.
 */
export function buildReturnTimeline(pengembalian) {
    const status = String(pengembalian?.status || "DIAJUKAN").toUpperCase();
    const ditolak = status === "DITOLAK";
    const disetujui = status === "DISETUJUI" || status === "DITERIMA";
    const diterima = status === "DITERIMA";

    const langkah = [
        {
            key: "DIAJUKAN",
            label: "Diajukan",
            done: true,
            current: status === "DIAJUKAN",
            at: pengembalian?.createdAt || null,
        },
    ];

    if (ditolak) {
        langkah.push({
            key: "DITOLAK",
            label: "Ditolak",
            done: true,
            current: true,
            at: pengembalian?.approvedAt || pengembalian?.updatedAt || null,
        });
        return langkah;
    }

    langkah.push({
        key: "DISETUJUI",
        label: "Disetujui",
        done: disetujui,
        current: status === "DISETUJUI",
        at: disetujui ? pengembalian?.approvedAt || null : null,
    });

    langkah.push({
        key: "DITERIMA",
        label: "Barang diterima",
        done: diterima,
        current: status === "DITERIMA",
        at: diterima ? pengembalian?.diterimaAt || null : null,
        hint: disetujui && !diterima
            ? "Admin menandai langkah ini setelah barang sampai di toko."
            : null,
    });

    return langkah;
}
