import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import useOrderDetail from "../hooks/useOrderDetail.js";

import OrderLoading from "../components/detailpesanan/OrderLoading.jsx";
import OrderNotFound from "../components/detailpesanan/OrderNotFound.jsx";
import OrderHeader from "../components/detailpesanan/OrderHeader.jsx";
import OrderStoreSection from "../components/detailpesanan/OrderStoreSection.jsx";
import OrderAddressCard from "../components/detailpesanan/OrderAddressCard.jsx";
import OrderPaymentCard from "../components/detailpesanan/OrderPaymentCard.jsx";
import TrackingTimeline from "../components/detailpesanan/TrackingTimeline.jsx";
import { buildOrderChatState } from "../utils/orderChat.js";

export default function DetailPesanan() {
    const navigate = useNavigate();
    const {
        order,
        loading,
        error,
        currentStep,
        items,
        totalItems,
        subtotal,
        ongkir,
        totalBayar,
        recipientName,
        fullAddress,
        phone,
        beliLagi,
        beliLagiLoading,
        beliLagiError,
    } = useOrderDetail();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f6f6] dark:bg-gray-950">
                <Header />
                <OrderLoading />
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#f6f6f6] dark:bg-gray-950">
                <Header />
                <OrderNotFound error={error} />
                <Footer />
            </div>
        );
    }

    const orderId = order.id || order.orderId || "-";
    const status = String(order.status || "").toUpperCase();

    return (
        <div className="min-h-screen bg-[#f6f6f6] dark:bg-gray-950">
            <Header />

            <main className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
                <OrderHeader
                    orderId={orderId}
                    createdAt={order.createdAt}
                    status={status}
                    currentStep={currentStep}
                />

                <OrderStoreSection
                    items={items}
                    totalItems={totalItems}
                    order={order}
                    chatState={buildOrderChatState({ source: "pesanan", order })}
                />

                {["DIKIRIM", "SHIPPED", "SELESAI", "COMPLETED", "DELIVERED"].includes(status) && (
                    <TrackingTimeline pesananId={orderId} resi={order.resi || order.nomorResi} />
                )}

                <div className="mt-3 grid lg:grid-cols-5 gap-3">
                    <OrderAddressCard
                        recipientName={recipientName}
                        phone={phone}
                        fullAddress={fullAddress}
                        order={order}
                    />

                    <OrderPaymentCard
                        totalItems={totalItems}
                        subtotal={subtotal}
                        ongkir={ongkir}
                        totalBayar={totalBayar}
                        order={order}
                        onHubungiPenjual={() =>
                            navigate("/chat", {
                                state: buildOrderChatState({ source: "pesanan", order }),
                            })
                        }
                        onBeliLagi={beliLagi}
                        beliLagiLoading={beliLagiLoading}
                        beliLagiError={beliLagiError}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
