import { Landmark, WalletCards, TrendingUp } from "lucide-react";

import { BarisNilai, JudulGolongan, Panel } from "./LaporanCard.jsx";

import SummaryCard from "./SummaryCard.jsx";
import ImbalanceWarning from "./neraca/ImbalanceWarning.jsx";
import BalanceStatusCard from "./neraca/BalanceStatusCard.jsx";
import SectionHeader from "./neraca/SectionHeader.jsx";
import ResultRow from "./neraca/ResultRow.jsx";

/**
 * Neraca menampilkan:
 *
 * Aset
 *
 * versus
 *
 * Liabilitas + Ekuitas
 *
 * LOGIC DAN DATA FLOW TIDAK DIUBAH.
 */
export default function NeracaPanel({ data }) {
    if (!data) return null;

    const aset = Array.isArray(data.aset) ? data.aset : [];

    const liabilitas = Array.isArray(data.liabilitas) ? data.liabilitas : [];

    const ekuitas = Array.isArray(data.ekuitas) ? data.ekuitas : [];

    return (
        <div className="space-y-4">
            {!data.seimbang && <ImbalanceWarning selisih={data.selisih} />}

            <BalanceStatusCard seimbang={data.seimbang} sampai={data.sampai} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <SummaryCard
                    icon={Landmark}
                    label="Total Aset"
                    value={data.totalAset}
                    accent="blue"
                />

                <SummaryCard
                    icon={WalletCards}
                    label="Total Liabilitas"
                    value={data.totalLiabilitas}
                    accent="rose"
                />

                <SummaryCard
                    icon={TrendingUp}
                    label="Total Ekuitas"
                    value={data.totalEkuitas}
                    accent="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
                {/* ASET */}
                <Panel title="Aset" subtitle={`Posisi aset per ${data.sampai}`}>
                    <SectionHeader
                        icon={Landmark}
                        title="Aset"
                        description="Sumber daya yang dimiliki perusahaan."
                        accent="blue"
                    />

                    <div>
                        {aset.length === 0 && (
                            <BarisNilai label="Belum ada aset tercatat" nilai={0} indent />
                        )}

                        {aset.map((akun) => (
                            <BarisNilai
                                key={akun.kode}
                                label={`${akun.kode} — ${akun.nama}`}
                                nilai={akun.jumlah}
                                indent
                            />
                        ))}
                    </div>

                    <ResultRow label="TOTAL ASET" value={data.totalAset} accent="blue" />
                </Panel>

                {/* LIABILITAS + EKUITAS */}
                <Panel
                    title="Liabilitas & Ekuitas"
                    subtitle={`Posisi kewajiban dan modal per ${data.sampai}`}
                >
                    <SectionHeader
                        icon={WalletCards}
                        title="Liabilitas"
                        description="Kewajiban perusahaan kepada pihak lain."
                        accent="rose"
                    />

                    {liabilitas.length === 0 && (
                        <BarisNilai label="Tidak ada utang" nilai={0} indent />
                    )}

                    {liabilitas.map((akun) => (
                        <BarisNilai
                            key={akun.kode}
                            label={`${akun.kode} — ${akun.nama}`}
                            nilai={akun.jumlah}
                            indent
                        />
                    ))}

                    <BarisNilai label="Total Liabilitas" nilai={data.totalLiabilitas} tebal />

                    <JudulGolongan>Ekuitas</JudulGolongan>

                    <div className="border-b border-gray-100 dark:border-gray-800">
                        {ekuitas.map((akun) => (
                            <BarisNilai
                                key={akun.kode}
                                label={`${akun.kode} — ${akun.nama}`}
                                nilai={akun.jumlah}
                                indent
                            />
                        ))}

                        <BarisNilai
                            label="Laba Tahun Berjalan"
                            nilai={data.labaTahunBerjalan}
                            indent
                        />

                        <BarisNilai label="Total Ekuitas" nilai={data.totalEkuitas} tebal />
                    </div>

                    <ResultRow
                        label="TOTAL LIABILITAS + EKUITAS"
                        value={data.totalLiabilitasDanEkuitas}
                        accent="amber"
                    />
                </Panel>
            </div>
        </div>
    );
}
