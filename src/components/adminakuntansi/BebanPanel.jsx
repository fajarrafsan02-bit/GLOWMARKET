import { CircleDollarSign, Receipt, WalletCards } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

import useBebanPanel from "../../hooks/useBebanPanel.js";

import BebanSummaryCard from "./beban/BebanSummaryCard.jsx";
import BebanForm from "./beban/BebanForm.jsx";
import BebanHistoryTable from "./beban/BebanHistoryTable.jsx";

/**
 * Panel pencatatan biaya operasional.
 *
 * Akun tujuan dibatasi bertipe BEBAN oleh backend,
 * sehingga pilihan akun hanya berasal dari akunBeban.
 */
export default function BebanPanel({ data, akunBeban, onSubmit, onCancel, saving }) {
    const {
        tanggal,
        setTanggal,
        kodeAkun,
        setKodeAkun,
        keterangan,
        setKeterangan,
        jumlah,
        setJumlah,
        simpan,
        daftar,
        totalAktif,
        totalDibatalkan,
    } = useBebanPanel({ data, onSubmit });

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <BebanSummaryCard
                    icon={CircleDollarSign}
                    label="Total Biaya Aktif"
                    value={formatPrice(totalAktif)}
                    accent="amber"
                />

                <BebanSummaryCard
                    icon={Receipt}
                    label="Transaksi Biaya"
                    value={`${daftar.length} transaksi`}
                    accent="blue"
                />

                <BebanSummaryCard
                    icon={WalletCards}
                    label="Status"
                    value={totalDibatalkan > 0 ? `${totalDibatalkan} dibatalkan` : "Semua aktif"}
                    accent={totalDibatalkan > 0 ? "rose" : "emerald"}
                />
            </div>

            {/* FORM INPUT */}
            <BebanForm
                tanggal={tanggal}
                onTanggalChange={setTanggal}
                kodeAkun={kodeAkun}
                onKodeAkunChange={setKodeAkun}
                keterangan={keterangan}
                onKeteranganChange={setKeterangan}
                jumlah={jumlah}
                onJumlahChange={setJumlah}
                akunBeban={akunBeban}
                saving={saving}
                onSubmit={simpan}
            />

            {/* HISTORY */}
            <BebanHistoryTable daftar={daftar} totalAktif={totalAktif} onCancel={onCancel} />
        </div>
    );
}
