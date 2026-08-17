import { motion as Motion } from "framer-motion";

import PaymentSummary from "../../components/payments/PaymentSummary.jsx";
import PaymentErrorBanner from "../../components/payments/PaymentErrorBanner.jsx";
import PaymentSkeleton from "../../components/payments/PaymentSkeleton.jsx";
import PaymentEmpty from "../../components/payments/PaymentEmpty.jsx";
import PaymentCard from "../../components/payments/PaymentCard.jsx";

import { isPaidStatus } from "../../utils/paymentInvoice.js";

export default function PaymentsSection({
    error,
    loading,
    items,
    customerName,
    customerEmail,
    onSyncPayment,
    notify,
}) {
    const totalPayments = items.length;

    const paidPayments = items.filter((item) => isPaidStatus(item.status)).length;

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <PaymentSummary totalPayments={totalPayments} paidPayments={paidPayments} />

            <PaymentErrorBanner error={error} />

            {loading ? (
                <PaymentSkeleton />
            ) : items.length === 0 ? (
                <PaymentEmpty />
            ) : (
                <div className="space-y-3">
                    {items.map((payment) => (
                        <PaymentCard
                            key={payment.id || payment.externalId || payment.invoiceId}
                            payment={payment}
                            customerName={customerName}
                            customerEmail={customerEmail}
                            onSyncPayment={onSyncPayment}
                            notify={notify}
                        />
                    ))}
                </div>
            )}
        </Motion.div>
    );
}
