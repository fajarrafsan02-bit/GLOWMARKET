import { Check } from "lucide-react";

export default function PrimaryAddressSelector({ addresses, selectedDefaultId, onSetPrimaryAddress }) {
    return (
        <div className="mt-5">
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Alamat Utama
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Pilih alamat yang akan digunakan sebagai alamat pengiriman utama.
                </p>
            </div>

            <div className="space-y-2.5">
                {addresses.map((address) => {
                    const summary =
                        address.alamatLengkap ||
                        address.alamat ||
                        address.shippingAddress ||
                        [
                            address.kelurahan,
                            address.kecamatan,
                            address.kota || address.kabupaten,
                            address.provinsi,
                            address.kodePos,
                        ]
                            .filter(Boolean)
                            .join(", ");

                    const isDefault =
                        address.isDefault ||
                        address.is_default ||
                        String(address.id) === String(selectedDefaultId);

                    return (
                        <label
                            key={address.id}
                            className={` flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${isDefault ? "border-amber-400 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-900/10" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"} `}
                        >
                            <input
                                type="radio"
                                name="primaryAddress"
                                checked={!!isDefault}
                                onChange={() => onSetPrimaryAddress?.(address.id)}
                                className="mt-1 accent-amber-500"
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {address.namaLengkap ||
                                            address.name ||
                                            "Alamat Pengiriman"}
                                    </p>

                                    {isDefault && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium">
                                            <Check className="w-3 h-3" />
                                            Utama
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                    {summary || "Alamat belum lengkap"}
                                </p>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
