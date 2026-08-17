import useSaldoAwal from "../../hooks/useSaldoAwal.js";

import SaldoAwalDone from "./saldoawal/SaldoAwalDone.jsx";
import SaldoAwalWarning from "./saldoawal/SaldoAwalWarning.jsx";
import SaldoAwalForm from "./saldoawal/SaldoAwalForm.jsx";

/**
 * Jurnal pembuka.
 *
 * Logic dan business flow TIDAK DIUBAH.
 */
export default function SaldoAwalPanel({ info, onSubmit, saving }) {
    const { kas, setKas, tanggal, setTanggal, total, submit } = useSaldoAwal({
        info,
        onSubmit,
    });

    if (!info) return null;

    if (info.sudahDicatat) {
        return <SaldoAwalDone />;
    }

    return (
        <div className="space-y-4">
            {info.produkTanpaModal > 0 && (
                <SaldoAwalWarning
                    produkTanpaModal={info.produkTanpaModal}
                    totalProduk={info.totalProduk}
                />
            )}

            <SaldoAwalForm
                kas={kas}
                tanggal={tanggal}
                onTanggalChange={setTanggal}
                onKasChange={setKas}
                total={total}
                totalProduk={info.totalProduk}
                nilaiPersediaan={info.nilaiPersediaan}
                saving={saving}
                onSubmit={submit}
            />
        </div>
    );
}
