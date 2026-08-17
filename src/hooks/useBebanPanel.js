import { useState } from "react";

import { getLocalDateString, toMoney } from "../utils/format.js";

export default function useBebanPanel({ data, onSubmit }) {
    const daftar = Array.isArray(data) ? data : [];

    const [tanggal, setTanggal] = useState(() => getLocalDateString());

    const [kodeAkun, setKodeAkun] = useState("");

    const [keterangan, setKeterangan] = useState("");

    const [jumlah, setJumlah] = useState("");

    const simpan = async (event) => {
        event.preventDefault();

        const berhasil = await onSubmit({
            tanggal,
            kodeAkun,
            keterangan: keterangan.trim(),
            jumlah: toMoney(jumlah),
        });

        if (berhasil) {
            setKeterangan("");
            setJumlah("");
            setKodeAkun("");
        }
    };

    const daftarAktif = daftar.filter((beban) => !beban.dibatalkan);

    const totalAktif = daftarAktif.reduce((total, beban) => total + toMoney(beban.jumlah), 0);

    const totalDibatalkan = daftar.filter((beban) => beban.dibatalkan).length;

    return {
        tanggal,
        setTanggal,
        kodeAkun,
        setKodeAkun,
        keterangan,
        setKeterangan,
        jumlah,
        setJumlah,
        simpan,
        daftar,
        totalAktif,
        totalDibatalkan,
    };
}
