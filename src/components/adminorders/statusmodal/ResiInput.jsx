const RESI_CONTOH = {
    jne: "JP1234567890",
    jnt: "JT1234567890",
    sicepat: "SPXID1234567890",
    pos: "RP12345678",
    tiki: "LD123456789",
    id: "I123456789",
    idexpress: "I123456789",
    anteraja: "D123456789012",
};

export default function ResiInput({ tempResi, onTempResiChange, kurir }) {
    const contoh = kurir ? RESI_CONTOH[String(kurir).toLowerCase()] : null;

    return (
        <div className="mt-4">
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
                Nomor Resi
            </label>

            <input
                type="text"
                value={tempResi || ""}
                onChange={(e) => onTempResiChange(e.target.value)}
                placeholder="Masukkan resi atau biarkan kosong (otomatis)"
                className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            <p className="mt-1.5 text-[11px] text-gray-400">
                Kosongkan untuk membuat otomatis.
                {contoh && (
                    <>
                        {" "}
                        Contoh resi {String(kurir).toUpperCase()}: <span className="font-mono">{contoh}</span>
                    </>
                )}
            </p>
        </div>
    );
}
