import { CheckCircle2 } from "lucide-react";

import { Panel } from "../LaporanCard.jsx";

export default function SaldoAwalDone() {
    return (
        <Panel title="Saldo Awal">
            <div className="p-4 sm:p-5">
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-900/10 p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                                Saldo awal sudah tercatat
                            </h3>

                            <p className="mt-1.5 text-[10px] leading-relaxed text-emerald-700 dark:text-emerald-400">
                                Jurnal pembuka hanya boleh dibuat sekali. Bila angkanya keliru,
                                koreksi dicatat sebagai jurnal baru, bukan dengan menimpa jurnal
                                pembuka.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    );
}
