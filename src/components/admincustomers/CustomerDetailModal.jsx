import { CalendarDays, Clock3, Mail, MapPin, Phone, UserRound } from "lucide-react";

import { formatDateTime } from "../../utils/format.js";

import CustomerDetailShell from "./customerdetail/CustomerDetailShell.jsx";
import CustomerDetailHeader from "./customerdetail/CustomerDetailHeader.jsx";
import CustomerStats from "./customerdetail/CustomerStats.jsx";
import DetailSection from "./customerdetail/DetailSection.jsx";
import DetailRow from "./customerdetail/DetailRow.jsx";
import { formatDateLong } from "./customerdetail/format.js";

export default function CustomerDetailModal({ showDetailModal, setShowDetailModal, detailCustomer }) {
    if (!showDetailModal || !detailCustomer) {
        return null;
    }

    const customer = detailCustomer;

    const email = customer.email || "-";

    const phone = customer.phone || customer.nomorTelepon || "-";

    const totalOrders = Number(customer.totalOrders ?? customer.orderCount ?? 0) || 0;

    const totalSpent = Number(customer.totalSpent ?? 0) || 0;

    const isActive =
        customer.isActive !== false &&
        String(customer.status || "").toUpperCase() !== "INACTIVE";

    const closeModal = () => {
        setShowDetailModal(false);
    };

    return (
        <CustomerDetailShell show={showDetailModal} onClose={closeModal}>
            <CustomerDetailHeader customer={customer} isActive={isActive} onClose={closeModal} />

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <CustomerStats totalOrders={totalOrders} totalSpent={totalSpent} />

                <DetailSection title="Informasi Kontak">
                    <DetailRow icon={Mail} label="Email" value={email} />

                    <DetailRow icon={Phone} label="Nomor Telepon" value={phone} />

                    {customer.alamat && (
                        <DetailRow icon={MapPin} label="Alamat" value={customer.alamat} />
                    )}
                </DetailSection>

                <DetailSection title="Informasi Akun">
                    <DetailRow
                        icon={CalendarDays}
                        label="Bergabung Sejak"
                        value={formatDateLong(customer.createdAt)}
                    />

                    <DetailRow
                        icon={Clock3}
                        label="Terakhir Login"
                        value={formatDateTime(customer.lastLogin)}
                    />

                    <DetailRow
                        icon={UserRound}
                        label="Status Akun"
                        value={isActive ? "Aktif" : "Nonaktif"}
                        valueClass={
                            isActive
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                        }
                    />
                </DetailSection>
            </div>

            <div className="shrink-0 px-4 sm:px-5 py-2 sm:py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40">
                <button
                    type="button"
                    onClick={closeModal}
                    className="w-full h-9 sm:h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold transition"
                >
                    Tutup
                </button>
            </div>
        </CustomerDetailShell>
    );
}
