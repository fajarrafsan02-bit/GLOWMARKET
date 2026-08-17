import { labelFilterClass, selectFilterClass } from "../../hooks/useAdminAccounting.js";

export default function AkunFilter({ akunList, kodeAkun, onChange }) {
    return (
        <div>
            <label className={labelFilterClass}>Akun</label>

            <select
                value={kodeAkun}
                onChange={(event) => onChange(event.target.value)}
                className={selectFilterClass}
            >
                {akunList.map((akun) => (
                    <option key={akun.kode} value={akun.kode}>
                        {akun.kode} — {akun.nama}
                    </option>
                ))}
            </select>
        </div>
    );
}
