import { AnimatePresence, motion as Motion } from "framer-motion";

import { getOrderStatusMeta, ORDER_STATUSES } from "../../utils/orderStatus.js";

import OrderStatusHeader from "./statusmodal/OrderStatusHeader.jsx";
import CourierInfo from "./statusmodal/CourierInfo.jsx";
import CurrentStatus from "./statusmodal/CurrentStatus.jsx";
import UnpaidNotice from "./statusmodal/UnpaidNotice.jsx";
import StatusSelect from "./statusmodal/StatusSelect.jsx";
import ResiInput from "./statusmodal/ResiInput.jsx";
import ChangePreview from "./statusmodal/ChangePreview.jsx";
import OrderStatusFooter from "./statusmodal/OrderStatusFooter.jsx";
import TrackingAdvance from "./statusmodal/TrackingAdvance.jsx";

export default function OrderStatusModal({
    order,
    tempStatus,
    setTempStatus,
    tempResi,
    setTempResi,
    onSave,
    onClose,
    onLanjutkanTracking,
    trackingLoading,
    trackingNotice,
}) {
    if (!order) return null;

    const currentStatus = order.status || "PENDING";

    /*
     * Pesanan yang belum dibayar hanya boleh dibatalkan — backend menolak
     * perpindahan lain, jadi pilihannya tidak perlu ditawarkan di sini.
     */
    const isUnpaid = ["PENDING", "UNPAID"].includes(String(currentStatus).toUpperCase());

    const getAvailableStatuses = () => {
        const current = String(currentStatus).toUpperCase();

        if (isUnpaid) {
            return ORDER_STATUSES.filter((s) => ["PENDING", "DIBATALKAN"].includes(s));
        }

        switch (current) {
            case "DIKEMAS":
                return ORDER_STATUSES.filter((s) => ["DIKEMAS", "DIKIRIM"].includes(s));
            case "DIKIRIM":
                return ORDER_STATUSES.filter((s) => ["DIKIRIM", "SELESAI"].includes(s));
            case "SELESAI":
                return ORDER_STATUSES.filter((s) => ["SELESAI"].includes(s));
            case "DIBATALKAN":
                return ORDER_STATUSES.filter((s) => ["DIBATALKAN"].includes(s));
            case "DIKEMBALIKAN":
                return ORDER_STATUSES.filter((s) => ["DIKEMBALIKAN"].includes(s));
            default:
                return ORDER_STATUSES;
        }
    };

    const currentMeta = getOrderStatusMeta(currentStatus);

    const selectedMeta = getOrderStatusMeta(tempStatus);

    const hasChanged =
        String(currentStatus).toUpperCase() !== String(tempStatus).toUpperCase() ||
        (tempStatus === "DIKIRIM" && tempResi !== (order.nomorResi || ""));

    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/35 backdrop-blur-sm"
            >
                <Motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={(event) => event.stopPropagation()}
                    className="w-full max-w-md max-h-[95vh] flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
                >
                    <OrderStatusHeader order={order} onClose={onClose} />

                    <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto min-h-0">
                        {order.ongkirKurir && <CourierInfo order={order} />}

                        <CurrentStatus currentStatus={currentStatus} meta={currentMeta} />

                        {(String(currentStatus).toUpperCase() === "DIKIRIM" ||
                            String(currentStatus).toUpperCase() === "SELESAI") && (
                            <TrackingAdvance
                                onAdvance={onLanjutkanTracking}
                                loading={trackingLoading}
                                notice={trackingNotice}
                            />
                        )}

                        {isUnpaid && <UnpaidNotice />}

                        <StatusSelect
                            tempStatus={tempStatus}
                            onTempStatusChange={setTempStatus}
                            statuses={getAvailableStatuses()}
                            meta={selectedMeta}
                        />

                        {tempStatus === "DIKIRIM" && (
                            <ResiInput
                                tempResi={tempResi}
                                onTempResiChange={setTempResi}
                                kurir={order.ongkirKurir}
                            />
                        )}

                        {hasChanged && (
                            <ChangePreview
                                currentStatus={currentStatus}
                                tempStatus={tempStatus}
                                meta={selectedMeta}
                            />
                        )}
                    </div>

                    <OrderStatusFooter onClose={onClose} onSave={onSave} disabled={!hasChanged} />
                </Motion.div>
            </Motion.div>
        </AnimatePresence>
    );
}
