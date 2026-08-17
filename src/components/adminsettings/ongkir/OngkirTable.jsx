import OngkirRow from "./OngkirRow.jsx";

export default function OngkirTable({
    rows,
    drafts,
    loading,
    savingId,
    isDirty,
    setDraft,
    onSave,
    onDelete,
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
                <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        <th className="px-3 sm:px-5 py-2.5 font-medium">Provinsi</th>
                        <th className="px-3 py-2.5 font-medium">Tarif (Rp)</th>
                        <th className="px-3 py-2.5 font-medium">Estimasi (hari)</th>
                        <th className="px-3 py-2.5 font-medium text-right">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-3 sm:px-5 py-8 text-center text-xs text-gray-400"
                            >
                                Memuat tarif ongkir...
                            </td>
                        </tr>
                    )}

                    {!loading && rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-3 sm:px-5 py-8 text-center text-xs text-gray-400"
                            >
                                Belum ada tarif ongkir.
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        rows.map((row) => {
                            const draft = drafts[row.id] || {
                                tarif: "",
                                estimasiHari: "",
                            };

                            return (
                                <OngkirRow
                                    key={row.id}
                                    row={row}
                                    draft={draft}
                                    dirty={isDirty(row)}
                                    busy={savingId === row.id}
                                    onDraftChange={(field, value) =>
                                        setDraft(row.id, field, value)
                                    }
                                    onSave={() => onSave(row)}
                                    onDelete={() => onDelete(row)}
                                />
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
