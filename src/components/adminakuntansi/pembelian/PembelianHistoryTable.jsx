import { Kosong, Panel, TabelWrapper, thClass } from "../LaporanCard.jsx";

import PurchaseHistoryRow from "./PurchaseHistoryRow.jsx";

export default function PembelianHistoryTable({ daftar, saving, onLunasi, onCancel }) {
    return (
        <Panel title="Riwayat Pembelian" subtitle={`${daftar.length} pembelian`}>
            {daftar.length === 0 ? (
                <Kosong>Belum ada pembelian tercatat pada rentang tanggal ini.</Kosong>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <TabelWrapper>
                            <thead>
                                <tr>
                                    <th className={thClass}>Tanggal</th>

                                    <th className={thClass}>Nomor</th>

                                    <th className={thClass}>Pemasok</th>

                                    <th className={thClass}>Pembayaran</th>

                                    <th className={thClass}>Barang</th>

                                    <th className={`${thClass} text-right`}>Total</th>

                                    <th className={`${thClass} text-right`}>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {daftar.map((pembelian) => (
                                    <PurchaseHistoryRow
                                        key={pembelian.id}
                                        pembelian={pembelian}
                                        saving={saving}
                                        onLunasi={onLunasi}
                                        onCancel={onCancel}
                                    />
                                ))}
                            </tbody>
                        </TabelWrapper>
                    </div>
                </div>
            )}
        </Panel>
    );
}
