import { SUMBER_JURNAL, labelFilterClass, selectFilterClass } from "../../hooks/useAdminAccounting.js";

export default function JurnalSourceFilter({ sumber, onChange }) {
    return (
        <div>
            <label className={labelFilterClass}>Sumber</label>

            <select
                value={sumber}
                onChange={(event) => onChange(event.target.value)}
                className={selectFilterClass}
            >
                <option value="">Semua sumber</option>

                {SUMBER_JURNAL.map((pilihan) => (
                    <option key={pilihan} value={pilihan}>
                        {pilihan.replace("_", " ")}
                    </option>
                ))}
            </select>
        </div>
    );
}
