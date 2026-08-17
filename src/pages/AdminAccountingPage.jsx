import AdminLayout from "../components/AdminLayout.jsx";

import SettingsTabs from "../components/adminsettings/SettingsTabs.jsx";
import PeriodePicker from "../components/adminakuntansi/PeriodePicker.jsx";
import LabaRugiPanel from "../components/adminakuntansi/LabaRugiPanel.jsx";
import NeracaPanel from "../components/adminakuntansi/NeracaPanel.jsx";
import BukuBesarPanel from "../components/adminakuntansi/BukuBesarPanel.jsx";
import JurnalUmumPanel from "../components/adminakuntansi/JurnalUmumPanel.jsx";
import PembelianPanel from "../components/adminakuntansi/PembelianPanel.jsx";
import BebanPanel from "../components/adminakuntansi/BebanPanel.jsx";
import SaldoAwalPanel from "../components/adminakuntansi/SaldoAwalPanel.jsx";
import AccountingToast from "../components/adminakuntansi/AccountingToast.jsx";
import JurnalSourceFilter from "../components/adminakuntansi/JurnalSourceFilter.jsx";
import AkunFilter from "../components/adminakuntansi/AkunFilter.jsx";
import { Peringatan } from "../components/adminakuntansi/LaporanCard.jsx";

import useAdminAccounting, { TABS } from "../hooks/useAdminAccounting.js";

export default function AdminAccountingPage() {
    const {
        activeTab,
        gantiTab,
        periode,
        setPeriode,
        kodeAkun,
        setKodeAkun,
        sumber,
        setSumber,
        akunList,
        akunBeban,
        produkList,
        data,
        selisih,
        saldoAwalInfo,
        loading,
        saving,
        toast,
        exportExcel,
        simpanPembelian,
        batalkanPembelian,
        lunasiPembelian,
        simpanBeban,
        batalkanBeban,
        simpanSaldoAwal,
        bisaExport,
        pakaiPeriode,
    } = useAdminAccounting();

    return (
        <AdminLayout title="Akuntansi" activeMenu="accounting">
            <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
                <AccountingToast toast={toast} />

                {saldoAwalInfo && !saldoAwalInfo.sudahDicatat && (
                    <Peringatan>
                        Isi Harga Modal di halaman Produk, lalu catat Saldo Awal. Tanpa itu neraca
                        tidak seimbang dan stok lama tidak masuk pembukuan.
                    </Peringatan>
                )}

                <SettingsTabs tabs={TABS} activeTab={activeTab} onChange={gantiTab} />

                {pakaiPeriode && (
                    <PeriodePicker
                        mulai={periode.mulai}
                        sampai={periode.sampai}
                        onChange={setPeriode}
                        hanyaSampai={activeTab === "neraca"}
                        loading={loading}
                        onExport={bisaExport ? exportExcel : undefined}
                    >
                        {activeTab === "jurnal" && (
                            <JurnalSourceFilter sumber={sumber} onChange={setSumber} />
                        )}

                        {activeTab === "buku-besar" && (
                            <AkunFilter akunList={akunList} kodeAkun={kodeAkun} onChange={setKodeAkun} />
                        )}
                    </PeriodePicker>
                )}

                {loading && !data ? (
                    <div className="py-16 text-center text-xs text-gray-400">Memuat data...</div>
                ) : (
                    <>
                        {activeTab === "laba-rugi" && <LabaRugiPanel data={data} />}

                        {activeTab === "neraca" && <NeracaPanel data={data} />}

                        {activeTab === "buku-besar" && <BukuBesarPanel data={data} />}

                        {activeTab === "jurnal" && (
                            <JurnalUmumPanel data={data} selisih={selisih} />
                        )}

                        {activeTab === "pembelian" && (
                            <PembelianPanel
                                data={Array.isArray(data) ? data : []}
                                produkList={produkList}
                                onSubmit={simpanPembelian}
                                onCancel={batalkanPembelian}
                                onLunasi={lunasiPembelian}
                                saving={saving}
                            />
                        )}

                        {activeTab === "beban" && (
                            <BebanPanel
                                data={Array.isArray(data) ? data : []}
                                akunBeban={akunBeban}
                                onSubmit={simpanBeban}
                                onCancel={batalkanBeban}
                                saving={saving}
                            />
                        )}

                        {activeTab === "saldo-awal" && (
                            <SaldoAwalPanel info={data} onSubmit={simpanSaldoAwal} saving={saving} />
                        )}
                    </>
                )}
            </main>
        </AdminLayout>
    );
}
