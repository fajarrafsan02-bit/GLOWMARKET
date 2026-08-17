import { useState } from "react";

import { toMoney } from "../utils/format.js";

export default function useSaldoAwal({ info, onSubmit }) {
    const [kas, setKas] = useState("");

    const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));

    const total = toMoney(kas) + toMoney(info?.nilaiPersediaan);

    const submit = (event) => {
        event.preventDefault();

        onSubmit({
            kas: toMoney(kas),
            tanggal,
        });
    };

    return { kas, setKas, tanggal, setTanggal, total, submit };
}
