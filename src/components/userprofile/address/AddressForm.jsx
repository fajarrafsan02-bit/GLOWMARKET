import { motion as Motion } from "framer-motion";

import { X } from "lucide-react";

const selectClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white " +
    "text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 " +
    "focus:border-amber-500 transition";

const labelClass = "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5";

export default function AddressForm({
    addrProvince,
    addrCity,
    addrDistrict,
    addrVillage,
    addrPostal,
    addrLine,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onVillageChange,
    onPostalChange,
    onLineChange,
    provinces,
    cities,
    districts,
    villages,
    onCancel,
    onSave,
}) {
    return (
        <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Tambah Alamat Baru</h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Lengkapi detail alamat pengiriman Anda
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province */}
                <div>
                    <label className={labelClass}>Provinsi</label>

                    <select
                        value={addrProvince}
                        onChange={(e) => onProvinceChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Pilih Provinsi</option>

                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City */}
                <div>
                    <label className={labelClass}>Kota / Kabupaten</label>

                    <select
                        value={addrCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Pilih Kota / Kabupaten</option>

                        {cities.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* District */}
                <div>
                    <label className={labelClass}>Kecamatan</label>

                    <select
                        value={addrDistrict}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Pilih Kecamatan</option>

                        {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Village */}
                <div>
                    <label className={labelClass}>Kelurahan / Desa</label>

                    <select
                        value={addrVillage}
                        onChange={(e) => onVillageChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Pilih Kelurahan / Desa</option>

                        {villages.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Postal */}
                <div>
                    <label className={labelClass}>Kode Pos</label>

                    <input
                        type="text"
                        value={addrPostal}
                        onChange={(e) => onPostalChange(e.target.value)}
                        placeholder="Contoh: 40123"
                        className={selectClass}
                    />
                </div>

                {/* Address Detail */}
                <div className="md:col-span-2">
                    <label className={labelClass}>Alamat Lengkap</label>

                    <textarea
                        value={addrLine}
                        onChange={(e) => onLineChange(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, patokan, dll."
                        rows={3}
                        className={`${selectClass} resize-none`}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 text-sm font-semibold transition"
                >
                    Batal
                </button>

                <Motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onSave}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-sm transition"
                >
                    Simpan Alamat
                </Motion.button>
            </div>
        </div>
    );
}
