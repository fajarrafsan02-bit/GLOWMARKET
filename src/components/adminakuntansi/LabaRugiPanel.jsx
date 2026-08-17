import { CircleDollarSign, ShoppingCart, TrendingUp, Wallet } from "lucide-react";

import { BarisNilai, Panel } from "./LaporanCard.jsx";

import SummaryCard from "./SummaryCard.jsx";
import HppWarning from "./labarugi/HppWarning.jsx";
import ReportSection from "./labarugi/ReportSection.jsx";
import ResultRow from "./labarugi/ResultRow.jsx";

/**
 * Laporan laba rugi.
 *
 * Struktur data dan logic TIDAK DIUBAH.
 *
 * Urutan:
 * Pendapatan
 * - HPP
 * = Laba Kotor
 * - Beban Operasional
 * = Laba Bersih
 */
export default function LabaRugiPanel({ data }) {
    if (!data) return null;

    const pendapatan = Array.isArray(data.pendapatan) ? data.pendapatan : [];

    const hpp = Array.isArray(data.hpp) ? data.hpp : [];

    const beban = Array.isArray(data.beban) ? data.beban : [];

    return (
        <div className="space-y-4">
            {data.penjualanTanpaHpp > 0 && (
                <HppWarning penjualanTanpaHpp={data.penjualanTanpaHpp} />
            )}

            <Panel title="Laba Rugi" subtitle={`Periode ${data.mulai} s/d ${data.sampai}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <SummaryCard
                        icon={CircleDollarSign}
                        label="Total Pendapatan"
                        value={data.totalPendapatan}
                        accent="emerald"
                    />

                    <SummaryCard
                        icon={ShoppingCart}
                        label="Total HPP"
                        value={data.totalHpp}
                        accent="blue"
                    />

                    <SummaryCard
                        icon={Wallet}
                        label="Total Beban"
                        value={data.totalBeban}
                        accent="rose"
                    />
                </div>

                <ReportSection
                    icon={TrendingUp}
                    title="Pendapatan"
                    description="Pendapatan yang diperoleh selama periode laporan."
                    accent="emerald"
                >
                    {pendapatan.length === 0 && (
                        <BarisNilai label="Belum ada pendapatan" nilai={0} indent />
                    )}

                    {pendapatan.map((akun) => (
                        <BarisNilai
                            key={akun.kode}
                            label={`${akun.kode} — ${akun.nama}`}
                            nilai={akun.jumlah}
                            indent
                        />
                    ))}

                    <BarisNilai label="Total Pendapatan" nilai={data.totalPendapatan} tebal />
                </ReportSection>

                <ReportSection
                    icon={ShoppingCart}
                    title="Harga Pokok Penjualan"
                    description="Biaya perolehan produk yang terjual."
                    accent="blue"
                >
                    {hpp.length === 0 && (
                        <BarisNilai label="Belum ada HPP tercatat" nilai={0} indent />
                    )}

                    {hpp.map((akun) => (
                        <BarisNilai
                            key={akun.kode}
                            label={`${akun.kode} — ${akun.nama}`}
                            nilai={akun.jumlah}
                            indent
                        />
                    ))}

                    <BarisNilai label="Total HPP" nilai={data.totalHpp} tebal />
                </ReportSection>

                <ResultRow label="LABA KOTOR" value={data.labaKotor} accent="amber" />

                <ReportSection
                    icon={Wallet}
                    title="Beban Operasional"
                    description="Biaya operasional yang dikeluarkan selama periode."
                    accent="rose"
                >
                    {beban.length === 0 && (
                        <BarisNilai label="Belum ada beban tercatat" nilai={0} indent />
                    )}

                    {beban.map((akun) => (
                        <BarisNilai
                            key={akun.kode}
                            label={`${akun.kode} — ${akun.nama}`}
                            nilai={akun.jumlah}
                            indent
                        />
                    ))}

                    <BarisNilai label="Total Beban" nilai={data.totalBeban} tebal />
                </ReportSection>

                <ResultRow label="LABA BERSIH" value={data.labaBersih} accent="emerald" large />
            </Panel>
        </div>
    );
}
