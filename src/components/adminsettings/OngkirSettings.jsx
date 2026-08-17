import useOngkirSettings from "../../hooks/useOngkirSettings.js";

import OngkirHeader from "./ongkir/OngkirHeader.jsx";
import OngkirCreateForm from "./ongkir/OngkirCreateForm.jsx";
import OngkirTable from "./ongkir/OngkirTable.jsx";

/**
 * CRUD tarif ongkir per provinsi.
 * Tarif dipakai halaman checkout untuk menghitung total bayar.
 */
export default function OngkirSettings({ onNotify }) {
    const {
        rows,
        drafts,
        loading,
        savingId,
        creating,
        newRow,
        setNewRow,
        fetchOngkir,
        setDraft,
        isDirty,
        handleUpdate,
        handleDelete,
        handleCreate,
    } = useOngkirSettings({ onNotify });

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <OngkirHeader loading={loading} onReload={fetchOngkir} />

            <OngkirCreateForm
                newRow={newRow}
                setNewRow={setNewRow}
                creating={creating}
                onSubmit={handleCreate}
            />

            <OngkirTable
                rows={rows}
                drafts={drafts}
                loading={loading}
                savingId={savingId}
                isDirty={isDirty}
                setDraft={setDraft}
                onSave={handleUpdate}
                onDelete={handleDelete}
            />

            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400">
                Tarif 0 berarti gratis ongkir untuk provinsi tersebut.
            </div>
        </div>
    );
}
